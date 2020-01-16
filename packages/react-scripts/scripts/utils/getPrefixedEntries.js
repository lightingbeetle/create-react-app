'use strict';

const glob = require('glob');
const path = require('path');

function getPrefixedEntries(type, dirPath, globRegex) {
  const entryFiles = glob.sync(path.join(dirPath, globRegex));

  return entryFiles.reduce((entries, entryFile) => {
    // converts entryFile path to platform specific style
    // this fixes windows/unix path inconsitence
    // because node-glob always returns path with unix style path separators
    entryFile = path.join(entryFile);

    const localPath = entryFile.split(dirPath)[1];

    const prefix = type ? `${type}-` : '';

    let entryName = prefix + localPath
        // remove leading slash and/or extension
        .replace(/^\/|\.js$/g, '');

    entries[entryName] = path.join(dirPath, localPath);

    return entries;
  }, {});
}

module.exports = getPrefixedEntries;
