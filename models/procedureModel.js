/**
 * Persistance layer of a Pat project procedure(s) data
 * model is an object made of a PAT project procedure files details 
 * retrieved from the procedure folder of the cloned project,
 * and persisted per user session in embedded document database 
 * for further CRUD operations
 *   
 * */

const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const Datastore = require('nedb');
const proceduredb = new Datastore({ filename: 'pat-procedure.db', autoload: true });

const createProcedure = function (EvaProceduresDoc, req, next) {
  proceduredb.insert(EvaProceduresDoc, function (err, newDoc) {
    if (err) {
      next(new Error(err));
    } else {
      console.log('procedure document created');
    }
  });
};
// end module

const deleteProcedureDoc = function (req, res, next) {
  proceduredb.remove({ userId: req.sessionID }, function (err, doc) {
    if (err) {
      next(new Error(err));
    } else {
      console.log('procedure document removed');
    }
  });
};

/* Export methods */
module.exports = {
  createProcedure: createProcedure,
  deleteProcedureDoc: deleteProcedureDoc
};
