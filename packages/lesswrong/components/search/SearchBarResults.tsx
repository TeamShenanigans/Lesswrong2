import React, { Component } from 'react';
import { registerComponent, Components, getSetting } from '../../lib/vulcan-lib';
import { Hits, Configure, Index, CurrentRefinements } from 'react-instantsearch-dom';
import Typography from '@material-ui/core/Typography';
import { algoliaIndexNames } from '../../lib/algoliaUtil';
import { Link } from '../../lib/reactRouterWrapper';

const styles = theme => ({
  root: {
    color: "rgba(0,0,0, 0.87)",
    transition: "opacity .1s ease-in-out",
    zIndex: theme.zIndexes.searchResults,
    width:520,
    position: "fixed",
    right: 0,
    top: getSetting('forumType') === 'EAForum' ? 90 : 64,
    display: "flex",
    flexWrap: "wrap",
    [theme.breakpoints.down('sm')]: {
      width: "100%"
    },
    [theme.breakpoints.down('xs')]: {
      top: 48,
    },
    "& .ais-CurrentRefinements": {
      display: 'inline-block',
      position: 'absolute',
      padding: '0px 16px',
      top: 16
    },
    "& .ais-CurrentRefinements-item": {
      border: '1px solid rgba(0,0,0,0.3)',
      borderRadius: 20,
      padding: '8px',
    },
    "& .ais-CurrentRefinements-label": {
      marginRight: 5
    },
  },
  searchResults: {
    overflow:"scroll",
    width: "100%",
    height: "calc(100vh - 48px)",
    backgroundColor: theme.palette.background.default,
    paddingBottom: 100,
    [theme.breakpoints.up('md')]: {
      marginLeft: 20,
      boxShadow: "0 0 20px rgba(0,0,0,.2)",
      height: "calc(100vh - 64px)",
    },
  },
  searchList: {
    borderBottom: "solid 1px rgba(0,0,0,.3)",
    paddingTop:theme.spacing.unit,
    paddingBottom:theme.spacing.unit,
    paddingLeft:theme.spacing.unit*2,
    paddingRight:theme.spacing.unit*2
  },
  seeAll: {
    ...theme.typography.commentStyle,
    color: theme.palette.lwTertiary.main
  },
  header: {
    cursor: "pointer",
    display:"flex",
    justifyContent:"space-between",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    '& h1': {
      margin:0
    },
    '&:hover': {
      opacity: .5,
    }
  },
})

interface ExternalProps {
  closeSearch: any
}
interface SearchBarResultsProps extends ExternalProps, WithStylesProps{
}

class SearchBarResults extends Component<SearchBarResultsProps> {

  render() {
    const { classes, closeSearch } = this.props

    return <div className={classes.root}>
      <div className={classes.searchResults}>
        <CurrentRefinements />
        <Components.ErrorBoundary>
          <div className={classes.searchList}>
            <Index indexName={algoliaIndexNames.Users}>
              <div className={classes.header}>
                <Typography variant="body1">Users</Typography>
                <Link to={"/search"} className={classes.seeAll}>
                  See all results
                </Link>
              </div>
              <Configure hitsPerPage={3} />
              <Hits hitComponent={(props) => <Components.UsersSearchHit clickAction={closeSearch} {...props} />} />
            </Index>
          </div>
        </Components.ErrorBoundary>
        <Components.ErrorBoundary>
          <div className={classes.searchList}>
            <Index indexName={algoliaIndexNames.Posts}>
              <div className={classes.header}>
                <Typography variant="body1">Posts</Typography>
              </div>

              <Configure hitsPerPage={3} />
              <Hits hitComponent={(props) => <Components.PostsSearchHit clickAction={closeSearch} {...props} />} />
            </Index>
          </div>
        </Components.ErrorBoundary>
        <Components.ErrorBoundary>
          <div className={classes.searchList}>
            <Index indexName={algoliaIndexNames.Comments}>
              <div className={classes.header}>
                <Typography variant="body1">Comments</Typography>
              </div>
              <Configure hitsPerPage={3} />
              <Hits hitComponent={(props) => <Components.CommentsSearchHit clickAction={closeSearch} {...props} />} />
            </Index>
          </div>
        </Components.ErrorBoundary>
    </div>
  </div>
  }
}

const SearchBarResultsComponent = registerComponent<ExternalProps>("SearchBarResults", SearchBarResults, {styles});

declare global {
  interface ComponentTypes {
    SearchBarResults: typeof SearchBarResultsComponent
  }
}

