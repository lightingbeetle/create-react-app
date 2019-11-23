import React from 'react';
import { array, string } from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
/** https://www.npmjs.com/package/fuzzyjs */
import { match, surround } from 'fuzzyjs';
import Autocomplete from 'accessible-autocomplete/react';

const propTypes = {
  list: array.isRequired,
  placeholder: string,
};

const defaultProps = {
  placeholder: 'Search',
};

const Search = ({ list, placeholder, history }) => {
  const formatMatches = (matches, parentPath, parentTitle) =>
    matches.map(match => ({
      title: match.original.title,
      path: parentPath + match.original.path,
      string: match.string,
      breadcrumbs: parentTitle,
      isHidden: match.original.hasNodes,
    }));

  const parseFullPathList = (items, parentPath = '') => {
    return items.reduce((acc, curr) => {
      const path = parentPath + curr.path;

      return [
        ...acc,
        { title: curr.title, path: path, hasNodes: curr.nodes !== undefined },
        ...(curr.nodes ? parseFullPathList(curr.nodes, path) : []),
      ];
    }, []);
  };

  const surroundMatch = (string, result) =>
    surround(string, {
      result,
      prefix: '<strong>',
      suffix: '</strong>',
    });

  const getMatch = (value, string) =>
    match(value, string, { withScore: true, withRanges: true });

  const search = (value, list, parentPath = '', parentTitle = '') => {
    if (value === '') {
      return [];
    } else {
      const fullPathsList = parseFullPathList(list);
      // search the first level children for match
      // const parentMatches = fuzzy.filter(value, fullPathsList, options);
      const parentMatches = fullPathsList
        .reduce((acc, curr) => {
          const result = {
            // search in title
            title: getMatch(value, curr.title),
            // search in path
            path: getMatch(value, curr.path),
          };

          return result.path.match
            ? [
                ...acc,
                {
                  original: curr,
                  result: result,
                  score: {
                    title: result.title.score,
                    path: result.path.score,
                    // get the highest score from the two
                    full: Math.max(
                      result.title.score !== 0 ? result.title.score : -1000,
                      result.path.score !== 0 ? result.path.score : -1000
                    ),
                  },
                  string: {
                    title: surroundMatch(curr.title, result.title),
                    path: surroundMatch(curr.path, result.path),
                  },
                },
              ]
            : acc;
        }, [])
        // sort from high to low
        .sort((a, b) => b.score.full - a.score.full);
      // format the matched items for later use
      return formatMatches(parentMatches, parentPath, parentTitle);
    }
  };

  return (
    <StyledAutocompleteWrapper>
      <Autocomplete
        id="autocomplete"
        name="search"
        placeholder={placeholder}
        autoselect={true}
        confirmOnBlur={false}
        displayMenu="overlay"
        source={(value, syncResults) => {
          const filteredResults = search(value, list);
          syncResults(filteredResults.filter(result => !result.isHidden));
        }}
        templates={{
          inputValue: () => '',
          suggestion: result =>
            result &&
            `<span>${result.string.title}</span>\xa0<small>${
              result.string.path
            }</small>`,
        }}
        onConfirm={confirmed => {
          if (!confirmed) return false;
          history.push(confirmed.path);
        }}
      />
    </StyledAutocompleteWrapper>
  );
};

const StyledAutocompleteWrapper = styled.div`
  .autocomplete__input {
    width: 100%;
    line-height: 20px;
    border: 1px solid black;
    padding: 5px 10px;
  }

  .autocomplete__option--focused {
    background: #eee;
  }

  .autocomplete__menu {
    &--hidden {
      display: none;
    }
    &--visible {
      position: absolute;
      z-index: 10000;
      white-space: nowrap;
      background: white;
      padding: 10px;
      width: 100%:
    }
  }

  ul {
    padding: 5px;
    li {
      list-style: none;
    }
  }
`;

Search.displayName = 'Search';
Search.propTypes = propTypes;
Search.defaultProps = defaultProps;

export default withRouter(Search);
