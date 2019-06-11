'use strict'

var expect = require('chai').expect
const threadHandler = require('../controllers/threadHandler')

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(threadHandler.create)
    .get(threadHandler.list)
  
  
  app.route('/api/replies/:board')

};
