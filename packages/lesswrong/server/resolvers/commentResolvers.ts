import { addGraphQLMutation, addGraphQLResolvers, runCallbacks, runCallbacksAsync } from '../../lib/vulcan-lib';
import { encodeIntlError} from '../../lib/vulcan-lib/utils';
import { userCanModerateComment } from "../../lib/collections/users/helpers";
import { accessFilterSingle } from '../../lib/utils/schemaUtils';

const specificResolvers = {
  Mutation: {
    async moderateComment(root: void, { commentId, deleted, deletedPublic, deletedReason}: {
      commentId: string, deleted: boolean, deletedPublic: boolean, deletedReason: string
    }, context: ResolverContext) {
      const {currentUser} = context;
      const comment = context.Comments.findOne(commentId)
      if (!comment) throw new Error("Invalid commentId");
      const post = comment.postId && context.Posts.findOne(comment.postId)
      if (!post) throw new Error("Cannot find post");
      
      if (currentUser && userCanModerateComment(currentUser, post, comment)) {

        let set: Record<string,any> = {deleted: deleted}
        if (deleted) {
          set.deletedPublic = deletedPublic;
          set.deletedDate = comment.deletedDate || new Date();
          set.deletedReason = deletedReason;
          set.deletedByUserId = currentUser._id;
        } else { //When you undo delete, reset all delete-related fields
          set.deletedPublic = false;
          set.deletedDate = null;
          set.deletedReason = "";
          set.deletedByUserId = null;
        }
        let modifier = { $set: set };
        modifier = runCallbacks({
          name: 'comments.moderate.sync',
          iterator: modifier
        });
        context.Comments.update({_id: commentId}, modifier);
        const updatedComment = await context.Comments.findOne(commentId)
        runCallbacksAsync({
          name: 'comments.moderate.async',
          properties: [updatedComment, comment, context]
        });
        return await accessFilterSingle(context.currentUser, context.Comments, updatedComment, context);
      } else {
        throw new Error(encodeIntlError({id: `app.user_cannot_moderate_post`}));
      }
    }
  }
};

addGraphQLResolvers(specificResolvers);
addGraphQLMutation('moderateComment(commentId: String, deleted: Boolean, deletedPublic: Boolean, deletedReason: String): Comment');
