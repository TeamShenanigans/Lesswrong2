import React from 'react';
import { registerComponent, getSetting } from 'meteor/vulcan:core';
import { useCurrentUser } from '../common/withUser';
import Users from 'meteor/vulcan:users';
import { createStyles } from '@material-ui/core/styles'
import classNames from 'classnames';

const styles = createStyles(theme => ({
  root: {
    padding: "1em 0",
  },
  emailLink: {
    textDecoration: "underline !important",
  
    "&:hover": {
      color: "rgba(0,0,0,.5)"
    }
  },
}));

const CantCommentExplanation = ({post, classes}) => {
  const currentUser = useCurrentUser();
  return (
    <div className={classNames("i18n-message", "author_has_banned_you", classes.root)}>
      { Users.blockedCommentingReason(currentUser, post)}
      { getSetting('forumType') !== 'AlignmentForum' && <span>
        (Questions? Send an email to <a className={classes.emailLink} href="mailto:moderation@lesserwrong.com">moderation@lesserwrong.com</a>)
      </span> }
    </div>
  );
}

const CantCommentExplanationComponent = registerComponent(
  'CantCommentExplanation', CantCommentExplanation, {styles}
);

declare global {
  interface ComponentTypes {
    CantCommentExplanation: typeof CantCommentExplanationComponent,
  }
}