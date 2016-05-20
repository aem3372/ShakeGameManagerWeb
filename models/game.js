var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function Game(game) {
  this.name = game.name;
  this.adminId = game.adminId;
  this.startTime = game.startTime;
  this.duration = game.duration;
}

module.exports = Game;
var gameObj = new Schema({
  name: {type: String, index: {unique: true}},
  adminId: String,
  startTime: Number,
  duration: Number
});

mongoose.model('games', gameObj);

// user operator
var games = mongoose.model('games');

Game.prototype.save = function(callback) {
  game = new games();
  game.name = this.name;
  game.adminId = this.adminId;
  game.startTime = this.startTime;
  game.duration = this.duration;

  game.save(function(err){
    if (err) {
      console.log('Game.save failed!');
    }
    return callback(err, game);
  });
};


Game.find = function(Q, callback){
  games.findOne(Q, function(err, docs){
    if (err) {
      console.log('Game.find failed!');
    }
    return callback(err, docs);
  });
};

Game.get = function(Q, callback) {
  games.find(Q).exec(function(err, doc) {
    if (err) {
      console.log('Game.get failed!');
    }
    return callback(err, doc);
  });
}