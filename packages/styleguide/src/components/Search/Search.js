import React from 'react';
import { array, func, string, shape } from 'prop-types';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
/** https://www.npmjs.com/package/fuzzy */
import fuzzy from 'fuzzy';
import Autocomplete from 'accessible-autocomplete/react';

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
    pre: `<strong>`,
    post: '</strong>',
    extract: el => el.title,
  },
};

const Search = ({ list, placeholder, fuzzyOptions, history }) => {
  const options = { ...defaultProps.fuzzyOptions, ...fuzzyOptions };

  const formatMatches = (matches, parentPath, parentTitle) =>
    matches.map(match => ({
      title: match.original.title,
      string: match.string,
      path: parentPath + match.original.path,
      breadcrumbs: parentTitle,
      isHidden: match.original.nodes !== undefined,
    }));

  const parseFullPathList = (items, parentPath = '') => {
    return items.reduce((acc, curr) => {
      const path = parentPath + curr.path;

      return [
        ...acc,
        { title: curr.title, path: path },
        ...(curr.nodes ? parseFullPathList(curr.nodes, path) : []),
      ];
    }, []);
  };

  const search = (value, list, parentPath = '', parentTitle = '') => {
    if (value === '') {
      return [];
    } else {
      const fullPathsList = parseFullPathList(list);
      // search the first level children for match
      const parentMatches = fuzzy.filter(value, fullPathsList, options);
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
            `<span>${result.title}</span>\xa0<small>${result.string}</small>`,
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
