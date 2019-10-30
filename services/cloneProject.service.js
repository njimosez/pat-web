/**
 * PAT WEB USE CASE 2 and 4
 * Service to establish a link with a GitLab repository URL, 
 * retrieve a PAT project and pass the data to the browser to 
 * render the project files with a link view a proccedure summary 
 * timeline
 * 
 * */


const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');
const db = require('../models');


/* Clone Project */
const cloneProjectdir = function (req, res, next, giturl) {

  // create the temp project dir   
  // create Pat Projects directory and a session user dir if necessary    
  var patProjectdir = './public/projects/';
  var userSessionDir = patProjectdir + req.sessionID;
  shell.mkdir('-p', patProjectdir, userSessionDir);
  //shell.mkdir(tmpProjectPath);

  // Retrieve the pat project  
  const simpleGit = require('simple-git')(userSessionDir);

  // TODO refactor to use promise
  simpleGit.clone(giturl, function (err, data) {

    if (err) {
      // Pass errors to Express.
      shell.rm('-Rf', userSessionDir);
      next(new Error(err));
    }

    else {

      // get the procedure files and link to render timelines and pass it to the view 
      var procedureFiles = getTree(userSessionDir + "/" + path.basename(giturl) + "/procedures/");
      procedureData = Object.byString(procedureFiles, 'children');

      // store session variables in the db
      let patsession = { uniqueId: req.sessionID, projectUrl: giturl, projectName: path.basename(giturl) };
      var user = db.User.create(patsession);
      console.log(user);


      // get the task files and pass it to the view 
      var taskFiles = getTree(userSessionDir + "/" + path.basename(giturl) + "/tasks/");
      taskData = Object.byString(taskFiles, 'children');

      // TODO try/cath to handle case where procedure and task folder do not exist or empty 
      // should the files be transformed to JSON ??? 

      res.render('project.html', { procedures: procedureData, tasks: taskData, project: path.basename(giturl) });
    }
  });

} // end module

/* tempProjectdir fot testing only*/
//TODO Replace with function call to retrieve a persisted obj of project file links from db 
// Awaiting YAML to JSON conversion to proceed
const tempProjectdir = function (req, res, projectUrl) {

  var patProjectdir = './public/projects/';
  var userSessionDir = patProjectdir + req.sessionID;
  var procedureFiles = getTree(userSessionDir + "/" + path.basename(projectUrl) + "/procedures/");
    procedureData = Object.byString(procedureFiles, 'children');

  var taskFiles = getTree(userSessionDir + "/" + path.basename(projectUrl) + "/tasks/");
  taskData = Object.byString(taskFiles, 'children');

  res.render('project.html', { procedures: procedureData, tasks: taskData, project: path.basename(projectUrl) });

}// end module

/* Get session by project URL */
 function getSessionData(req) {
  return db.User.findOne({
    where: { projectUrl: req.query.projectUrl }
  })
};

//********************Helper functions*********************************** 
// should be refactored into a helper folder for modularity 
/**
 * @param  {} dir ; procedure or task file directory path
 */
function getTree(dir) {
  // get only yaml files
  data = dirTree(dir, { extensions: /\.yml$/ }, (item, PATH, stats) => {

  });
  return data;
}

/**
 * @param  {} o
 * @param  {} s
 */
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

/* Export method */
module.exports = {
  cloneProjectdir: cloneProjectdir,
  tempProjectdir: tempProjectdir
};