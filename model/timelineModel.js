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
const getProjectTimeline = function (req, res, next) {
  var taskdoc = [];
  var actor1procedure = [];
  var actor2procedure = [];
  var keycolumn1;
  var keycolumn2;
  var taskfilename;
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
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const updateTimeline = function (req, res, next) {
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
      insert(reorderedTasks, req);
    }
  });


  /**
   * 
   * @param {*} reorderedTasks 
   */
  function insert(reorderedTasks, req) {
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

const deleteProcedureTask = function (req, res, next) {
  var procedureTasks = [];
  var taskId = req.query.itemId;
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
      AddtoInsert(tasktoRemove);
      res.redirect("/summary");
    }
  });
 
};

function AddtoInsert(removedTask){
  insertTaskdb.insert(removedTask, function (err, newDoc) {
    if (err) {
      new Error(err);
    } else {
      console.log(" New insert Task document created");
    }
  });
}

/* Export methods */
module.exports = {
  createObjects: createObjects,
  deleteProcedureTask: deleteProcedureTask,
  getProjectTimeline: getProjectTimeline,
  updateTimeline: updateTimeline
};