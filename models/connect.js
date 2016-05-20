var mongoose = require('mongoose');
var db = require('../config').db;

mongoose.connect(db, function (err) {
  if (err) {
  	console.log('mongodb connect error.');
    process.exit(1);
  }
});
