import schema from './schema';
import { userCanDo } from '../../vulcan-users/permissions';
import { createCollection } from '../../vulcan-lib';
import { addUniversalFields, getDefaultResolvers, getDefaultMutations } from '../../collectionUtils'

const options = {
  create: true,
  createCheck: (user: DbUser|null, document: DbSubscription|null) => {
    if (!user || !document) return false;
    return userCanDo(user, 'subscriptions.new');
  },
  update: false,
  upsert: false, 
  delete: false
}

export const Subscriptions: SubscriptionsCollection = createCollection({
  collectionName: 'Subscriptions',
  typeName: 'Subscription',
  schema,
  resolvers: getDefaultResolvers('Subscriptions'),
  mutations: getDefaultMutations('Subscriptions', options),
});

addUniversalFields({collection: Subscriptions})
export default Subscriptions
