'use strict';

const glob = require('glob');
const path = require('path');
const fs = require('fs');

const paths = require('../../config/paths');

const resolveEntry = entryName => {
  const entryPath = path.join(paths.appSrc, entryName);
  const extension = paths.moduleFileExtensions.find(extension =>
    fs.existsSync(`${entryPath}.${extension}`)
  );

  if (extension) {
    return `${entryPath}.${extension}`;
  }

  return `${entryPath}.js`;
};

function getSpaEntries() {
  const htmlTemplates = [
    ...glob.sync(path.join(paths.appSrc, '*.html')),
    ...glob.sync(path.join(paths.appPublic, '*.html')),
  ];

  // return object with name of entries as keys and path as value
  return htmlTemplates.reduce((acc, templatePath) => {
    const entryName = path.basename(templatePath, '.html');

    acc[entryName] = {
      htmlTemplatePath: templatePath,
      entryPath: resolveEntry(entryName),
    };

    return acc;
  }, {});
}

module.exports = getSpaEntries;
