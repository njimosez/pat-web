/**
 * Render Summary Timeline
 *  
 * */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');
const serviceUtils = require('./serviceUtils.js');
const _ = require('underscore');
const projectModel = require('../model/projectModel.js.js');
const procedureModel = require('../model/timelineModel.js/index.js.js');
const taskModel = require('../model/taskModel.js.js');
const procedureFolderName = 'procedures';
const tasksFolderName = 'tasks';
const procedureImage = 'images/';
const patProjectdir = './public/projects/';


const projectTimeline = function (req, res, next) {
  // get the collection in procedure
  projectModel.getProjectTimeline(req, res, next);
};


/* Export method */
module.exports = {
  projectTimeline: projectTimeline,

};