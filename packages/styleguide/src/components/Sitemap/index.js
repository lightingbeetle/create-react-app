import React from 'react';
import { array } from 'prop-types';
import { Switch, Route } from 'react-router-dom';

import styled from 'styled-components';

const propTypes = {
  routes: array,
};

// flatten routes to single level array
const getRoutes = (nodes, path = '') => {
  const result = [];

  nodes.forEach(node => {
    const modifiedNode = {
      ...node,
      leaf: !node.nodes,
      absolutePath: path + node.path,
    };

    result.push(modifiedNode);
    if (modifiedNode.nodes) {
      result.push(...getRoutes(modifiedNode.nodes, modifiedNode.absolutePath));
    }
  });

  return result;
};

const Sitemap = ({ routes = [] }) => {
  // create styleguide routes
  const styleguideRoutes = getRoutes(routes)
    .filter(route => route.render)
    .map(route => (
      <Route
        key={route.absolutePath}
        path={route.absolutePath}
        render={() => route.render}
        exact={route.absolutePath === '/' || !route.leaf}
      />
    ));

  return (
    <SitemapWrapper>
      <Switch>
        {[...styleguideRoutes, <Route key="404" render={() => '404'} />]}
      </Switch>
    </SitemapWrapper>
  );
};

const SitemapWrapper = styled('div')`
  margin-top: ${props => props.theme.sizes.headerHeight};
`;

Sitemap.displayName = 'Sitemap';
Sitemap.propTypes = propTypes;

export default Sitemap;
