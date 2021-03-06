import { createCollection } from '../../vulcan-lib';
import { userCanDo, userOwns } from '../../vulcan-users/permissions';
import schema from './schema';
import { makeEditable } from '../../editor/make_editable';
import { addUniversalFields, getDefaultResolvers, getDefaultMutations } from '../../collectionUtils'
import type { AlgoliaDocument } from '../../../server/search/utils';

const options = {
  newCheck: (user: DbUser|null, document: DbSequence|null) => {
    if (!user || !document) return false;
    return userOwns(user, document) ? userCanDo(user, 'sequences.new.own') : userCanDo(user, `sequences.new.all`)
  },

  editCheck: (user: DbUser|null, document: DbSequence|null) => {
    if (!user || !document) return false;
    return userOwns(user, document) ? userCanDo(user, 'sequences.edit.own') : userCanDo(user, `sequences.edit.all`)
  },

  removeCheck: (user: DbUser|null, document: DbSequence|null) => {
    if (!user || !document) return false;
    return userOwns(user, document) ? userCanDo(user, 'sequences.edit.own') : userCanDo(user, `sequences.edit.all`)
  },
}

interface ExtendedSequencesCollection extends SequencesCollection {
  // Functions in search/utils.ts
  toAlgolia: (sequence: DbSequence) => Promise<Array<AlgoliaDocument>|null>
}

export const Sequences: ExtendedSequencesCollection = createCollection({
  collectionName: 'Sequences',
  typeName: 'Sequence',
  schema,
  resolvers: getDefaultResolvers('Sequences'),
  mutations: getDefaultMutations('Sequences', options)
})

export const makeEditableOptions = {
  order: 20
}

makeEditable({
  collection: Sequences,
  options: makeEditableOptions
})
addUniversalFields({collection: Sequences})

export default Sequences;
