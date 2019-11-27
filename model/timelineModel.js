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
const taskdb = new Datastore({
  filename: "maestro-tasks.db",
  autoload: true
});
const insertTaskdb = new Datastore({
  filename: "maestro-inserttasks.db",
  autoload: true
});
/**
 * Create an EVA procedure and associated task files documents
 * 
 * @param {*} EvaProcedure "Object derived from parsing a project procedure folder .yml file "
 * @param {*} EvaTasks "Object derived from parsing the project task folder .yml files"
 */
const createObjects = function (EvaProcedure, EvaTasks, req, next) {
  proceduredb.insert(EvaProcedure, function (err, newDoc) {
    if (err) {
      next(new Error(err));
    } else {
      console.log("EvaProcedure document created");
    }
  });
  taskdb.insert(EvaTasks, function (err, newDoc) {
    if (err) {
      next(new Error(err));
    } else {
      console.log("EvaTasks document created");
    }
  });
};
// end module

/**
 * Get data for the project timeline
 * This function will manipulate the procedure
 * document to create objects for the two columns in
 * the timelime and also return the task collection
 * which is processed at the front end 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const getProjectTimeline = function (req, res, next) {
  var taskdoc = [];
  var actor1procedure = [];
  var actor2procedure = [];
  var keycolumn1;
  var keycolumn2;
  var taskfilename;

  //TODO Process the task collection at the back end and render 
  // only columns objects containing task title and hours 
  taskdb.findOne({
    userId: req.sessionID
  }, function (err, doc) {
    if (_.isEmpty(doc)) {
      next(new Error(err));
    } else {
      taskdoc = doc;
    }
  });

  proceduredb.findOne({
    userId: req.sessionID
  }, function (err, doc) {
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
  });
};
/**
 * Update the procedure document when after 
 * items have been reordered
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const reorderTimeline = function (req, res, next) {
  var procedureTasks = [];
  var reorderedTasks = [];
  var oldTaskIndex = [];
  var reorderedTaskIndex = [];
  var reorderIds = req.body.positions;
  proceduredb.findOne({
    userId: req.sessionID
  }, function (err, doc) {
    if (_.isEmpty(doc)) {
      next(new Error(err));
    } else {
      procedureTasks = doc.procedureDetails.tasks;
      for (var i in reorderIds) {
        var id = reorderIds[i];
        for (var p in doc.procedureDetails.tasks) {
          var EvaTaskIndex = (_.indexOf(procedureTasks, doc.procedureDetails.tasks[p]));
          var EvaTask = doc.procedureDetails.tasks[p];
          var index = (_.indexOf(procedureTasks, EvaTask));
          if (index == id) {
            reorderedTasks.push(EvaTask);
            reorderedTaskIndex.push(index);
          }
          oldTaskIndex.push(EvaTaskIndex);
        }
      }
      let droppedTaskIndex = _.difference(_.uniq(oldTaskIndex), reorderedTaskIndex);
      for (var d in droppedTaskIndex) {
        let dropTaskPosition = droppedTaskIndex[d];
        reorderedTasks.splice(dropTaskPosition, 0, procedureTasks[dropTaskPosition]);
      }
      insertDroppedTasks(reorderedTasks, req);
    }
  });


  /**
   * Insert dropped tasks still needed
   * in the summary timeline
   * @param {*} reorderedTasks " The dropped task object "
   */
  function insertDroppedTasks(reorderedTasks, req) {
    proceduredb.update({
      userId: req.sessionID
    }, {
      $set: {
        "procedureDetails.tasks": reorderedTasks
      }
    }, {}, function (err, numReplaced) {
      if (err) {
        next(new Error(err));
      } else {
        console.log("procedure updated!");
      }
      res.redirect("/summary");
    });

  }
};
/**
 * Delete a document task when removed from the timeline
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteProcedureTask = function (req, res, next) {
  var procedureTasks = [];
  var taskId = req.query.itemId;
  var addToInsert = [];
  console.log(taskId);
  proceduredb.findOne({
    userId: req.sessionID
  }, function (err, doc) {
    if (_.isEmpty(doc)) {
      next(new Error(err));
    } else {
      procedureTasks = doc.procedureDetails.tasks;
      var tasktoRemove = procedureTasks[taskId];
      console.log(tasktoRemove);
      proceduredb.update({
        userId: req.sessionID
      }, {
        $pull: {
          "procedureDetails.tasks": tasktoRemove
        }
      }, {}, function (err, numReplaced) {
        if (err) {
          next(new Error(err));
        } else {
          console.log(tasktoRemove.file + "task in procedure pulled!");
        }
      });
      var obj = _.object(['userId', 'insertTask'], [req.sessionID, tasktoRemove]);
      addToInsert.push(obj);

      timelineInsertTask(obj);
      res.redirect("/summary");
    }
  });

};
/**
 * Create a document containing removed tasks
 * objcts in this document can be brought back 
 * into  procedure using the timeline insert feature 
 * @param {*} addToInsert "Task object to insert"
 */
function timelineInsertTask(addToInsert) {
 // This document can be expanded to include all tasks object 
 // not in the procedure task list but that can be included 
 // later from the timeline using the insert feature
  insertTaskdb.insert(addToInsert, function (err, newDoc) {
    if (err) {
      new Error(err);
    } else {
      console.log(" New insert Task document created");
    }
  });
}
/**
 * Delete a specific session procedure and tasks documents 
 * @param {*} req 
 * @param {*} next 
 */
const removeSessionTimeline = function (req, next) {
  let db = [proceduredb, taskdb, insertTaskdb];
  for (var t in db) {
    db[t].remove({
      userId: req.sessionID
    });
  }
};
/* Export methods */
module.exports = {
  createObjects: createObjects,
  deleteProcedureTask: deleteProcedureTask,
  getProjectTimeline: getProjectTimeline,
  reorderTimeline: reorderTimeline,
  removeSessionTimeline: removeSessionTimeline
};