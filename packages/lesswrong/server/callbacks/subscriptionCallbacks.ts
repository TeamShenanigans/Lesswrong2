import { Subscriptions } from '../../lib/collections/subscriptions/collection'
import { getCollectionHooks } from '../mutationCallbacks';

getCollectionHooks("Subscriptions").createBefore.add(async function deleteOldSubscriptions(subscription) {
  const { userId, documentId, collectionName, type } = subscription
  Subscriptions.update({userId, documentId, collectionName, type}, {$set: {deleted: true}}, {multi: true})
  return subscription;
});
