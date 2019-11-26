//begin testing
const assert = require('assert');
const expect = require('chai');
const { check, validationResult } = require('express-validator');
const _ = require('underscore');
var req = {sessionID: 'fakeID'};
var res = {render: function(html, object){
  console.log('res.render(' + html + ', ' + object + ')');
  }
};
var next = function(){console.log('next')};

describe('Array of URL\'s for comparing with URL input.', function(){

    describe('Version 2: hardcoded array outside post statment.', function(){
        //v2
        it('Should report that the url passes.', function(){
        var urlarray = [
            'https://gitlab.com/xOPERATIONS/sts-134',
            'https://gitlab.com/xOPERATIONS/sts-135',
            'https://gitlab.com/xOPERATIONS/sts-136'
        ]
        //var appPost = [check(urlarray).contains('https://gitlab.com/xOPERATIONS/sts-134')]
        var errorcount = 0;
        if(urlarray.indexOf('https://gitlab.com/xOPERATIONS/sts-134') < 0){
            errorcount++;
        }
        //const errors = validationResult(req);
        //expect.assert.isEmpty(errorcount, 'Error found: Invalid URL')
        assert.equal(errorcount, 0, 'Error found: Invalid URL');
        });
    });
});
