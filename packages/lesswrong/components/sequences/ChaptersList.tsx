import React from 'react';
import { registerComponent, Components } from '../../lib/vulcan-lib';
import { useMulti } from '../../lib/crud/withMulti';
import Chapters from '../../lib/collections/chapters/collection';

const ChaptersList = ({terms, canEdit}: {
  terms: any,
  canEdit: boolean,
}) => {
  const { results, loading } = useMulti({
    terms,
    collection: Chapters,
    fragmentName: 'ChaptersFragment',
    enableTotal: false,
  });
  if (results && !loading) {
    return <div className="chapters-list">
      {results.map((chapter) => <Components.ChaptersItem key={chapter._id} chapter={chapter} canEdit={canEdit} />)}
    </div>
  } else {
    return <Components.Loading />
  }
}

const ChaptersListComponent = registerComponent('ChaptersList', ChaptersList)

declare global {
  interface ComponentTypes {
    ChaptersList: typeof ChaptersListComponent
  }
}

