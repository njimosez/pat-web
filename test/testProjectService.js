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
const procedureFolder = {'EVA1.yml':{"userId":"fakeID","columnHeaderText":["EV1 (Drew)","EV3 (Taz)"],"procedureDetails":{"procedure_name":"STS-134 EVA 1","columns":[{"key":"IV","display":"IV/SSRMS","actors":"*"},{"key":"EV1","actors":"EV1","display":"EV1 (Drew)"},{"key":"EV3","actors":"EV3","display":"EV3 (Taz)"}],"tasks":[{"file":"egress.yml","roles":{"crewA":"EV1","crewB":"EV3"}},{"file":"misse7.yml","roles":{"crewA":"EV1","crewB":"EV3"},"color":"#FFD700"},{"file":"misse8.yml","roles":{"crewA":"EV1"},"color":"#FFD700"},{"file":"s3-ceta-light-install.yml","roles":{"crewA":"EV3"}},{"file":"stbd-sarj-cover-7-install.yml","roles":{"crewA":"EV3"}},{"file":"p3-p4-nh3-jumper-install.yml","roles":{"crewA":"EV1","crewB":"EV3"},"color":"#00FFFF"},{"file":"p5-p6-nh3-jumper-install-n2-vent.yml","roles":{"crewA":"EV1"},"color":"#00FFFF"},{"file":"p3-p4-nh3-jumper-temp-stow.yml","roles":{"crewA":"EV3"},"color":"#00FFFF"},{"file":"ewc-antenna-install.yml","roles":{"crewA":"EV1","crewB":"EV3"},"color":"#90EE90"},{"file":"vteb-reconfig.yml","roles":{"crewA":"EV1"},"color":"#00FFFF"},{"file":"ingress.yml","roles":{"crewA":"EV1","crewB":"EV3"}}]},"_id":"7m7i0Dcg4SC8N3ls"}};
const taskFolder = {"egress.yml":{"file":"egress.yml","title":"EGRESS/SETUP","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},"egress.yml":{"file":"egress.yml","title":"EGRESS/SETUP","crew":"crewB","hours":"00","minutes":25,"cellHeight":50},"ewc-antenna-install.yml":{"file":"ewc-antenna-install.yml","title":"EWC Antenna Install","crew":"crewA","hours":"00","minutes":20,"cellHeight":40},"ewc-antenna-install.yml":{"file":"ewc-antenna-install.yml","title":"EWC Antenna Install","crew":"crewB","hours":"00","minutes":45,"cellHeight":90},"ingress.yml":{"file":"ingress.yml","title":"Cleanup / Ingress","crew":"crewA","hours":"00","minutes":30,"cellHeight":60},"ingress.yml":{"file":"ingress.yml","title":"Cleanup / Ingress","crew":"crewB","hours":"00","minutes":30,"cellHeight":60},"misse7.yml":{"file":"misse7.yml","title":"MISSE 7 RETRIEVE","crew":"crewA","hours":1,"minutes":"00","cellHeight":120},"misse7.yml":{"file":"misse7.yml","title":"MISSE 7 RETRIEVE","crew":"crewB","hours":1,"minutes":"00","cellHeight":120},"misse8.yml":{"file":"misse8.yml","title":"MISSE 8 Install","crew":"crewA","hours":"00","minutes":40,"cellHeight":80},"p3-p4-nh3-jumper-install.yml":{"file":"p3-p4-nh3-jumper-install.yml","title":"P3/P4 NH3 Jumper Install","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},"p3-p4-nh3-jumper-install.yml":{"file":"p3-p4-nh3-jumper-install.yml","title":"P3/P4 NH3 Jumper Install","crew":"crewB","hours":"00","minutes":25,"cellHeight":50},"p3-p4-nh3-jumper-temp-stow.yml":{"file":"p3-p4-nh3-jumper-temp-stow.yml","title":"P3/P4 NH3 Jumper Temp Stow","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},"p5-p6-nh3-jumper-install-n2-vent.yml":{"file":"p5-p6-nh3-jumper-install-n2-vent.yml","title":"P5/P6 NH3 Jumper Install / N2 Vent","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},"s3-ceta-light-install.yml":{"file":"s3-ceta-light-install.yml","title":"S3 CETA Light Install","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},"stbd-sarj-cover-7-install.yml":{"file":"stbd-sarj-cover-7-install.yml","title":"Stbd SARJ Cover 7 Install","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},"vteb-reconfig.yml":{"file":"vteb-reconfig.yml","title":"VTEB Cleanup","crew":"crewA","hours":"00","minutes":25,"cellHeight":50}};
const taskDocFolder = {"egress.yml":{"title":"EGRESS/SETUP","roles":[{"name":"crewA","description":"Crewmember exiting A/L first, in charge of operating hatch","duration":{"minutes":25}},{"name":"crewB","description":"Crewmember exiting A/L second, in charge of operating UIA","duration":{"minutes":25}}],"steps":[{"simo":{"IV":[{"step":"Record PET start time ____:____ (Pwr to Batt)"},{"step":"Start WVS Recorders"},{"images":[{"path":"safety-tether-config.png","width":250}]}],"crewA":[{"step":"{{CHECK}} All gates closed & hooks locked","title":"**Initial Configuration**","checkboxes":["{{CHECK}} R Waist Tether to {{role:crewB}} Blank hook","{{CHECK}} Red hook on L D-ring ext","{{CHECK}} Yellow hook on Green ERCM","{{CHECK}} Green hook on Red ERCM","{{CHECK}} Blank hook on MWS"]}],"crewB":[{"step":"{{CHECK}} All gates closed & hooks locked","title":"*Initial Configuration*","checkboxes":["{{CHECK}} All gates closed & hooks locked","{{CHECK}} R Waist Tether to A/L D-ring ext","{{CHECK}} Red hook on L D-ring ext","{{CHECK}} Yellow hook on Green ERCM","{{CHECK}} Green hook on Red ERCM","{{CHECK}} Blank hook to {{role:crewA}} R Waist Tether"]}]}},{"simo":{"crewA":[{"step":"Open hatch thermal cover","title":"EGRESS/SETUP (00:25)"},{"step":"Egress A/L"}],"IV":"Start Hatch thermal cover clock PET(30 min) ____:____"}},{"simo":{"crewA":[{"step":"Receive EWC ORU bag from EV3, stow on BRT w/RET"}],"crewB":[{"step":"Transfer EWC ORU Bag to {{role:crewA}}","checkboxes":["Position CETA ORU bag near hatch"]},{"step":"This is a step","note":["Connector ops may be done in any order. Defer moving toaster and AM radio as desired"],"caution":["Avoid contact with: Tires and Car mirrors, blue paint on zenith side of Rear View Mirror\n(RVM), Door Handle petals, trailer hitches alignment guide and attachement shaft,\nexposed bolts of underside of the hood latch restraint, radio antenna and back up\ncamera, and in-car Bluetooth and forward lights (translation on base of radio antenna\nand lower half of lights is acceptable).\n","Avoid imparting any loads in the forward direction into car until brakes are engaged."],"warning":"If Portable Wireless Toaster will not power on, avoid inadvertent contact (may fall below touch temp limits)","comment":["a comment"]}]}},{"simo":{"crewB":[{"step":"Perform buddy checks","checkboxes":["MWS tabs up","BRT tab up","tether configs"]},{"step":"Verify SAFER config","checkboxes":["{{CHECK}}L handle down (MAN ISOL Vlv - Open)","{{CHECK}}R handle down (HCM - Closed)"]},{"step":"{{CHECK}}WVS - Green LED"}],"IV":[{"step":"Post crew egress, WVS Software:","substeps":[{"step":"select page - RF camera."},{"step":"Sel 'Advanced Controls'"},{"step":"S-Band Level (two) - Max"}]}]}},{"simo":{"crewA":[{"step":"Perform buddy checks","checkboxes":["MWS tabs up","BRT tab up","tether configs"]},{"step":"Verify SAFER config","checkboxes":["{{CHECK}}L handledown (MAN ISOL Vlv - Open)","{{CHECK}}R handle down (HCM - Closed)"]},{"step":"{{CHECK}}WVS - Green LED"}],"crewB":[{"step":"Perform buddy checks","checkboxes":["MWS tabs up","BRT tab up","tether configs"]},{"step":"Verify SAFER config","checkboxes":["{{CHECK}}L handle down (MAN ISOL Vlv - Open)","{{CHECK}}R handle down (HCM - Closed)"]},{"step":"{{CHECK}}WVS - Green LED"}]}},{"simo":{"crewA":[{"step":"Translate to S0 Port Struts"},{"step":"Attach {{role:crewA}} **BLANK**hook to port-outboard strut","checkboxes":["{{CHECK}} Gat closed, hook locked, reels unlocked, release RET"]},{"step":"Attach {{role:crewB}} **BLANK** hook toport-inboard strut","checkboxes":["{{CHECK}} Gate closed, hook locked"]},{"step":"Release {{role:crewA}} R Waist Tether from {{role:crewB}} **BLANK** hook"}],"crewB":[{"step":"Retrieve CETA ORU bag, stow on BRT with RET"}]}},{"simo":{"crewA":[{"step":"Give **EV3 GO** to release Waist Tether"}],"crewB":[{"step":"On **{{role:crewA}} GO**, {{role:crewB}} release right Waist Tether from Airlock internal D-Ring"}]}},{"simo":{"crewA":[{"step":"Translate forward along Lab."},{"step":"Stow EWC ORU bag on Lab HR 0260, 0259 with hinge ISS aft"},{"step":"Translate to S1 Face 1, zenith - MISSE 7 Retrieve"}],"crewB":[{"step":"Close hatch thermal cover"},{"step":"Perform translation adaptation"},{"step":"Translate to S1 Face 1, nadir - MISSE 7 Retrieve"}]}},{"IV":[{"step":"Stop Hatch Thermal Coverclock PET (30 min) ____:____"}]}]},
"ewc-antenna-install.yml":{"title":"EWC Antenna Install","roles":[{"name":"crewA","description":"Please add description","duration":{"hours":2,"minutes":20}},{"name":"crewB","duration":{"hours":2,"minutes":45}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD","crewB":"TBD"}}]},
"ingress.yml":{"title":"Cleanup / Ingress","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":30}},{"name":"crewB","duration":{"minutes":30}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD","crewB":"TBD"}}]},
"misse7.yml":{"title":"MISSE 7 RETRIEVE","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":60}},{"name":"crewB","duration":{"minutes":60}}],"steps":[{"simo":{"IV":[{"step":"Verify inhibits in place","substeps":[{"step":"{{CHECK}} Stbd SARJ locked"},{"step":"{{CHECK}} MISSE/ELC-2 inhibits"}]}]}},{"simo":{"crewA":[{"warning":"Do not touch the hinged side while closing the MISSE PECs (Pinch Point)"},{"caution":["Beware sharp stuff!","Also beware gooey things.","Avoid inadverntent contat with the deployed MISSE PECs, which have shatterable materials, and the silver avionics boxes atop the ExPA","There isn't asecond caution in this block, but I wanted to add one here to show that there could be (also for \"warning\" and \"note\" blocks)."]}],"crewB":[{"warning":"Donot touch the hinged side while closing the MISSE PECs (Pinch Point)"},{"caution":["Avoid inadverntent contat with the deployed MISSE PECs, which have shatterable materials, and the silver avionics boxes atop the ExPA","There isn't a second caution in this block, but I wanted to add one here to show that there couldbe (also for \"warning\" and \"note\" blocks)."]}]}},{"simo":{"crewA":[{"step":"Translate to S1 Face 2, zenith route","checkboxes":["Fairlead on S0 HR 3467 (bay 1)"]},{"step":"Attach '''GREEN''' hook on S1 HR 3208 (bay 17)","checkboxes":["{{CHECK}} Gate closed, hook locked, reels unlocked, release RET"]},{"step":"Translate zenith to ELC-2","checkboxes":["Fairlead on S3 HR 3052 (face 1)"]},{"step":"Photograph deployed PECs","substeps":[{"step":"PEC 7B ({{CHECK}} Ram/Fwd side, {{CHECK}} Aft side)"},{"step":"PEC 7A ({{CHECK}} Zenith side, {{CHECK}} Nadir side)"},{"step":"{{CHECK}}{{CHECK}} Overall View (2 angles)"}]}],"crewB":[{"step":"Translate to S1 Face 6, nadir route"},{"step":"Attach '''GREEN''' hook on S1 HR 3217 or Xo 5790 (bay 17)","checkboxes":["Gate closed, hook locked, reels unlocked, release RET"]},{"step":"Translate outbd to bay 19"},{"step":"Stow CETA ORU bag on S3 HRs 3046, 3038"},{"step":"Translate zenith to ELC2"}]}},{"crewB":[{"step":"If {{role:crewA}} complete with photos of PEC 7B, close PEC 7B","checkboxes":["All 4 PIP pins are re-installed"]},{"step":"Disconnect connector fromPEC 7B","checkboxes":["RET, remove cap from dummy connector J7B","Demate connector from PEC","Mate connector to dummy connector J7B ({{CHECK}} no FOD, pins)","Install cap onto PEC 7B"]}]},{"simo":{"crewA":[{"step":"Close PEC 7A","checkboxes":["{{CHECK}} All 4 PIP pins are re-installed"]}],"crewB":[{"step":"Disconnect connector from PEC 7A","checkboxes":["RET, remove cap from dummy connector J7A","Demate connector from PEC","Mate connector to dummy connector J7A ({{CHECK}}no FOD, pins)","Install cap onto PEC 7A"]}]}},{"crewB":[{"step":"Release PEC 7B (2 PIP pins), stow on BRT w/RET (nadir HR)","checkboxes":"Reinstall Socket PIPpins (2)"},{"step":"Release PEC 7A (release 2 PIP pins), stow on BRT w/RET (RAM HR)","checkboxes":["Reinstall Socket PIP pins (2)"]}]},{"simo":{"crewA":[{"caution":"When translating around fwd edge of Node 2 and PMA2, avoid contact with Shuttle"}],"crewB":[{"caution":"When translating around fwd edge of Node 2 and PMA2, avoid contact with Shuttle"}]}},{"simo":{"crewA":[{"step":"Retrieve GREEN hook from S1 HR 3208","checkboxes":"Gate closed, hook locked, reels unlocked, release RET"},{"step":"Translate to Node 2, along port/zenith"},{"step":"Attach GREEN hook on Node 2 HR 0344","checkboxes":"Gate closed, hook locked, reels unlocked, release RET","title":"STOW MISSE 7A IN PLB (00:10)"},{"step":"Translate to Orbiter, port, bay 4"},{"step":"Remove SWC latch PIP pins (2)"},{"step":"Release latch (2) from stow position"},{"step":"Stow PEC 7A in carrier (HRs out, Probe up)"},{"step":"Lock fwd latch in landing config","checkboxes":"Install PIP pin"},{"step":"Retrieve RET"},{"step":"Lock aft latch in landing config","checkboxes":"Install PIP pin"}],"crewB":[{"step":"Retrieve GREEN hook from S1 HR 3217 orXo 5790","checkboxes":"Gate closed, hook locked, reels unlocked, release RET"},{"step":"Translate to Node 2, stbd/zenith route","checkboxes":["Fairlead on LabHR 0247 with wrist Adj","Fairlead on Node 2 HR 0314","Face toward Col and Node 2"]},{"warning":"Stay  2 ft from exposed EFGF connector when OBSS berthed, powered, and EFGF not grappled","title":"STOW MISSE 7B IN PLB (00:15)"},{"step":"Translate to Orbiter, stbd, bay 4"},{"step":"Remove SWC latch PIP pins (2)"},{"step":"Release latch (2) from stow position"},{"step":"Stow PEC 7B in carrier (HRs out, Probe up)"},{"step":"Lock aft latch in landing config","checkboxes":"Install PIP pin"},{"step":"Retrieve RET"},{"step":"Lock fwd latch in landing config","checkboxes":"Install PIP pin"}]}},{"simo":{"crewA":[{"step":"Glove and Gauntlet check"},{"step":"Translate aft to Bay 9 - MISSE 8 Retrieve"}],"crewB":[{"step":"**Glove and Gauntlet check**"},{"step":"'''Translate aft to S3 Face 1 - S3 CETA Light Install'''"}]}}]},
"misse8.yml":{"title":"MISSE 8 Install","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":40}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD"}}]},
"p3-p4-nh3-jumper-install.yml":{"title":"P3/P4 NH3 Jumper Install","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":35}},{"name":"crewB","duration":{"minutes":25,"offset":{"minutes":10}}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD"}}]},
"p3-p4-nh3-jumper-temp-stow.yml":{"title":"P3/P4 NH3 Jumper Temp Stow","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":35}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD"}}]},
"p5-p6-nh3-jumper-install-n2-vent.yml":{"title":"P5/P6 NH3 Jumper Install / N2 Vent","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":35}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD"}}]},
"s3-ceta-light-install.yml":{"title":"S3 CETA Light Install","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":25}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD"}}]},
"stbd-sarj-cover-7-install.yml":{"title":"Stbd SARJ Cover 7 Install","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":25}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD"}}]},
"vteb-reconfig.yml":{"title":"VTEB Cleanup","roles":[{"name":"crewA","description":"Please add description","duration":{"minutes":25}}],"steps":[{"simo":{"IV":"TBD","crewA":"TBD"}}]}};
const imageFolder = {"safety-tether-config.png":{file:'safety-tether-config.png'}};
const taskFinal = {"userId":"fakeID","tasksDetails":[{"file":"egress.yml","title":"EGRESS/SETUP","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},{"file":"egress.yml","title":"EGRESS/SETUP","crew":"crewB","hours":"00","minutes":25,"cellHeight":50},{"file":"ewc-antenna-install.yml","title":"EWC Antenna Install","crew":"crewA","hours":"00","minutes":20,"cellHeight":40},{"file":"ewc-antenna-install.yml","title":"EWC Antenna Install","crew":"crewB","hours":"00","minutes":45,"cellHeight":90},{"file":"ingress.yml","title":"Cleanup / Ingress","crew":"crewA","hours":"00","minutes":30,"cellHeight":60},{"file":"ingress.yml","title":"Cleanup / Ingress","crew":"crewB","hours":"00","minutes":30,"cellHeight":60},{"file":"misse7.yml","title":"MISSE 7 RETRIEVE","crew":"crewA","hours":1,"minutes":"00","cellHeight":120},{"file":"misse7.yml","title":"MISSE 7 RETRIEVE","crew":"crewB","hours":1,"minutes":"00","cellHeight":120},{"file":"misse8.yml","title":"MISSE 8 Install","crew":"crewA","hours":"00","minutes":40,"cellHeight":80},{"file":"p3-p4-nh3-jumper-install.yml","title":"P3/P4 NH3 Jumper Install","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},{"file":"p3-p4-nh3-jumper-install.yml","title":"P3/P4 NH3 Jumper Install","crew":"crewB","hours":"00","minutes":25,"cellHeight":50},{"file":"p3-p4-nh3-jumper-temp-stow.yml","title":"P3/P4 NH3 Jumper Temp Stow","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},{"file":"p5-p6-nh3-jumper-install-n2-vent.yml","title":"P5/P6 NH3 Jumper Install / N2 Vent","crew":"crewA","hours":"00","minutes":35,"cellHeight":70},{"file":"s3-ceta-light-install.yml","title":"S3 CETA Light Install","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},{"file":"stbd-sarj-cover-7-install.yml","title":"Stbd SARJ Cover 7 Install","crew":"crewA","hours":"00","minutes":25,"cellHeight":50},{"file":"vteb-reconfig.yml","title":"VTEB Cleanup","crew":"crewA","hours":"00","minutes":25,"cellHeight":50}],"_id":"6T5DoJbkLgV1Rm7r"};

const reqt = {sessionID: 'fakeID-6b15-4e8f-9f73-1b891b043a31'};
const rest = {render: function(html, object){
    console.log('res.render(' + html + ', ' + object + ')');
    }
};
const nextt = function(err){console.log('error')};

function cloneProjectDir (req, res, next, giturl, err) {
    //console.log(patProjectdir + req.sessionID);
    var stubData = {};
    var userSessionDir = patProjectdir + req.sessionID;
    //console.log(userSessionDir);
    shell.mkdir('-p', patProjectdir, userSessionDir);
    //const simpleGit = require('simple-git')(userSessionDir);
    var stubData = {path: userSessionDir};

    /*simpleGit.clone(giturl, function (err, data) {
    if (err) {
      shell.rm('-Rf', userSessionDir);
      next(new Error(err)); // Pass errors to Express.
    } else {*/

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

      //console.log(userSessionDir + "/" + path.basename(giturl) + "/" + procedureFolderName);
      //var procedureMetaDoc = serviceUtils.patProjectData(userSessionDir, giturl, procedureFolderName, next, req);
      stubData.path = stubData.path + "/sts-134";
      stubData.procedurePath = stubData.path + "/procedures";
      stubData.procedures = [{"name":"EVA1.yml", "path":stubData.procedurePath+"EVA1.yml"}];
      

      for (var x in stubData.procedures) {
        let filename = stubData.procedures[x].name;
        let procedureDoc = procedureFolder[filename];

        myMaestroProjectDoc.procedureMeta.push({
          filename: stubData.procedures[x].name,
          path: stubData.procedures[x].path,
          procedure_name: procedureDoc.procedure_name
        });

        EvaProcedure.columnHeaderText = serviceUtils.getColumnHeaderTextByActor(procedureDoc.columns);
        EvaProcedure.procedureDetails = procedureDoc;
      }
      stubData.finalProcedure = EvaProcedure;

      // retrieve object from the task folder
      //var tasksMetaDoc = serviceUtils.patProjectData(userSessionDir, giturl, tasksFolderName, next, req);
      stubData.taskPath = stubData.path + "/tasks";
      stubData.tasks = [{"name":"egress.yml", "path":stubData.taskPath+"/egress.yml"},{"name":"ewc-antenna-install.yml", "path":stubData.taskPath+'/ewc-antenna-install.yml'},{"name":"ingress.yml","path":stubData.taskPath+'/ingress.yml'},{"name":"misse7.yml", "path":stubData.taskPath+'/misse7.yml'},{"name":"misse8.yml", "path":stubData.taskPath+'/misse8.yml'},{"name":"p3-p4-nh3-jumper-install.yml", "path":stubData.taskPath+'/p3-p4-nh3-jumper-install.yml'},{"name":"p3-p4-nh3-jumper-temp-stow.yml", "path":stubData.taskPath+'/p3-p4-nh3-jumper-temp-stow.yml'},{"name":"p5-p6-nh3-jumper-install-n2-vent.yml", "path":stubData.taskPath+'/p5-p6-nh3-jumper-install-n2-vent.yml'},{"name":"s3-ceta-light-install.yml", "path":stubData.taskPath+'/s3-ceta-light-install.yml'},{"name":"stbd-sarj-cover-7-install.yml", "path":stubData.taskPath+'/stbd-sarj-cover-7-install.yml'},{"name":"vteb-reconfig.yml", "path":stubData.taskPath+'/vteb-reconfig.yml'}];

      for (x in stubData.tasks) {
        var taskfilename = stubData.tasks[x].name;
        var taskDoc = taskDocFolder[taskfilename];

        myMaestroProjectDoc.tasksMeta.push({
          filename: taskfilename,
          title: taskDoc.title,
          path: stubData.tasks[x].path
        });

        var tasks = taskDoc.roles;
        //console.log(taskDoc);
        for (var t in tasks) {
          var duration = serviceUtils.timeConvert(tasks[t].duration.hours, tasks[t].duration.minutes);

          var obj = _.object(['file', 'title', 'crew', 'hours', 'minutes', 'cellHeight'], [taskfilename, taskDoc.title,
            tasks[t].name, duration.hours, duration.minutes, duration.cellHeight
          ]);
          EvaTasks.tasksDetails.push(obj);
        }
      }
      stubData.finalTasks = EvaTasks;
      //stubData.finalTasks = taskFinal;

      stubData.imagePath = stubData.path + '/images'
      var imagedoc = [{name:imageFolder["safety-tether-config.png"].file, path:stubData.imagePath+'/safety-tether-config.png'}];

      for (x in imagedoc) {
        myMaestroProjectDoc.images.push({
          name: imagedoc[x].name,
          path: imagedoc[x].path
        });
      }
      stubData.EvaImages = myMaestroProjectDoc.images;



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
  return(stubData);
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
        
        var procedureObj = datab.finalProcedure.procedureDetails
        var procedureArr = procedureObj.procedureDetails;
        var taskObj = datab.finalTasks;
        var taskArr = taskObj.tasksDetails;
        var imageArr = datab.EvaImages;

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
            assert.equal(procedureArr.procedure_name,"STS-134 EVA 1",'Oops');
        });
        it('should record the right number of tasks', function(){
            assert.equal(taskArr.length,16,'Oops');
        })
        it('should record the right task[0].', function(){
            assert.equal(taskArr[0].file,'egress.yml','Oops');
        });
        it('should record the right image file.', function(){
            assert.equal(imageArr[0].name,'safety-tether-config.png','Oops');
        });
    });
  });
