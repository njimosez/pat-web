const shell = require('shelljs');
const Git = require("nodegit");
const path = require('path');
const walkProjectService = require('./walkProjectTree.service.js') ;

//Create project folder using session id
var message;
var getProjectdir = function(tmpProjectPath,giturl){
  
    cloneOpts = {};
    //create repos as work dir 
    if (shell.test('-d',  tmpProjectPath )) {
        shell.rm('-rf', tmpProjectPath);
       }
     else  {
        shell.mkdir(tmpProjectPath);
      Git.Clone(giturl, tmpProjectPath, cloneOpts).then(function (repo) {
          //send back 
       // console.log("Cloned " + path.basename(giturl) + " to " + repo.workdir());
        message = "Cloned " + path.basename(giturl) + " to " + repo.workdir();
       // return message;
    }).catch(function (err) {
      //  console.log(err);
        message = err;
     //   return message;
    });
    
   // var walkproject =  walkProjectService.walkProjectTree(tmpProjectPath);
       
    }
    //checks and return good info
    console.log(message);
    return message;
}
const Student = (() => {
  let _Student = class {};
  let props = {
      Age: null,
      Name: null,
      ID: null
  };
  for (let prop in props) {
      Object.defineProperty(_Student, prop, {
          get: function() {
              return props[prop];
          },
          set: function(newValue) {
              props[prop] = newValue;
          },
          enumerable: true
      });
  }
  return _Student;
})();

let student = new Student();
student.Age = 12;
student.Name = "Tolani";
student.ID = "Pokemon1234";
console.log(student.Age, student.Name, student.ID);



    /* Exports all methods */
module.exports = {
    getProjectdir: getProjectdir
  };