import React, { useState } from 'react';
import { array, func, string, shape } from 'prop-types';
import { NavLink as Link } from 'react-router-dom';
import styled from 'styled-components';
/** https://www.npmjs.com/package/fuzzy */
import fuzzy from 'fuzzy';
import Autocomplete from 'accessible-autocomplete/react';

import { colors } from './../../style/theme';

const propTypes = {
  list: array.isRequired,
  placeholder: string,
  fuzzyOptions: shape({
    pre: string,
    post: string,
    extract: func,
  }),
};

const defaultProps = {
  placeholder: 'Search',
  fuzzyOptions: {
    pre: `<span style="background: ${colors.warning}">`,
    post: '</span>',
    extract: el => el.title,
  },
};

const Search = ({ list, placeholder, fuzzyOptions }) => {
  const [results, setResults] = useState([]);

  const options = { ...defaultProps.fuzzyOptions, ...fuzzyOptions };

  const handleChange = e => {
    const searchValue = e.target.value.replace(/\s/, '');
    setResults(search(searchValue, list));
  };

  const formatMatches = (matches, parentPath, parentTitle, level) =>
    matches.map(match => ({
      title: match.original.title,
      string: match.string,
      path: parentPath + match.original.path,
      breadcrumbs: parentTitle,
      isHidden: match.original.nodes !== undefined,
      level: level,
    }));

  const search = (
    value,
    list,
    parentPath = '',
    parentTitle = '',
    level = 0
  ) => {
    if (value === '') {
      return [];
    } else {
      // search the first level children for match
      const parentMatches = fuzzy.filter(value, list, options);
      // format the matched items for later use
      let matches = formatMatches(
        parentMatches,
        parentPath,
        parentTitle,
        level
      );

      list.forEach(item => {
        // check if item of the list have more subitems
        if (item.nodes) {
          // repeat everything for subitem
          const childMatches = search(
            value,
            item.nodes,
            parentPath + item.path,
            parentTitle + '/' + item.title,
            level + 1
          );
          if (childMatches) {
            // add what you found to existing matches
            matches = [...matches, ...childMatches];
          }
        }
      });

      return matches;
    }
  };

  return (
    <React.Fragment>
      <Autocomplete
        id="autocomplete"
        autoselect={true}
        source={(value, populateResults) => {
          const filteredResults = fuzzy.filter(value, list, options);
          populateResults(filteredResults);
        }}
      />
      <StyledInput
        onChange={handleChange}
        placeholder={placeholder}
        type="text"
      />
      {results.length > 0 && (
        <StyledResults>
          {results.map((result, index) =>
            result.isHidden ? null : (
              <div key={index.toString()}>
                <Link to={result.path}>
                  <strong dangerouslySetInnerHTML={{ __html: result.string }} />
                </Link>{' '}
                <small>{result.breadcrumbs}</small>
              </div>
            )
          )}
        </StyledResults>
      )}
    </React.Fragment>
  );
};

const StyledInput = styled.input`
  width: 100%;
  line-height: 20px;
  border: 1px solid black;
  padding: 5px 10px;
`;

const StyledResults = styled.div`
  background: white;
  white-space: nowrap;
  position: absolute;
  z-index: 1000;
  padding: 10px;
`;

Search.displayName = 'Search';
Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default Search;
