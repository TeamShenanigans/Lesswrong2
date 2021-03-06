import React, { PureComponent } from 'react';
import { registerComponent } from '../../../lib/vulcan-lib';
import { withUpdate } from '../../../lib/crud/withUpdate';
import { withMessages } from '../../common/withMessages';
import MenuItem from '@material-ui/core/MenuItem';
import { userOwns } from '../../../lib/vulcan-users/permissions';
import { userCanModeratePost } from '../../../lib/collections/users/helpers';
import withUser from '../../common/withUser';
import * as _ from 'underscore';

interface ExternalProps {
  comment: CommentsList,
  post: PostsBase,
}
interface BanUserFromAllPersonalPostsMenuItemProps extends ExternalProps, WithMessagesProps, WithUserProps, WithUpdateUserProps {
}

class BanUserFromAllPersonalPostsMenuItem extends PureComponent<BanUserFromAllPersonalPostsMenuItemProps,{}> {
  handleBanUserFromAllPosts = (event: React.MouseEvent) => {
    const { currentUser, comment, flash, updateUser } = this.props;
    if (!currentUser) return;
    event.preventDefault();
    if (confirm("Are you sure you want to ban this user from commenting on all your personal blog posts?")) {
      const commentUserId = comment.userId
      let bannedPersonalUserIds = _.clone(currentUser.bannedPersonalUserIds) || []
      if (!bannedPersonalUserIds.includes(commentUserId)) {
        bannedPersonalUserIds.push(commentUserId)
      }
      void updateUser({
        selector: { _id: currentUser._id },
        data: {bannedPersonalUserIds:bannedPersonalUserIds},
      }).then(()=>flash({messageString: `User ${comment?.user?.displayName} is now banned from commenting on any of your personal blog posts`}))
    }
  }

  render() {
    const { currentUser, post } = this.props
    if (userCanModeratePost(currentUser, post) && !post.frontpageDate && userOwns(currentUser, post)) {
        return <MenuItem onClick={ this.handleBanUserFromAllPosts }>
          Ban from all your personal blog posts
        </MenuItem>
      } else {
        return null
      }
  }
}

const BanUserFromAllPersonalPostsMenuItemComponent = registerComponent<ExternalProps>(
  'BanUserFromAllPersonalPostsMenuItem', BanUserFromAllPersonalPostsMenuItem, {
    hocs: [
      withMessages,
      withUpdate({
        collectionName: "Users",
        fragmentName: 'UsersProfile',
      }),
      withUser
    ]
  }
);

declare global {
  interface ComponentTypes {
    BanUserFromAllPersonalPostsMenuItem: typeof BanUserFromAllPersonalPostsMenuItemComponent,
  }
}

