
const assert = require('assert');
const expect = require('chai');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const dirTree = require('directory-tree');
YAML = require('yamljs');
var beau = require('json-beautify');
var sourceTimeline = {
  "procedureTasks": [
    {
      "file": "egress.yml",
      "roles": {
        "crewA": "EV1",
        "crewB": "EV3"
      }
    },
    {
      "file": "misse7.yml",
      "roles": {
        "crewA": "EV1",
        "crewB": "EV3"
      },
      "color": "#FFD700"
    },
    {
      "file": "misse8.yml",
      "roles": {
        "crewA": "EV1"
      },
      "color": "#FFD700"
    },
    {
      "file": "s3-ceta-light-install.yml",
      "roles": {
        "crewA": "EV3"
      }
    },
    {
      "file": "stbd-sarj-cover-7-install.yml",
      "roles": {
        "crewA": "EV3"
      }
    },
    {
      "file": "p3-p4-nh3-jumper-install.yml",
      "roles": {
        "crewA": "EV1",
        "crewB": "EV3"
      },
      "color": "#00FFFF"
    },
    {
      "file": "p5-p6-nh3-jumper-install-n2-vent.yml",
      "roles": {
        "crewA": "EV1"
      },
      "color": "#00FFFF"
    },
    {
      "file": "p3-p4-nh3-jumper-temp-stow.yml",
      "roles": {
        "crewA": "EV3"
      },
      "color": "#00FFFF"
    },
    {
      "file": "ewc-antenna-install.yml",
      "roles": {
        "crewA": "EV1",
        "crewB": "EV3"
      },
      "color": "#90EE90"
    },
    {
      "file": "vteb-reconfig.yml",
      "roles": {
        "crewA": "EV1"
      },
      "color": "#00FFFF"
    },
    {
      "file": "ingress.yml",
      "roles": {
        "crewA": "EV1",
        "crewB": "EV3"
      }
    }
  ],
  "taskDetails": [
    [
      {
        "file": "egress.yml"
      },
      {
        "title": "EGRESS/SETUP"
      },
      {
        "name": "crewA",
        "description": "Crewmember exiting A/L first, in charge of operating hatch",
        "duration": {
          "minutes": 25
        }
      },
      {
        "name": "crewB",
        "description": "Crewmember exiting A/L second, in charge of operating UIA",
        "duration": {
          "minutes": 25
        }
      }
    ],
    [
      {
        "file": "ewc-antenna-install.yml"
      },
      {
        "title": "EWC Antenna Install"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "hours": 2,
          "minutes": 20
        }
      },
      {
        "name": "crewB",
        "duration": {
          "hours": 2,
          "minutes": 45
        }
      }
    ],
    [
      {
        "file": "ingress.yml"
      },
      {
        "title": "Cleanup / Ingress"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 30
        }
      },
      {
        "name": "crewB",
        "duration": {
          "minutes": 30
        }
      }
    ],
    [
      {
        "file": "misse7.yml"
      },
      {
        "title": "MISSE 7 RETRIEVE"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 60
        }
      },
      {
        "name": "crewB",
        "duration": {
          "minutes": 60
        }
      }
    ],
    [
      {
        "file": "misse8.yml"
      },
      {
        "title": "MISSE 8 Install"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 40
        }
      }
    ],
    [
      {
        "file": "p3-p4-nh3-jumper-install.yml"
      },
      {
        "title": "P3/P4 NH3 Jumper Install"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 35
        }
      },
      {
        "name": "crewB",
        "duration": {
          "minutes": 25,
          "offset": {
            "minutes": 10
          }
        }
      }
    ],
    [
      {
        "file": "p3-p4-nh3-jumper-temp-stow.yml"
      },
      {
        "title": "P3/P4 NH3 Jumper Temp Stow"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 35
        }
      }
    ],
    [
      {
        "file": "p5-p6-nh3-jumper-install-n2-vent.yml"
      },
      {
        "title": "P5/P6 NH3 Jumper Install / N2 Vent"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 35
        }
      }
    ],
    [
      {
        "file": "s3-ceta-light-install.yml"
      },
      {
        "title": "S3 CETA Light Install"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 25
        }
      }
    ],
    [
      {
        "file": "stbd-sarj-cover-7-install.yml"
      },
      {
        "title": "Stbd SARJ Cover 7 Install"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 25
        }
      }
    ],
    [
      {
        "file": "vteb-reconfig.yml"
      },
      {
        "title": "VTEB Cleanup"
      },
      {
        "name": "crewA",
        "description": "Please add description",
        "duration": {
          "minutes": 25
        }
      }
    ]
  ]
};
var controlTimeline = {
  "EV1":[
      {"name":"EGRESS/SETUP",
          "hours":0,
          "minutes":25,
          "color":"#000000"
      },
      {"name":"MISSE 7 RETRIEVE",
          "hours":0,
          "minutes":60,
          "color":"#FFD700"
      },
      {"name":"MISSE 8 Install",
          "hours":0,
          "minutes":40,
          "color":"#FFD700"
      },
      {"name":"P3/P4 NH3 Jumper Install",
          "hours":0,
          "minutes":35,
          "color":"#00FFFF"
      },
      {"name":"P5/P6 NH3 Jumper Install / N2 Vent",
          "hours":0,
          "minutes":35,
          "color":"#00FFFF"
      },
      {"name":"EWC Antenna Install",
          "hours":2,
          "minutes":20,
          "color":"#90EE90"
      },
      {"name":"VTEB Cleanup",
          "hours":0,
          "minutes":25,
          "color":"#00FFFF"
      },
      {"name":"Cleanup / Ingress",
          "hours":0,
          "minutes":30,
          "color":"#000000"
      }
  ],
  "EV3":[
      {"name":"EGRESS/SETUP",
          "hours":0,
          "minutes":25,
          "color":"#000000"
      },
      {"name":"MISSE 7 RETRIEVE",
          "hours":0,
          "minutes":60,
          "color":"#FFD700"
      },
      {"name":"S3 CETA Light Install",
          "hours":0,
          "minutes":25,
          "color":"#000000"
      },
      {"name":"Stbd SARJ Cover 7 Install",
          "hours":0,
          "minutes":25,
          "color":"#000000"
      },
      {"name":"P3/P4 NH3 Jumper Install",
          "hours":0,
          "minutes":25,
          "color":"#00FFFF"
      },
      {"name":"P3/P4 NH3 Jumper Temp Stow",
          "hours":0,
          "minutes":35,
          "color":"#00FFFF"
      },
      {"name":"EWC Antenna Install",
          "hours":2,
          "minutes":45,
          "color":"#90EE90"
      },
      {"name":"Cleanup / Ingress",
          "hours":0,
          "minutes":30,
          "color":"#000000"
      }
  ]
};

//test to load a yml file
var JSONData = function YAMLtoJSON(userSessionDir, giturl, folderName, filename) {
    var projectFolderPath = userSessionDir + '/' + path.basename(giturl) + '/' + folderName;
    var yamlFile = projectFolderPath + "/" + filename;
    try {
      const doc = YAML.load(yamlFile);
      return doc;
    } catch (e) {
      return e;
    }
};
/*
var file = JSONData('C:/pat-web/public/projects/8bcdeb4f-02d9-4ed5-9dd4-e142f3547e93', 'https://gitlab.com/xOPERATIONS/sts-134', 'procedures', 'EVA1.yml');

//test imports
describe('Procedures to import YAML files', function(){
  //test import of valid yml procedure
  describe('Importing a valid procedure file', function(){
      it('Should always match the control file', function(){
        var file2 = JSONData('../public/projects/8bcdeb4f-02d9-4ed5-9dd4-e142f3547e93', 
          'https://gitlab.com/xOPERATIONS/sts-134', 
          'procedures', 
          'EVA1.yml');
        //assert.equal(file, file2, 'File contents do not match.')
        expect.assert.deepEqual(file, file2, 'File contents do not match.');
      });
  });
//test import of invalid yml procedure

//test import of valid yml task

//test import of invalid yml task

});
*/
//test read
describe('Reading a timeline collection.', function(){
  function readTimelineCollection(doc){
    var EV1 = [];
    var EV3 = [];

    for(i=0; i < doc.procedureTasks.length ; i++){
      var procedure = doc.procedureTasks[i];
      var task = loadTask(procedure.file, doc);
      if(task == 0){
        throw new Error('Task not found: ' + procedure.file);
      }
      //console.log('Task: ' + JSON.stringify(task));
      if(procedure.roles.crewA == 'EV1'){
        //console.log('Task for Crew A found.')
        EV1[EV1.length] = insertTask(task, 0);
        if(typeof procedure.roles.crewB != 'undefined'){
          //console.log('Task for Crew B found.')
          EV3[EV3.length] = insertTask(task, 1);
        }
      } else if(procedure.roles.crewA == 'EV3'){
        //console.log('Task for Crew A found.')
        EV3[EV3.length] = insertTask(task, 1);
      }
      if(typeof procedure.color != 'undefined'){
        var color = procedure.color;
        //console.log('Color found: ' + color);
        if(procedure.roles.crewA == 'EV1'){
          EV1[EV1.length-1].color = color;//
          //console.log('-- ' + color + ' added to EV1[' + JSON.stringify(EV1.length-1) + ']');
          if(procedure.roles.crewB == 'EV3'){
            EV3[EV3.length-1].color = color;
            //console.log('-- ' + color + ' added to EV3[' + JSON.stringify(EV3.length-1) + ']');
          }
        } else if(procedure.roles.crewA == 'EV3'){
          EV3[EV3.length-1].color = color;
          //console.log('-- ' + color + ' added to EV3[' + JSON.stringify(EV3.length-1) + ']');
        }
      }
    }
    newTimeline = {"EV1": EV1, "EV3": EV3};
    var json = JSON.stringify(newTimeline, null, 2);
    //fs.writeFile('C:/pat-web/public/testAssets/output.json', json, 'utf8', function(err){
      if (err) throw err;
      console.log('complete');
    });
    return newTimeline;
    }
    
    function loadTask(fileName, doc){
      //console.log('File Name: ' + fileName);
      for(u=0; u < doc.taskDetails.length ; u++){
        var currentTask = doc.taskDetails[u];
        var name = currentTask[0].file;
        if(name == fileName){
          console.log('Task Loaded: ' + name);
          return currentTask;
        }
      }
      return 0;
    }
    
    function insertTask(task, crew){
    var cell;
    if(crew == 0){
      cell = {"name": task[1].title, 
          "hours": task[2].duration.hours,
          "minutes": task[2].duration.minutes,
          "color": '#000000'
        };
    }
    else if(crew == 1 && typeof task[3] == 'undefined'){
      cell = {"name": task[1].title, 
          "hours": task[2].duration.hours,
          "minutes": task[2].duration.minutes,
          "color": '#000000'
        };
    }
    else if(crew == 1 && typeof task[3] != 'undefined'){
      cell = {"name": task[1].title, 
          "hours": task[3].duration.hours,
          "minutes": task[3].duration.minutes,
          "color": '#000000'
        };
    }
    if(typeof cell.hours === 'undefined'){
      cell.hours=0;
    };
    return cell;
    }    
    //sourceTimeline = require('C:/pat-web/public/testAssets/EvaTimelineCollection.json');
    //controlTimeline = require('C:/pat-web/public/testAssets/output-expected.json');
    var check;
  describe('Reading a valid collection', function(){
    var newTimeline = readTimelineCollection(sourceTimeline);
    //console.log(newTimeline);
    it('Should match the control value', function(){
      /*
      if(newTimeline == controlTimeline){
        check = 1;
      }
      expect.assert.deepEqual(check, 1, 'That wasn\'t even close');*/
      expect.assert.deepEqual(newTimeline, controlTimeline, 'That wasn\'t even close');
    });
  });
});
  
