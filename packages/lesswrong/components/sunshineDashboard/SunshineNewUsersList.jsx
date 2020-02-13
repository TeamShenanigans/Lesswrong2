import { Components, registerComponent } from 'meteor/vulcan:core';
import { withMulti } from '../../lib/crud/withMulti';
import React, { Component } from 'react';
import Users from 'meteor/vulcan:users';
import withUser from '../common/withUser';
import PropTypes from 'prop-types';

class SunshineNewUsersList extends Component {
  render () {
    const { results, totalCount, allowContentPreview } = this.props
    const { SunshineListCount, SunshineListTitle, SunshineNewUsersItem } = Components
    if (results && results.length && Users.canDo(this.props.currentUser, "posts.moderate.all")) {
      return (
        <div>
          <SunshineListTitle>
            <span>New Users</span>
            <SunshineListCount count={totalCount}/>
          </SunshineListTitle>
          {this.props.results.map(user =>
            <div key={user._id} >
              <SunshineNewUsersItem user={user} allowContentPreview={allowContentPreview}/>
            </div>
          )}
        </div>
      )
    } else {
      return null
    }
  }
}

SunshineNewUsersList.propTypes = {
  results: PropTypes.array,
};

const withListOptions = {
  collection: Users,
  queryName: 'sunshineNewPostsListQuery',
  fragmentName: 'SunshineUsersList',
  enableTotal: true,
  ssr: true
};

registerComponent('SunshineNewUsersList', SunshineNewUsersList, [withMulti, withListOptions], withUser);