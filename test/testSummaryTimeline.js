
const assert = require('assert');
const expect = require('chai');
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const dirTree = require('directory-tree');
YAML = require('yamljs');
var beau = require('json-beautify')

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
    return {"EV1": EV1, "EV3": EV3};
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
    var sourceTimeline = require('C:/pat-web/public/testAssets/EvaTimelineCollection.json');
    var controlTimeline = require('C:/pat-web/public/testAssets/output-expected.json');
    var check;
  describe('Reading a valid collection', function(){
    var newTimeline = readTimelineCollection(sourceTimeline);
    //console.log(newTimeline);
    var json = JSON.stringify(newTimeline, null, 2);
    fs.writeFile('C:/pat-web/public/testAssets/output.json', json, 'utf8', function(err){
      if (err) throw err;
      console.log('complete');
    });
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
  
