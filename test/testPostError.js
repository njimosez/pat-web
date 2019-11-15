//begin testing
const assert = require('assert');
//const expect = require('chai');
const shell = require('shelljs');
const path = require('path');

//start of tests
console.log('testing start.')

/**
* unit test for PAT-WEB use case 1:
* -  Establish a link with a GitLab repository URL to retrieve a PAT project
*/
//d1. unit tests of POST project
describe('POST project', function() {
  //d1.d1. unit test for error checking
  describe('presence of error', function() {
    //require
    const cloneProjectService = require('../services/patProjectservice');
    const path = require('path');
    const { check, validationResult } = require('express-validator');
    const patProjectdir = './public/projects/';


    //Send https://gitlab.com/xOPERATIONS/sts-134 to projectdownloader
    var req = {sessionID: 'fakeID'};
    var res = {render: function(html, object){
      console.log('res.render(' + html + ', ' + object + ')');
      }
    };
    var next = function(){console.log('next')};
    var tmpUrl = 'https://gitlab.com/xOPERATIONS/stx-134';
    var test = 0;
    var userSessionDir = patProjectdir + req.sessionID;
    shell.mkdir('-p', patProjectdir, userSessionDir);
    const simpleGit = require('simple-git')(userSessionDir);

    //d1.d1.it1. test for error in URL
    it('Should return 1 when the error is caught.', function() {
     
      //check for error
      simpleGit.clone(tmpUrl, function (err, data) {
        if (err) {
          shell.rm('-Rf', userSessionDir);
          test = 1;
          //console.log('test set to 1')
        }else {
          shell.rm('-Rf', userSessionDir);
          test = -1;
          //console.log('test set to -1')
        }
        assert(test, 1, 'error not caught: '+test);
      });
    });//end d1.d1.it1

  });//end d1.d1

});//end d1
