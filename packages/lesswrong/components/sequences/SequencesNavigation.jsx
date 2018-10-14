import { Components, registerComponent, withDocument, Utils } from 'meteor/vulcan:core';
import Sequences from '../../lib/collections/sequences/collection.js';
import { Link } from 'react-router';
import React from 'react';

const SequencesNavigation = ({
  document,
  documentId,
  loading,
  post
}) => {
  if (!(document && !loading)) {
    return <div><Components.Loading /></div>
  }
  
  let title = document ? document.title : ""
  let titleUrl = documentId ? "/s/" + documentId : ""
  const { nextPost, prevPost } = Utils.getSequencePostLinks(document, post)
  
  return <Components.CollectionsNavigation
    nextPostUrl={document && nextPost && "/s/" + document._id + (nextPost ? ("/p/" + nextPost._id) : "")}
    prevPostUrl={document && prevPost && "/s/" + document._id + (prevPost ? ("/p/" + prevPost._id) : "")}
    title={title}
    titleUrl={titleUrl}
  />
}

const options = {
  collection: Sequences,
  queryName: "SequencesNavigationQuery",
  fragmentName: 'SequencesNavigationFragment',
  enableTotal: false,
}

registerComponent('SequencesNavigation', SequencesNavigation, [withDocument, options]);
