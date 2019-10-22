
const shell = require('shelljs');
//const projectService = require('../services/cloneProject.service.js') ;
//const shell = require('shelljs');
const Git = require("nodegit");
const path = require('path');



module.exports = function(app) {

    // Index page controller
    app.get('/', function(req, res) {
        console.log(req.sessionID)
        res.render('index.html');

    });

    app.post('/project', function(req, res) {
        console.log(req.body.giturl);

       var tmpProjectPath = './public/' + req.sessionID;
     //  console.log(tmpProjectPath);
     cloneOpts = {};
    //create repos as work dir 
    
      //  shell.mkdir(tmpProjectPath);
     Git.Clone(req.body.giturl, tmpProjectPath, cloneOpts).then(function (repo) {
          //send back 
        console.log("Cloned " + path.basename(req.body.giturl) + " to " + repo.workdir());
       message = "Cloned " + path.basename(req.body.giturl) + " to " + repo.workdir();
      // console.log(message);
       return message;
    }).catch(function (err) {
       console.log(err);
     //   message = err;
     //   return message;
    }
    // good then recursively create class ? of the repo or show repo tree -> then class
    );
    
   // var walkproject =  walkProjectService.walkProjectTree(tmpProjectPath);
       
   
  ///console.log(projectService.getProjectdir(tmpProjectPath,req.body.giturl));
      
  console.log(path.basename(req.body.giturl));
       
        //res.log(1)
        res.send(path.basename(req.body.giturl));
        // res.render('project', { data: getTree() });

        //  $('#tree').treeview({data: getTree()});
        // console.log(dir.path)
        // data.forEach(file => {
        //  console.log(file);
        //});
    });

}; // end module.