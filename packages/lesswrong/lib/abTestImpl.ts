import React from 'react';
import * as _ from 'underscore';
import rng from './seedrandom';

//
// A/B tests. Each A/B test has a name (which should be unique across all A/B
// tests across all time), a set of groups (identified by strings), and a
// weighting for each group (representing the probability that a given user is
// in that group). A given user (or logged-out client) is in exactly one of the
// groups.
//
// You can see what A/B test groups you're in by going to
//   /abTestGroups
//
// Logged-out users are assigned an A/B test group based on their ClientID. If
// they create a new account, that account inherits the test groups of the
// ClientID through which the account was created. Users created before A/B
// tests were created have their test groups instead assigned based on a hash
// of their username. On pageload, which group a user is in is fixed for that
// tab; logging out and logging in as a different user doesn't switch them to
// that user's A/B test group until they refresh or open a new tab.
//
// A/B tests can be overridden server-wide, eg to end an A/B test and put
// everyone in the winning group, by writing an abTestOverride value into the
// databaseMetadata collection. A/B tests can be overridden for an individual
// user by settings the abTestOverrides field on the user object. The override
// will only apply while they are logged in.
//

type ABTestGroup = {
  description: string,
  weight: number,
}

export class ABTest {
  name: string;
  description: string;
  groups: Record<string, ABTestGroup>;
  
  constructor({name, description, groups}: {
    name: string,
    description: string,
    groups: Record<string, ABTestGroup>
  }) {
    const totalWeight = _.reduce(
      Object.keys(groups),
      (sum:number, key:string) => sum+groups[key].weight,
      0
    );
    if (totalWeight === 0) {
      throw new Error("A/B test has no groups defined with nonzero weight");
    }
    
    this.name = name;
    this.description = description;
    this.groups = groups;
    
    registerABTest(this);
  }
}

// CompleteTestGroupAllocation: A dictionary from the names of A/B tests, to
// which group a user is in, which is complete (includes all of the A/B tests
// that are defined).
export type CompleteTestGroupAllocation = Record<string,string>

// RelevantTestGroupAllocation: A dictionary from the names of A/B tests to
// which group a user is in, which is pruned to only the tests which affected
// a particular page render.
export type RelevantTestGroupAllocation = Record<string,string>

export const ABTestGroupsContext = React.createContext<RelevantTestGroupAllocation>({});

let allABTests: Record<string,ABTest> = {};

function registerABTest(abtest: ABTest): void {
  if (abtest.name in allABTests)
    throw new Error(`Two A/B tests with the same name: ${abtest.name}`);
  allABTests[abtest.name] = abtest;
}

export function getABTestsMetadata(): Record<string,ABTest> {
  return allABTests;
}

export function getUserABTestKey(user: UsersCurrent|DbUser|null, clientId: string) {
  if (user?.abTestKey) {
    return user.abTestKey;
  } else {
    return clientId;
  }
}

export function getUserABTestGroup(user: UsersCurrent|DbUser|null, clientId: string, abTest: ABTest): string {
  const abTestKey = getUserABTestKey(user, clientId);
  let groupWeights: Record<string,number> = {};
  for (let group of Object.keys(abTest.groups))
    groupWeights[group] = abTest.groups[group].weight;
  
  if (user?.abTestOverrides && user.abTestOverrides[abTest.name]) {
    return user.abTestOverrides[abTest.name];
  } else {
    return weightedRandomPick(groupWeights, `${abTest.name}-${abTestKey}`);
  }
}

export function getAllUserABTestGroups(user: UsersCurrent|DbUser|null, clientId: string): CompleteTestGroupAllocation {
  let abTestGroups: CompleteTestGroupAllocation = {};
  for (let abTestName in allABTests)
    abTestGroups[abTestName] = getUserABTestGroup(user, clientId, allABTests[abTestName]);
  return abTestGroups;
}

// Given a weighted set of strings and a seed, return a random element of that set.
function weightedRandomPick(options: Record<string,number>, seed: string): string {
  const weights = _.values(options);
  if (weights.length === 0)
    throw new Error("Random pick from empty set");
  const totalWeight: number = _.reduce(weights, (x:number, y:number) => x+y);
  const randomRangeValue = totalWeight*rng(seed).double();
  
  let i=0;
  for (const key in options) {
    i += options[key];
    if (i >= randomRangeValue)
      return key;
  }
  throw new Error("Out of range value in weightedRandomPick");
}
