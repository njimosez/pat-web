/**
 * Persistance layer of a Pat project tasks
 * model is an object made of a PAT project task files details 
 * retrieved from the task folder of the cloned project,
 * and persisted per user session in embedded document database 
 * for further CRUD operations
 *   
 * */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const Datastore = require('nedb');
const taskdb = new Datastore({ filename: 'pat-task.db', autoload: true });

const createTaskDoc = function (EvaTasksDoc, req, next) {
  taskdb.insert(EvaTasksDoc, function (err, newDoc) {
    if (err) {
      next(new Error(err));
    }else {
      console.log('task document created');
    }
  });
};
// end module




const deleteTaskDoc = function (req, res, next) {
   taskdb.remove({ userId: req.sessionID }, function (err, doc) {
    if (err) {
      next(new Error(err));
    }else {
      console.log('task document removed');
    }
  });
};

/* Export methods */
module.exports = {
  createTaskDoc: createTaskDoc,
  deleteTaskDoc: deleteTaskDoc
};
