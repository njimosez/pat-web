/**
 * Persistance layer of a Maestro project procedure(s) and task data
 * model is an object made of a PAT project  files details
 * retrieved from the  cloned project and persisted
 * per user session in  and embedded document database
 * for  CRUD manipulatiom
 *
 * */

const shell = require("shelljs");
const path = require("path");
const fs = require("fs");
const _ = require("underscore");
const Datastore = require("nedb");
const proceduredb = new Datastore({
  filename: "maestro-procedure.db",
  autoload: true
});
const taskdb = new Datastore({ filename: "maestro-tasks.db", autoload: true });

const createObjects = function(EvaProcedure, EvaTasks, req, next) {
  proceduredb.insert(EvaProcedure, function(err, newDoc) {
    if (err) {
      next(new Error(err));
    } else {
      console.log(EvaProcedure + " document created");
    }
  });
  taskdb.insert(EvaTasks, function(err, newDoc) {
    if (err) {
      next(new Error(err));
    } else {
      console.log(EvaTasks + " document created");
    }
  });
};
// end module
const getProjectTimeline = function(req, res, next) {
  var taskdoc = [];
  var actor1procedure = [];
  var actor2procedure = [];
  var keycolumn1;
  var keycolumn2;
  var taskfilename;
  taskdb.findOne({ userId: req.sessionID }, function(err, doc) {
    if (_.isEmpty(doc)) {
      next(new Error(err));
    } else {
      taskdoc = doc;
    }
  });

  proceduredb.findOne({ userId: req.sessionID }, function(err, doc) {
    if (_.isEmpty(doc)) {
      next(new Error(err));
    } else {
      let actor1 = doc.procedureDetails.columns[1].actors;
      let actor2 = doc.procedureDetails.columns[2].actors;
      for (var p in doc.procedureDetails.tasks) {
        taskfilename = doc.procedureDetails.tasks[p].file;
        var actorKeys = _.keys(doc.procedureDetails.tasks[p].roles);
        if (
          _.size(actorKeys) < 2 &&
          doc.procedureDetails.tasks[p].roles.crewA === actor1
        ) {
          keycolumn1 = "crewA";
          keycolumn2 = "";
        } else if (
          _.size(actorKeys) < 2 &&
          doc.procedureDetails.tasks[p].roles.crewA === actor2
        ) {
          keycolumn1 = "";
          keycolumn2 = "crewA";
        } else {
          keycolumn1 = "crewA";
          keycolumn2 = "crewB";
        }
        var obj1 = _.object(
          ["file", "column", "position", "color"],
          [taskfilename, keycolumn1, p, doc.procedureDetails.tasks[p].color]
        );
        var obj2 = _.object(
          ["file", "column", "position", "color"],
          [taskfilename, keycolumn2, p, doc.procedureDetails.tasks[p].color]
        );
        actor1procedure.push(obj1);
        actor2procedure.push(obj2);
      }
    }

    res.render("summary-timeline.html", {
      sessionDoc: doc,
      taskDoc: taskdoc,
      actor1: actor1procedure,
      actor2: actor2procedure
    });
    // res.send({actor1procedure, actor2procedure, taskDoc});
  });
};

const deleteProcedureDoc = function(req, res, next) {
  proceduredb.remove({ userId: req.sessionID }, function(err, doc) {
    if (err) {
      next(new Error(err));
    } else {
      console.log("procedure document removed");
    }
  });
};

/* Export methods */
module.exports = {
  createObjects: createObjects,
  deleteProcedureDoc: deleteProcedureDoc,
  getProjectTimeline: getProjectTimeline
};
