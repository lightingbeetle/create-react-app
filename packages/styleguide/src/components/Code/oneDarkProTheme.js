const theme = {
  plain: {
    color: '#abb2bf',
    backgroundColor: '#282c34',
  },
  styles: [
    {
      types: ['constant', 'keyword', 'selector'],
      style: {
        color: 'rgb(198, 120, 221)',
      },
    },
    {
      types: ['operator', 'symbol'],
      style: {
        color: 'rgb(86, 182, 194)',
      },
    },
    {
      types: ['punctuation'],
      style: {
        color: 'rgb(171, 178, 191)',
      },
    },
    {
      types: ['variable', 'class-name', 'function', 'namespace', 'changed'],
      style: {
        color: 'rgb(229, 192, 123)',
      },
    },
    {
      types: ['char', 'tag', 'deleted'],
      style: {
        color: 'rgb(224, 108, 117)',
      },
    },
    {
      types: ['builtin', 'number'],
      style: {
        color: 'rgb(209, 154, 102)',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: '#d19a66',
      },
    },
    {
      types: ['inserted', 'string'],
      style: {
        color: 'rgb(152, 195, 121)',
      },
    },
    {
      types: ['comment'],
      style: {
        color: 'rgb(92, 99, 112)',
      },
    },
    {
      types: ['attr-value'],
      style: {
        color: '#98c379',
      },
    },
  ],
};

export default theme;
