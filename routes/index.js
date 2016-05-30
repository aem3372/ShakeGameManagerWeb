var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var md5 = crypto.createHash('md5');
var socket = require('../socket');
var User = require('../models/user');
var Game = require('../models/game');
var DateUtil = require('../utils/time')
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

  Game.get({"adminId": req.session.user._id}, function(err, doc) {
    doc.forEach(function(game) {
      var date = DateUtil.format(new Date(game.startTime), 'yyyy-MM-dd hh:mm');
      game.startTimeFormat = '' + date;
      console.log(game.startTime);
    });
    console.log(doc);
    res.render('gamelist', {
      games: doc,
      errorMsg: ''
    });    
  });
});

router.get('/gamesetting', function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/');
  }
  if(!req.query.recode) {
    return res.render('gamesetting', { 
      hasRecode: 'false',
      hasError: 'false' 
    });
  }
  var name = req.query.recode;
  if(DEBUG) {
    console.log(name);
  }
  Game.find({"name": name}, function(err, game) {
    if(DEBUG) {
      console.log(game);
    }
    return res.render('gamesetting', { 
      hasRecode: 'true',
      hasError: 'false',
      word: game.name,
      date: DateUtil.format(new Date(game.startTime), 'yyyy-MM-dd hh:mm'),
      time: game.duration
    });
  });
});

router.post('/gamesetting', function(req, res, next) {
  if(!req.session.user) {
    return res.redirect('/');
  }
  var name = String(req.body.word);
  var date = String(req.body.date);
  var time = String(req.body.time);
  if(DEBUG) {
    console.log({"name": name, "date": date, "time": time});
  }
  new Game({
    name: name,
    adminId: req.session.user._id,
    startTime: new Date(date).getTime(),
    duration: time
  }).save(function(err) {
    socket.emit('notifyUpdate', {
      startTime: new Date(date).getTime(),
      duration: time
    });
    res.render('gamesetting', { 
      hasRecode: 'true',
      hasError: 'false',
      word: name,
      date: date,
      time: time
    });
  });
});

router.post('/login', function(req, res, next) {
  var name = String(req.body.name);
  var password = String(req.body.password);
  password = md5.update(password).digest('base64');
  if(DEBUG) {
    console.log(name);
  }
  if (!name || !password) {
    if(DEBUG) {
      console.log('not allow');
    }
    return res.render('index', { errorMsg: '信息错误' });
  }
  User.find({"name": name}, function(err, user) {
    if(err) {
      if(DEBUG) {
        console.log(err);
      }
      return res.render('index', { errorMsg: '信息错误' });
    }
    if(!user) {
      return res.render('index', { errorMsg: '信息错误' });
    }
    if (user.password != password) {
      if(DEBUG) {
        console.log('password error, current password: ' + password + ', db password:' + user.password);
      }
      return res.render('index', { errorMsg: '信息错误' });
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
