import { registerComponent, Components } from '../../lib/vulcan-lib';
import React from 'react';
import withHover from '../common/withHover';
import { forumTypeSetting } from '../../lib/instanceSettings';
import { PopperPlacementType } from '@material-ui/core/Popper'

const PostsItemKarma = ({post, hover, anchorEl, placement="left"}: {
  post: PostsBase,
  hover?: any,
  anchorEl?: any,
  placement?: PopperPlacementType
}) => {
  const baseScore = forumTypeSetting.get() === 'AlignmentForum' ? post.afBaseScore : post.baseScore
  const afBaseScore = forumTypeSetting.get() !== 'AlignmentForum' && post.af ? post.afBaseScore : null
  const { LWPopper } = Components
  return (
    <span>
      <LWPopper open={hover} anchorEl={anchorEl} tooltip placement={placement}>
        <div>
          <div>{ baseScore || 0 } karma</div>
          <div>({ post.voteCount} votes)</div>
          {afBaseScore && <div><em>({afBaseScore} karma on AlignmentForum.org)</em></div>}
        </div>
      </LWPopper>
      { baseScore || 0 }
    </span>
  )
};

const PostsItemKarmaComponent = registerComponent('PostsItemKarma', PostsItemKarma, {
  hocs: [withHover()]
});

declare global {
  interface ComponentTypes {
    PostsItemKarma: typeof PostsItemKarmaComponent,
  }
}
