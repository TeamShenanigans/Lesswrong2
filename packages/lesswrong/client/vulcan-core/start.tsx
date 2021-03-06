import React from 'react';
import ReactDOM from 'react-dom';
import { onPageLoad } from 'meteor/server-render';
import AppGenerator from './AppGenerator';
import { onStartup } from '../../lib/executionEnvironment';

import { createApolloClient } from '../vulcan-lib/apollo-client/apolloClient';
import { populateComponentsApp } from '../../lib/vulcan-lib';

onStartup(() => {
  // init the application components and routes, including components & routes from 3rd-party packages
  populateComponentsApp();
  const apolloClient = createApolloClient();
  apolloClient.disableNetworkFetches = true;

  // Create the root element, if it doesn't already exist.
  if (!document.getElementById('react-app')) {
    const rootElement = document.createElement('div');
    rootElement.id = 'react-app';
    document.body.appendChild(rootElement);
  }

  const abTestGroups = {};
  const Main = () => (
    <AppGenerator apolloClient={apolloClient} abTestGroups={abTestGroups} />
  );

  onPageLoad(() => {
    ReactDOM.hydrate(
      <Main />,
      document.getElementById('react-app'),
      () => {
        apolloClient.disableNetworkFetches = false;
      }
    );
  });
});
