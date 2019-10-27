/**
 * PAT WEB USE CASE 2 and 4
 * Service to establish a link with a GitLab repository URL, 
 * retrieve a PAT project and pass the data to the browser to 
 * render the project files with a link view a proccedure summary 
 * timeline
 * 
 * @param  {} 'shelljs'
 * @param  {} ;constpath=require('path'
 * @param  {} ;constfs=require('fs'
 * @param  {} ;constdirTree=require('directory-tree'
 */

//******************************************************* 
const shell = require('shelljs');
const path = require('path');
const fs = require('fs');
const dirTree = require('directory-tree');

//******************************************************* 

/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @param  {} tmpProjectPath ; temp project directory path using sessionid
 * @param  {} giturl ; input from the user
 */
const cloneProjectdir = function (req, res, next, tmpProjectPath, giturl) {

  // TODO serve the project files if project exist and session is not expire 

  // create the temp project dir   
  shell.mkdir(tmpProjectPath);

  // Retrieve the pat project from 
  const simpleGit = require('simple-git')(tmpProjectPath);

  // TODO refactor to use promise
  simpleGit.clone(giturl, function (err, data) {

    if (err) {
      // Pass errors to Express.
      shell.rm('-Rf', tmpProjectPath);
      next(new Error(err));
    }

    else {

      // get the procedure files and link to render timelines and pass it to the view 
      var procedureFiles = getTree(tmpProjectPath + "/" + path.basename(giturl) + "/procedures/");
      procedureData = Object.byString(procedureFiles, 'children');

      // get the task files ony and pass it to the view 
      var taskFiles = getTree(tmpProjectPath + "/" + path.basename(giturl) + "/tasks/");
      taskData = Object.byString(taskFiles, 'children');

      // TODO try/cath to handle case where procedure and task folder do not exist or empty 
      // should the files be transformed to JSON ??? 

      res.render('project.html', { procedures: procedureData, tasks: taskData, project :path.basename(giturl) });
    }
  });
} // end module

//******************************************************* 
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

//******************************************************* 
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
//******************************************************* 

/* Exports method */
module.exports = {
  cloneProjectdir: cloneProjectdir
};