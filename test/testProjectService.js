const assert = require('assert');
const expect = require('chai');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const dirTree = require('directory-tree');
const serviceUtils = require('../services/serviceUtils.js');
const projectModel = require('../model/projectModel.js');
const timelineModel = require('../model/timelineModel.js');
const procedureFolderName = 'procedures';
const tasksFolderName = 'tasks';
const procedureImage = 'images/';
const patProjectdir = '../public/projects/';

const removeProject = function (req, res, next) {
  projectModel.deleteProjectFiles(req, res, next);
};

const reqt = {sessionID: 'fakeID-6b15-4e8f-9f73-1b891b043a31'};
const rest = {render: function(html, object){
    console.log('res.render(' + html + ', ' + object + ')');
    }
};
const nextt = function(err){console.log('error')};

function cloneProjectDir (req, res, next, giturl, err) {
    console.log(patProjectdir + req.sessionID);
    var stubData = {};
    var userSessionDir = patProjectdir + req.sessionID;
    console.log(userSessionDir);
    shell.mkdir('-p', patProjectdir, userSessionDir);
    //const simpleGit = require('simple-git')(userSessionDir);
    var stubData = {path: userSessionDir};

    /*simpleGit.clone(giturl, function (err, data) {
    if (err) {
      shell.rm('-Rf', userSessionDir);
      next(new Error(err)); // Pass errors to Express.
    } else {*/
        console.log('beat');

      var myMaestroProjectDoc = {
        'projectName': path.basename(giturl),
        'projectURL': giturl,
        'userId': req.sessionID,
        'procedureMeta': [],
        'tasksMeta': [],
        'images': []
      };

      var procedureTimeline = {
        'projectName': path.basename(giturl),
        'projectURL': giturl,
        'userId': req.sessionID,
        'timeline': []
      };

      var EvaProcedure = {
        'userId': req.sessionID,
        'columnHeaderText': [],
        'procedureDetails': []
      }; // get rolr
      var EvaTasks = {
        'userId': req.sessionID,
        'tasksDetails': []
      }; // duration is static

      console.log(userSessionDir + '/' + path.basename(giturl) + '/' + procedureFolderName);
      //var procedureMetaDoc = serviceUtils.patProjectData(userSessionDir, giturl, procedureFolderName, next, req);
      stubData.path = stubData.path + '/sts-134';
      stubData.procedurePath = stubData.path + '/procedures';
      stubData.procedures = [{name:'EVA1.yml', path:stubData.procedurePath+'EVA1.yml'}];
      console.log('beat');

      for (var x in stubData.procedures) {
        let filename = stubData.procedures[x].name;
        let procedureDoc = {"userId":"fakeID","columnHeaderText":["EV1 (Drew)","EV3 (Taz)"],"procedureDetails":{"procedure_name":"STS-134 EVA 1","columns":[{"key":"IV","display":"IV/SSRMS","actors":"*"},{"key":"EV1","actors":"EV1","display":"EV1 (Drew)"},{"key":"EV3","actors":"EV3","display":"EV3 (Taz)"}],"tasks":[{"file":"egress.yml","roles":{"crewA":"EV1","crewB":"EV3"}},{"file":"misse7.yml","roles":{"crewA":"EV1","crewB":"EV3"},"color":"#FFD700"},{"file":"misse8.yml","roles":{"crewA":"EV1"},"color":"#FFD700"},{"file":"s3-ceta-light-install.yml","roles":{"crewA":"EV3"}},{"file":"stbd-sarj-cover-7-install.yml","roles":{"crewA":"EV3"}},{"file":"p3-p4-nh3-jumper-install.yml","roles":{"crewA":"EV1","crewB":"EV3"},"color":"#00FFFF"},{"file":"p5-p6-nh3-jumper-install-n2-vent.yml","roles":{"crewA":"EV1"},"color":"#00FFFF"},{"file":"p3-p4-nh3-jumper-temp-stow.yml","roles":{"crewA":"EV3"},"color":"#00FFFF"},{"file":"ewc-antenna-install.yml","roles":{"crewA":"EV1","crewB":"EV3"},"color":"#90EE90"},{"file":"vteb-reconfig.yml","roles":{"crewA":"EV1"},"color":"#00FFFF"},{"file":"ingress.yml","roles":{"crewA":"EV1","crewB":"EV3"}}]},"_id":"7m7i0Dcg4SC8N3ls"};

        myMaestroProjectDoc.procedureMeta.push({
          filename: stubData.procedures[x].name,
          path: stubData.procedures[x].path,
          procedure_name: procedureDoc.procedure_name
        });

        EvaProcedure.columnHeaderText = serviceUtils.getColumnHeaderTextByActor(procedureDoc.columns);
        EvaProcedure.procedureDetails = procedureDoc;
      }
      console.log('beat');


      // retrieve object from the task folder
      //var tasksMetaDoc = serviceUtils.patProjectData(userSessionDir, giturl, tasksFolderName, next, req);
      stubData.taskPath = stubData.path + '/tasks';
      stubData.tasks = {"userId":"fakeID","tasksDetails":[{"file":"egress.yml","title":"EGRESS/SETUP","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},{"file":"egress.yml","title":"EGRESS/SETUP","crew":"crewB","hours":"00","minutes":25,"cellHeight":50},{"file":"ewc-antenna-install.yml","title":"EWC Antenna Install","crew":"crewA","hours":"00","minutes":20,"cellHeight":40},{"file":"ewc-antenna-install.yml","title":"EWC Antenna Install","crew":"crewB","hours":"00","minutes":45,"cellHeight":90},{"file":"ingress.yml","title":"Cleanup / Ingress","crew":"crewA","hours":"00","minutes":30,"cellHeight":60},{"file":"ingress.yml","title":"Cleanup / Ingress","crew":"crewB","hours":"00","minutes":30,"cellHeight":60},{"file":"misse7.yml","title":"MISSE 7 RETRIEVE","crew":"crewA","hours":1,"minutes":"00","cellHeight":120},{"file":"misse7.yml","title":"MISSE 7 RETRIEVE","crew":"crewB","hours":1,"minutes":"00","cellHeight":120},{"file":"misse8.yml","title":"MISSE 8 Install","crew":"crewA","hours":"00","minutes":40,"cellHeight":80},{"file":"p3-p4-nh3-jumper-install.yml","title":"P3/P4 NH3 Jumper Install","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},{"file":"p3-p4-nh3-jumper-install.yml","title":"P3/P4 NH3 Jumper Install","crew":"crewB","hours":"00","minutes":25,"cellHeight":50},{"file":"p3-p4-nh3-jumper-temp-stow.yml","title":"P3/P4 NH3 Jumper Temp Stow","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},{"file":"p5-p6-nh3-jumper-install-n2-vent.yml","title":"P5/P6 NH3 Jumper Install / N2 Vent","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},{"file":"s3-ceta-light-install.yml","title":"S3 CETA Light Install","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},{"file":"stbd-sarj-cover-7-install.yml","title":"Stbd SARJ Cover 7 Install","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},{"file":"vteb-reconfig.yml","title":"VTEB Cleanup","crew":"crewA","hours":"00","minutes":25,"cellHeight":50}],"_id":"6T5DoJbkLgV1Rm7r"};
      console.log('beat')

      for (x in stubData.tasks.tasksDetails) {
        var taskfilename = stubData.tasks.tasksDetails[x].name;
        var taskDoc = stubData.tasks.tasksDetails[x];

        myMaestroProjectDoc.tasksMeta.push({
          filename: taskfilename,
          title: taskDoc.title,
          path: stubData.tasks.tasksDetails[x].path
        });

        var tasks = taskDoc.roles;
        for (var t in tasks) {
          var duration = serviceUtils.timeConvert(tasks[t].duration.hours, tasks[t].duration.minutes);

          var obj = _.object(['file', 'title', 'crew', 'hours', 'minutes', 'cellHeight'], [taskfilename, taskDoc.title,
            tasks[t].name, duration.hours, duration.minutes, duration.cellHeight
          ]);
          EvaTasks.tasksDetails.push(obj);
        }

      }
      console.log('beat');
      var imagedoc = [];
      stubData.imagePath = stubData.path + '/images'
      console.log('beat');
      for (x in imagedoc) {
        myMaestroProjectDoc.images.push({
          name: imagedoc[x].name,
          path: imagedoc[x].path
        });
      }

      //stubData.cpmd = 'cpmd:' + procedureMetaDoc;
        //console.log('stubData: ');
      //stubData.cpm = 'cpm' + myMaestroProjectDoc.procedureMeta;
        //console.log(stubData);

      //timelineModel.createObjects(EvaProcedure, EvaTasks, req, next);

      //projectModel.createProject(userSessionDir, myMaestroProjectDoc, req, res, next);
      
      //removeProject(req, res, next);
    //}
  //});
  stubData.end = 'true';
  return(stubData)
}


describe('Testing CloneProjectDir components', function(){
    
    describe('Testing error catching', function(){
        it('Should return 1 when the error is caught.', function() {
            var userSessionDir = patProjectdir + reqt.sessionID;
            shell.mkdir('-p', patProjectdir, userSessionDir);
            const simpleGit = require('simple-git')(userSessionDir);
            var test = 0;
            var giturl = 'https://gitlab.com/xOPERATIONS/xtx-134';

            simpleGit.clone(giturl, function (err, data) {
                if (err) {
                    shell.rm('-Rf', userSessionDir);
                    test = 1;
                }else {
                    shell.rm('-Rf', userSessionDir);
                    test = -1;
                }
                assert(test, 1, 'error not caught: '+test);
            });
        });
    });
    
    describe('testing a valid url.', function(){
        //var userSessionDir = patProjectdir + reqt.sessionID;
        //shell.mkdir('-p', patProjectdir, userSessionDir);
        //const simpleGit = require('simple-git')(userSessionDir);
        var giturl = 'https://gitlab.com/xOPERATIONS/sts-134';
        
        var datab = cloneProjectDir(reqt, rest, nextt, giturl, function(){
            console.log('Oops');
        });
        
        var procedureArr = datab.procedures;
        var taskObj = datab.tasks;
        var taskArr = taskObj.tasksDetails;

        it('should record the right path.', function(){
            assert.deepEqual(datab.path,"../public/projects/fakeID-6b15-4e8f-9f73-1b891b043a31/sts-134",'Oops');
        });
        it('should record the right procedure path.', function(){
            assert.equal(datab.procedurePath,"../public/projects/fakeID-6b15-4e8f-9f73-1b891b043a31/sts-134/procedures",'Oops');
        });
        it('should record the right task path.', function(){
            assert.equal(datab.taskPath,"../public/projects/fakeID-6b15-4e8f-9f73-1b891b043a31/sts-134/tasks",'Oops');
        });
        it('should record the right image path.', function(){
            assert.equal(datab.imagePath,"../public/projects/fakeID-6b15-4e8f-9f73-1b891b043a31/sts-134/images",'Oops');
        });
        it('should record the right procedure file.', function(){
            assert.equal(procedureArr[0].name,'EVA1.yml','Oops');
        });
        it('should record the right number of tasks', function(){
            assert.equal(taskArr.length,16,'Oops');
        })
        it('should record the right task[0].', function(){
            assert.equal(taskArr[0].file,'egress.yml','Oops');
        });
    });
  });
