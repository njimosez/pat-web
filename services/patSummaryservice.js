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
const projectModel = require('../models/projectModel.js');
const procedureModel = require('../models/procedureModel.js');
const taskModel = require('../models/taskModel.js');
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
