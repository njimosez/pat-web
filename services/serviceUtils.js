/**
 * Utility functions to retrieve and format the clone project data
 *   
 * */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');
const _ = require('underscore');
YAML = require('yamljs');

/**
 * Gets a project data from a specified dir path 
 * 
 * @param {*} userSessionDir "dir created per user session in local projects repo"
 * @param {*} giturl "URL of the retrieved project"
 * @param {*} folderName "name of the folder where to retrieve the data"
 * @param {*} next 
 * @param {*} req 
 */
const patProjectData = function getProjectFolderData(userSessionDir, giturl, folderName, next, req) {
  var projectFolderPath = getTree(userSessionDir + '/' + path.basename(giturl) + '/' + folderName);
  if (_.isEmpty(projectFolderPath)) {
    shell.rm('-Rf', userSessionDir);
    next(new Error('This project ' + folderName + ' folder is empty or does not exist!'));
  }
  return projectFolderMeta = Object.byString(projectFolderPath, 'children');

};
/**
 * Parses a YAML file and transform the data to JSON
 * 
 * @param {*} userSessionDir "dir created per user session in local projects repo"
 * @param {*} giturl  "URL of the retrieved project"
 * @param {*} folderName "name of the folder where to retrieve the data"
 * @param {*} filename "name of the file to process"
 * @param {*} next 
 * @param {*} req 
 */
const JSONData = function YAMLtoJSON(userSessionDir, giturl, folderName, filename, next, req) {
  var projectFolderPath = userSessionDir + '/' + path.basename(giturl) + '/' + folderName;
  var yamlFile = projectFolderPath + "/" + filename;
  try {

    const doc = YAML.load(yamlFile);
    return doc;
  } catch (e) {
    console.log(e);
  }
};
/**
 * Parses a JSON object and transform the data to .yml file
 * 
 * @param {*} jsonStr " JSON Object to parse"
 * @param {*} userSessionDir "dir created per user session in local projects repo"
 * @param {*} giturl "URL of the retrieved project"
 * @param {*} folderName "name of the folder where to store the data"
 * @param {*} filename "name of the file to save"
 * @param {*} next 
 * @param {*} req 
 */
const YAMLData = function JSONtoYAML(jsonStr, userSessionDir, giturl, folderName, filename, next, req) {
  var projectFolderPath = userSessionDir + '/' + path.basename(giturl) + '/' + folderName;
  var yamlFile = projectFolderPath + "/" + filename;
  try {
    //var obj = JSON.parse(jsonStr);
    console.log(projectFolderPath);
    var yamlStr = YAML.stringify(jsonStr, 4); //> projectFolderPath/test.yml; 
    var stream = fs.createWriteStream(projectFolderPath + '/test.yml');
    stream.write(yamlStr);
    return yamlStr;
  } catch (e) {
    console.log(e);
  }
};
/**
 *  Walks a directory and returns a metadata of the content 
 * 
 * @param {*} dir procedure or task file directory path
 */
function getTree(dir) {
  // get only yaml files
  data = dirTree(dir, {
    normalizePath: true,
    extensions: /\.(yml|png)$/
  }, (item, PATH, stats) => {});
  return data;
}

/**
 * Converts an object to String 
 * 
 * @param  {} o
 * @param  {} s
 */
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, ''); // strip a leading dot
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
};

/**
 * Creates the summary timeline header display
 * object
 * 
 * @param {*} columns : Eva Procedure columns
 * 
 */
function getColumnHeaderTextByActor(columns) {
  var columnHeaderText = [];
  for (var x in columns) {
    if ((columns[x].actors) != "*") {
      columnHeaderText.push(columns[x].display);
    }

  }
  return (columnHeaderText);
}
/**
 * Converts EVA task hours and minutes into 
 * the timeline display  
 * 
 * @param {*} taskHours 
 * @param {*} taskMin 
 */
function timeConvert(taskHours, taskMin) {

  let hours;
  let mins;
  let cellHeight;
  if ((taskMin > 59)) {
    hours = taskMin / 60;
    mins = "00";
    cellHeight = taskMin * 2;
  } else if ( (_.isNumber(taskHours)) && (_.isNumber(taskMin) )) {
    hours = "0" + taskHours;
    mins = taskMin;
    cellHeight = (taskMin + (taskHours * 60)) * 2;
  } else if (_.isEmpty(taskHours)) {
    console.log(taskHours);
    hours = "00";
    mins = taskMin;
    cellHeight = taskMin * 2;
  } else if (_.isEmpty(taskMin)) {
    hours = "0" + taskHours;
    mins = "00";
    cellHeight = (taskHours * 60) * 2;
  } else {
    hours = "0" + taskHours;
    mins = taskMin;
    cellHeight = (taskMin + (taskHours * 60)) * 2;
  }
  return ({
    hours: hours,
    minutes: mins,
    cellHeight: cellHeight
  });
}
/* Export method */
module.exports = {
  patProjectData: patProjectData,
  JSONData: JSONData,
  YAMLData: YAMLData,
  getColumnHeaderTextByActor: getColumnHeaderTextByActor,
  timeConvert: timeConvert
};