const config = require('config');

module.exports = function () {
  if(!config.get('myPrivateKey')) {
    throw new Error('FATAL ERROR: myPrivateKey is not defined.');
  }
}