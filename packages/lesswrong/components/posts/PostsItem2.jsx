import { Components, registerComponent, withMutation, getActions } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link } from '../../lib/reactRouterWrapper.js';
import { Posts } from "../../lib/collections/posts";
import withErrorBoundary from '../common/withErrorBoundary';
import Typography from '@material-ui/core/Typography';
import withUser from "../common/withUser";
import classNames from 'classnames';
import { connect } from 'react-redux';
import withNewEvents from '../../lib/events/withNewEvents.jsx';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import grey from '@material-ui/core/colors/grey';
import { SECTION_WIDTH } from '../common/SingleColumnSection';
import Hidden from '@material-ui/core/Hidden';

import { POSTED_AT_WIDTH, START_TIME_WIDTH } from './PostsItemDate.jsx';

export const MENU_WIDTH = 18
export const EVENT_WIDTH = 110
export const KARMA_WIDTH = 42
export const COMMENTS_WIDTH = 48

const COMMENTS_BACKGROUND_COLOR = grey[200]

const styles = (theme) => ({
  root: {
    position: "relative",
    width: SECTION_WIDTH,
    paddingRight: 16,
    [theme.breakpoints.down('sm')]: {
      width: "100%"
    },
    '&:hover $actions': {
      opacity: .2,
    }
  },
  postsItem: {
    display: "flex",
    paddingTop: theme.spacing.unit*1.5,
    paddingBottom: theme.spacing.unit*1.5,
    alignItems: "center",
    flexWrap: "nowrap",
    [theme.breakpoints.down('sm')]: {
      flexWrap: "wrap",
    },
  },
  background: {
    transition: "3s",
    borderBottom: "solid 1px rgba(0,0,0,.2)",
    width: "100%",
  },
  commentsBackground: {
    backgroundColor: COMMENTS_BACKGROUND_COLOR,
    transition: "0s",
  },
  commentBox: {
    borderLeft: "solid 1px rgba(0,0,0,.2)",
    borderRight: "solid 1px rgba(0,0,0,.2)",
    paddingBottom: 0,
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing.unit
    }
  },
  firstItem: {
    borderTop: "solid 1px rgba(0,0,0,.2)"
  },
  karma: {
    width: 42,
    justifyContent: "center",
    [theme.breakpoints.down('sm')]:{
      width: "unset",
      justifyContent: "flex-start",
      marginLeft: 2,
      marginRight: theme.spacing.unit
    }
  },
  title: {
    height: 22,
    flexGrow: 1,
    flexShrink: 1,
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginRight: 12,
    [theme.breakpoints.down('sm')]: {
      order:-1,
      height: "unset",
      marginBottom: theme.spacing.unit,
      maxWidth: "unset",
      width: "100%",
      paddingRight: theme.spacing.unit
    },
    '&:hover': {
      opacity: 1,
    }
  },
  author: {
    justifyContent: "flex-end",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis", // I'm not sure this line worked properly?
    marginRight: theme.spacing.unit*1.5,
    [theme.breakpoints.down('sm')]: {
      justifyContent: "flex-start",
      width: "unset",
      marginLeft: 0,
      flex: "unset"
    }
  },
  event: {
    width: EVENT_WIDTH,
    justifyContent: "flex-end",
    flex: 1,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis", // I'm not sure this line worked properly?
    marginRight: theme.spacing.unit*1.5,
    [theme.breakpoints.down('sm')]: {
      justifyContent: "flex-start",
      width: "unset",
      maxWidth: EVENT_WIDTH,
      marginLeft: 0,
      flex: "unset"
    }
  },
  postedAt: {
    '&&': {
      width: POSTED_AT_WIDTH,
      fontWeight: 300,
      fontSize: "1rem",
      color: "rgba(0,0,0,.9)",
      [theme.breakpoints.down('sm')]: {
        width: "auto",
      }
    }
  },
  startTime: {
    '&&': {
      width: START_TIME_WIDTH,
      justifyContent: "center",
      fontWeight: 300,
      fontSize: "1rem",
      color: "rgba(0,0,0,.9)",
      [theme.breakpoints.down('sm')]: {
        justifyContent: "flex-start",
        width: "auto",
        flexGrow: 1,
      }
    }
  },
  newCommentsSection: {
    width: "100%",
    marginTop: theme.spacing.unit,
    padding: theme.spacing.unit*2,
    cursor: "pointer",
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    }
  },
  closeComments: {
    color: theme.palette.grey[500],
    textAlign: "right",
  },
  commentsIcon: {
    width: COMMENTS_WIDTH,
    height: 24,
    cursor: "pointer",
    position: "relative",
    flexShrink: 0,
    top: 2
  },
  actions: {
    opacity: 0,
    display: "flex",
    position: "absolute",
    top: 0,
    right: -MENU_WIDTH,
    width: MENU_WIDTH,
    height: "100%",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    '&:hover': {
      opacity: 1
    },
    [theme.breakpoints.down('sm')]: {
      display: "none"
    }
  },
  actionsMenu: {
    position: "absolute",
    top: 0,
  },
  mobileSecondRowSpacer: {
    [theme.breakpoints.up('md')]: {
      display: "none",
    },
    flexGrow: 1,
  },
  mobileActions: {
    cursor: "pointer",
    width: MENU_WIDTH,
    opacity: .5,
    marginRight: theme.spacing.unit,
    display: "none",
    [theme.breakpoints.down('sm')]: {
      display: "block"
    }
  },
})

class PostsItem2 extends PureComponent {
  constructor(props) {
    super(props)
    this.state = { showComments: false, readComments: false}
    this.postsItemRef = React.createRef();
  }

  toggleComments = (scroll) => {
    this.handleMarkAsRead()
    this.setState((prevState) => {
      if (scroll) {
        this.postsItemRef.current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
      }
      return ({
        showComments:!prevState.showComments,
        readComments: true
      })
    })
  }

  async handleMarkAsRead () {
    const {
      // from the parent component, used in withDocument, GraphQL HOC
      // from connect, Redux HOC
      setViewed,
      postsViewed,
      post,
      // from withMutation, GraphQL HOC
      increasePostViewCount,
    } = this.props;
    // a post id has been found & it's has not been seen yet on this client session
    if (post && post._id && postsViewed && !postsViewed.includes(post._id)) {

      // trigger the asynchronous mutation with postId as an argument
      await increasePostViewCount({postId: post._id});

      // once the mutation is done, update the redux store
      setViewed(post._id);
    }

    //LESSWRONG: register page-visit event
    if (this.props.currentUser) {
      const eventProperties = {
        userId: this.props.currentUser._id,
        important: false,
        intercom: true,
      };

      eventProperties.documentId = post._id;
      eventProperties.postTitle = post.title;
      this.props.registerEvent('post-view', eventProperties)
    }
  }

  isSticky = (post, terms) => {
    if (post && terms && terms.forum) {
      return (
        post.sticky ||
        (terms.af && post.afSticky) ||
        (terms.meta && post.metaSticky)
      )
    }
  }

  render() {
    const { classes, post, chapter, currentUser, index, terms } = this.props
    const { showComments, readComments } = this.state
    const { PostsItemComments, PostsItemKarma, PostsItemTitle, PostsUserAndCoauthors, EventVicinity, PostsPageActions, PostsItemIcons, PostsItem2MetaInfo } = Components

    const postLink = chapter ? ("/s/" + chapter.sequenceId + "/p/" + post._id) : Posts.getPageUrl(post)
    
    return (
      <div className={classes.root} ref={this.postsItemRef}>
        <div className={classNames(
          classes.background,
          {
            [classes.commentsBackground]: showComments,
            [classes.firstItem]: (index===0) && showComments,
            "personalBlogpost": !post.frontpageDate,
            [classes.commentBox]: showComments
          }
        )}>
          <div className={classes.postsItem}>
            <PostsItem2MetaInfo className={classes.karma}>
              <PostsItemKarma post={post} />
            </PostsItem2MetaInfo>

            <Link to={postLink} className={classes.title}>
              <PostsItemTitle post={post} postItem2 read={post.lastVisitedAt} sticky={this.isSticky(post, terms)} />
            </Link>

            { post.user && !post.isEvent && <PostsItem2MetaInfo className={classes.author}>
              <PostsUserAndCoauthors post={post}/>
            </PostsItem2MetaInfo>}

            { post.isEvent && <PostsItem2MetaInfo className={classes.event}>
              <EventVicinity post={post} />
            </PostsItem2MetaInfo>}

            <Components.PostsItemDate post={post}/>

            <div className={classes.mobileSecondRowSpacer}/>
            
            {<div className={classes.mobileActions}>
              <PostsPageActions post={post} menuClassName={classes.actionsMenu} />
            </div>}

            <Hidden mdUp implementation="css">
              <PostsItemIcons post={post}/>
            </Hidden>

            <div className={classes.commentsIcon}>
              <PostsItemComments post={post} onClick={() => this.toggleComments(false)} readStatus={readComments}/>
            </div>

          </div>
          {<div className={classes.actions}>
            <PostsPageActions post={post} vertical menuClassName={classes.actionsMenu} />
          </div>}
          
          {this.state.showComments && <div className={classes.newCommentsSection} onClick={() => this.toggleComments(true)}>
            <Components.PostsItemNewCommentsWrapper
              currentUser={currentUser}
              highlightDate={post.lastVisitedAt}
              terms={{view:"postCommentsUnread", limit:5, postId: post._id}}
              post={post}
            />
            <Typography variant="body2" className={classes.closeComments}><a>Close</a></Typography>
          </div>}
        </div>
      </div>
    )
  }
}

PostsItem2.propTypes = {
  currentUser: PropTypes.object,
  post: PropTypes.object.isRequired,
  postsViewed: PropTypes.array,
  setViewed: PropTypes.func,
  increasePostViewCount: PropTypes.func,
};

const mutationOptions = {
  name: 'increasePostViewCount',
  args: {postId: 'String'},
};

const mapStateToProps = state => ({ postsViewed: state.postsViewed });
const mapDispatchToProps = dispatch => bindActionCreators(getActions().postsViewed, dispatch);

registerComponent(
  'PostsItem2',
  PostsItem2,
  withMutation(mutationOptions),
  withNewEvents,
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles, { name: "PostsItem2" }),
  withErrorBoundary,
  withUser
);
