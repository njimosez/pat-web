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
const insert_taskdb = new Datastore({
  filename: "maestro-inserttasks.db",
  autoload: true
});

/**
 * Boolean (global variable) to trigger the display of
 * the commit changes button on the timeline
 */
var isSaveButton = false;

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
    }
  });
  taskdb.insert(EvaTasks, function (err, newDoc) {
    if (err) {
      next(new Error(err));
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
  var insertdoc = [];
  var actor1procedure = [];
  var actor2procedure = [];
  var keycolumn1;
  var keycolumn2;
  var taskfilename;
  var timeline1 = [];
  var timeline2 = [];
  var tasks = [];

  var taskToInsert = [];
  insert_taskdb.find({
    userId: req.sessionID
  }, function (err, doc) {
    if (_.isEmpty(doc)) {
      console.log("insert doc is empty");
    } else {
      insertdoc = doc;
    }
  });

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
        // get the keys for each actor array 
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
        tasks = taskdoc.tasksDetails;
      }
      // create actor1 timeline
      for (var a in actor1procedure) {
        for (var t in tasks) {
          if ((actor1procedure[a].file === tasks[t].file) &&
            (actor1procedure[a].column === tasks[t].crew)) {
            var object1 = _.object(['file', 'position', 'color', 'title', 'hours', 'minutes', 'cellHeight'], 
            [actor1procedure[a].file, actor1procedure[a].position,
              actor1procedure[a].color, tasks[t].title, tasks[t].title.hours, tasks[t].minutes, tasks[t].cellHeight
            ]);
            timeline1.push(object1);
          }
        }
      }
      // create actor2 timeline
      for (var b in actor2procedure) {
        for (var s in tasks) {
          if ((actor2procedure[b].file === tasks[s].file) &&
            (actor2procedure[b].column === tasks[s].crew)) {
            var object2 = _.object(['file', 'position', 'color', 'title', 'hours', 'minutes', 'cellHeight'], 
            [actor2procedure[b].file, actor2procedure[b].position,
              actor2procedure[b].color, tasks[s].title, tasks[s].title.hours, tasks[s].minutes, tasks[s].cellHeight
            ]);
            timeline2.push(object2);
          }
        }
      }

      }
    console.log(" Trigger: " + isSaveButton);
    res.render("summary-timeline.html", {
      sessionDoc: doc,
      isSaveButton: isSaveButton,
      actor1: actor1procedure,
      actor2: actor2procedure,
      actor1timeline: timeline1,
      actor2timeline: timeline2,
      insertdoc: insertdoc

    });
  });
};
/**
 * Update procedure document when items are reordered
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
      //trigger the save modal display
      isSaveButton = true;
      res.redirect("/summary");
    });

  }
};
/**
 * Delete a task from a procedure if removed from the timeline
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const deleteProcedureTask = function (req, res, next) {
  var procedureTasks = [];
  var taskId = req.query.itemId;
  //trigger the save modal display
  isSaveButton = true;
  //find and remove the task from the procedure object
  proceduredb.findOne({
    userId: req.sessionID
  }, function (err, doc) {
    if (_.isEmpty(doc)) {
      next(new Error(err));
    } else {
      procedureTasks = doc.procedureDetails.tasks;
      var tasktoRemove = procedureTasks[taskId];
      proceduredb.update({
        userId: req.sessionID
      }, {
        $pull: {
          "procedureDetails.tasks": tasktoRemove
        }
      }, {}, function (err, numReplaced) {
        if (err) {
          next(new Error(err));
        }
      });
      // add the remove task to the insert object
      var obj = _.object(['userId', 'task'], [req.sessionID, tasktoRemove]);
      insert_taskdb.insert(obj);

      res.redirect("/summary");
    }
  });
};


/**
 * Insert a task to the procedure timeline
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const insertProcedureTask = function (req, res, next) {
  var procedureTasks = [];
  var tasktoAdd;
  var filename = req.query.file;
  var addToInsert = [];
  insert_taskdb.findOne({
    $and: [{
      userId: req.sessionID
    }, {
      'task.file': filename
    }]
  }, function (err, doc) {
    if (_.isEmpty(doc)) {
      next(new Error(err));
    } else {

      tasktoAdd = doc.task;
      // add the task upon insert to the procedure object     
      proceduredb.update({
        userId: req.sessionID
      }, {
        $push: {
          "procedureDetails.tasks": tasktoAdd
        }
      }, {}, function (err, numReplaced) {
        if (err) {
          next(new Error(err));
        }
      });
      // then remove the inserted task from the insert object
      insert_taskdb.remove({
        $and: [{
          userId: req.sessionID
        }, {
          'task': tasktoAdd
        }]
      });

      //trigger the save modal display
      isSaveButton = true;
      res.redirect("/summary");

    }
  });
};


/**
 * Delete a specific session procedure and tasks documents 
 * @param {*} req 
 * @param {*} next 
 */
const removeSessionTimeline = function (req, next) {
  let db = [proceduredb, taskdb, insert_taskdb];
  for (var t in db) {
    db[t].remove({
      userId: req.sessionID
    });
  }
  //turn off the save modal display
  isSaveButton = false;
};
/* Export methods */
module.exports = {
  createObjects: createObjects,
  deleteProcedureTask: deleteProcedureTask,
  getProjectTimeline: getProjectTimeline,
  reorderTimeline: reorderTimeline,
  removeSessionTimeline: removeSessionTimeline,
  insertProcedureTask: insertProcedureTask
};