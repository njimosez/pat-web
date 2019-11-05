const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');
const _ = require('underscore');

//********************Helper functions*********************************** 

const patProjectData = function getProjectFolderData(userSessionDir, giturl, folderName, next, req) {
    var projectFolderPath = getTree(userSessionDir + "/" + path.basename(giturl) + "/" + folderName);
    console.log(projectFolderPath);
    if (_.isEmpty( projectFolderPath)) {
      shell.rm('-Rf', userSessionDir);
      next(new Error("This project " + folderName + " folder is empty or does not exist!"));
    }
   return projectFolderMeta = Object.byString(projectFolderPath, 'children');
   
  }




// should be refactored into a helper folder for modularity 
/**
 * @param  {} dir ; procedure or task file directory path
 */
function getTree(dir) {
    // get only yaml files
    data = dirTree(dir, { extensions: /\.(yml|png)$/ }, (item, PATH, stats) => {
  
    });
    return data;
  }
  
  /**
   * @param  {} o
   * @param  {} s
   */
  Object.byString = function (o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = o[k];
      } else {
        return;
      }
    }
    return o;
  }
/* Export method */
module.exports = {
  patProjectData: patProjectData,
    };