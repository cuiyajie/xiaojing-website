// https://github.com/shelljs/shelljs
require('./check-versions')()
require('shelljs/global')
env.NODE_ENV = 'production'

var path = require('path')
var inquirer = require('inquirer');
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)


var questions = [{
  type: 'input',
  name: 'host',
  message: 'Please input the api server host: ',
  validate: function(value) {
    return /^http(s)?:\/\//.test(value) || 'Please input the valid api server host (with protocal and port)';
  }
// }, {
//   type: 'input',
//   name: 'websocket',
//   message: 'Please input the websocket server host: ',
//   validate: function(value) {
//     if (!value) {
//       return true;
//     }
//     return /^ws(s)?:\/\//.test(value) || 'Please input the valid websocket server host (with protocal and port) or empty'
//   }
}, {
  type: 'confirm',
  name: 'login',
  message: 'Scan code to login or not?'
}];

var nologinQuestions = [{
  type: 'input',
  name: 'companyId',
  message: 'Please input specified company id: ',
  validate: function(value) {
    return /^[1-9][0-9]*$/.test(value) || 'Please input valid specified company id';
  }
}, {
  type: 'input',
  name: 'token',
  message: 'Please input login token: ',
  validate: function(value) {
    return !!value || 'Please input login token';
  }
}]

var runWebpack = function(buildArgs) {
  var spinner = ora('building for production...')
  spinner.start()
  webpack(webpackConfig(buildArgs), function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
}

inquirer.prompt(questions).then(function (answers) {
  console.log(answers);
  if (answers.login) {
    runWebpack(answers);
  } else {
    inquirer.prompt(nologinQuestions).then(function(nAnswers) {
      runWebpack(Object.assign({}, answers, nAnswers));
    })
  }
});
