var mongoose = require('mongoose');
var db = require('../config').db;

mongoose.connect(db, function (err) {
  if (err) {
    process.exit(1);
  }
});
