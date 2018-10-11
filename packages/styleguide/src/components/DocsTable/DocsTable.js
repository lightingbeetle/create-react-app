import React from 'react';

import { md } from './../../utils';
import { Code } from './../../components';
import Table, { TablePropTypes } from './../Table';

const propTypes = {
  ...TablePropTypes
};

const defaultProps = {
  columns: [
    {
      key: 'prop',
      label: 'Prop'
    },
    {
      key: 'type',
      label: 'Type',
      render: (data, column) => <td key={column.key}>{md([data])}</td>
    },
    {
      key: 'default',
      label: 'Default',
      render: (data, column) => (
        <td key={column.key}>
          <Code language="js" inline={false}>
            {data}
          </Code>
        </td>
      )
    },
    {
      key: 'description',
      label: 'Description',
      render: (data, column) => <td key={column.key}>{md([data])}</td>
    }
  ],
  hasOutsideBorder: true
};

const DocsTable = props => {
  const { data, ...other } = props;

  return <Table data={data} {...other} />;
};

DocsTable.propTypes = propTypes;
DocsTable.defaultProps = defaultProps;

export default DocsTable;
