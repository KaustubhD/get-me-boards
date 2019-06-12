'use strict'

var expect = require('chai').expect
const threadHandler = require('../controllers/threadHandler')
const replyHandler = require('../controllers/replyHandler')

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(threadHandler.create)
    .get(threadHandler.list)
    .delete(threadHandler.delete)
    .put(threadHandler.report)
  
  app.route('/api/replies/:board')
    .post(replyHandler.post)
    .get(replyHandler.list)
    .delete(replyHandler.del)
    .put(replyHandler.report)
};
