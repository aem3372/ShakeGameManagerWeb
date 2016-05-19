var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function User(user) {
  this.name = user.name;
  this.password = user.password;
}

module.exports = User;
var userObj = new Schema({
  name: {type: String, index: {unique: true}},
  password: String,
});

mongoose.model('users', userObj);

// user operator
var users = mongoose.model('users');

User.prototype.save = function(callback) {
  user = new users();
  user.name = this.name;
  user.password = this.password;

  user.save(function(err){
    if (err) {
      console.log('User.save failed!');
    }
    return callback(err, user);
  });
};


User.find = function(Q, callback){
  users.findOne(Q, function(err, docs){
    if (err) {
      console.log('User.find failed!');
    }
    return callback(err, docs);
  });
};