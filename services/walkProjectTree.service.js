const nodegit = require("nodegit");
const Promise = require('promise');




var walkProjectTree = function(tmpProjectPath){


  nodegit.Repository.open('./public/8cab3d41-7cba-48a3-93df-927c35d4c394').then(function(repo) {
    /* Get the current branch. */
    return repo.getCurrentBranch().then(function(ref) {
      console.log("On " + ref.shorthand() + " (" + ref.target() + ")");
  
      /* Get the commit that the branch points at. */
      return repo.getBranchCommit(ref.shorthand());
    }).then(function (commit) {
      /* Set up the event emitter and a promise to resolve when it finishes up. */
      var hist = commit.history(),
          p = new Promise(function(resolve, reject) {
              hist.on("end", resolve);
              hist.on("error", reject);
          });
      hist.start();
      return p;
    }).then(function (commits) {
      /* Iterate through the last 10 commits of the history. */
      for (var i = 0; i < 10; i++) {
        var sha = commits[i].sha().substr(0,7),
            msg = commits[i].message().split('\n')[0];
        console.log(sha + " " + msg);
      }
    });
  }).catch(function (err) {
    console.log(err);
  }).done(function () {
    console.log('Finished');
  });
      
    }

    /* Exports all methods */
module.exports = {
    walkProjectTree : walkProjectTree 
  };


  