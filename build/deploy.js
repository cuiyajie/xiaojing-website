var Rsync = require('rsync');
var config = require('../config/server');

var env = process.argv[2];
env = env || 'stage';
config = config[env];

var rsync = new Rsync()
  .shell('ssh')
  .flags('avz')
  .progress()
  .source('dist/')
  .destination(config.user + '@' + config.host + ':' + config.destination);

rsync.execute(function(error, code, cmd) {
  if (error) {
    console.log('rsync error: ', error);
  } else {
    console.log('deploy ' + env + ' successfully');
  }
});