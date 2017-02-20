'use strict';

let fakeAuth = function (req, res, next) {
  
    let user = {
            given_name: 'Robin',
            family_name: 'Count',
            email: 'Robin.Count@experiencehol.onmicrosoft.com'
        };

if(req.headers.authorization == 'true')
      {
          req.user = user;
      }  

    next();
};

let fakeAuthParser = function () {
    return fakeAuth;
};

module.exports = { fakeAuthParser: fakeAuthParser };