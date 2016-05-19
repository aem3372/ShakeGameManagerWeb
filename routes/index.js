var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var User = require('../models/user');

var DEBUG = true;

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user) {
    return res.redirect('/gamelist');
  }
  res.render('index', { errorMsg: '' });
});

router.get('/gamelist', function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/');
  }
  res.render('gamelist', { errorMsg: '' });
});

router.get('/gamesetting', function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/');
  }
  res.render('gamesetting', { 
    hasRecode: 'false',
    hasError: 'false' 
  });
});

router.post('/gamesetting', function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/');
  }
  
  res.render('gamesetting', { 
    hasRecode: 'false',
    hasError: 'false' 
  });
});

router.post('/login', function(req, res, next) {
  var name = String(req.body.name);
  var password = String(req.body.password);
  if(DEBUG) {
    console.log(name);
  }
  if (!name || !password) {
    if(DEBUG) {
      console.log('not allow');
    }
    return res.end();  //not allow
  }
  User.find({"name": name}, function(err, user) {
    if(err) {
      if(DEBUG) {
        console.log(err);
      }
      return res.end();
    }
    if (user.password != password) {
      if(DEBUG) {
        console.log('password error, current password: ' + password + ', db password:' + user.password);
      }
      return res.end();
    }
    if(DEBUG) {
      console.log('login successed');
    }
    req.session.user = user;
    return res.redirect('/gamelist');
  });
});

router.get('/logout', function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/');
  }
  req.session.user = null;
  return res.redirect('/');
});

module.exports = router;
