var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')

chai.use(chaiHttp)

suite('Functional Tests', function() {

  let testId1, testId2
  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Create threads with POST', function(done) {
        chai.request(server)
        .post('/api/threads/fcc')
        .send({ text: 'Test 1', delete_password: 'pass' })
        .end((err, res) =>{
          assert.equal(res.status, 200)
        })
        chai.request(server)
        .post('/api/threads/fcc')
        .send({ text:'Test 2', delete_password: 'pass' })
        .end((err, res) => {
          assert.equal(res.status, 200)
          done()
        })
      })
    })
    
    suite('GET', function() {
      test('GET 10 latest threads on the board', function(done){
        chai.request(server)
        .get('/api/threads/fcc')
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.isArray(res.body)
          assert.isBelow(res.body.length, 11)
          assert.property(res.body[0], '_id')
          assert.property(res.body[0], 'created_on')
          assert.property(res.body[0], 'bumped_on')
          assert.property(res.body[0], 'text')
          assert.property(res.body[0], 'replies')
          assert.notProperty(res.body[0], 'reported')
          assert.notProperty(res.body[0], 'delete_password')
          assert.isArray(res.body[0].replies)
          assert.isBelow(res.body[0].replies.length, 4)
          testId1 = res.body[0]._id
          testId2 = res.body[1]._id
          done()
        })
      })
    })
    
    suite('DELETE', function() {
      test('DELETE thread with correct password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({ thread_id: testId1, delete_password:'pass' })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Success')
          done()
        })
      })
      
      test('DELETE thread with incorrect password', function(done) {
        chai.request(server)
        .delete('/api/threads/fcc')
        .send({ thread_id: testId2, delete_password: 'wrong' })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Incorrect password')
          done()
        })
      })
      
    })
    
    suite('PUT', function() {
        
      test('PUT report thread', function(done) {
        chai.request(server)
        .put('/api/threads/fcc')
        .send({ report_id: testId2 })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Success')
          done()
        })
      })
      
    })
    

  })
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      
      test('POST reply to thread', function(done) {
        chai.request(server)
        .post('/api/replies/fcc')
        .send({thread_id: testId2, text: 'A test reply', delete_password: 'pass'})
        .end(function(err, res){
          assert.equal(res.status, 200)
          done()
        })
      })
      
    })
    
    suite('GET', function() {

      test('GET a full thread', function(done) {
        chai.request(server)
        .get('/api/replies/fcc')
        .query({thread_id: testId2})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.property(res.body, '_id')
          assert.property(res.body, 'created_on')
          assert.property(res.body, 'bumped_on')
          assert.property(res.body, 'text')
          assert.property(res.body, 'replies')
          assert.notProperty(res.body, 'delete_password')
          assert.notProperty(res.body, 'reported')
          assert.isArray(res.body.replies)
          assert.notProperty(res.body.replies[0], 'delete_password')
          assert.notProperty(res.body.replies[0], 'reported')
          assert.equal(res.body.replies[res.body.replies.length-1].text, 'A test reply')
          testId1 = res.body.replies[res.body.replies.length-1]._id
          done()
        })
      })
      
    })
    
    suite('PUT', function() {
      
      test('report reply', function(done) {
        chai.request(server)
        .put('/api/replies/fcc')
        .send({thread_id: testId2 ,reply_id: testId1})
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Success')
          done()
        })
      })
      
    })
    
    suite('DELETE', function() {
      
      test('delete reply with bad password', function(done) {
        chai.request(server)
        .delete('/api/replies/fcc')
        .send({ thread_id: testId2, reply_id: testId1, delete_password: 'wrong' })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Incorrect password')
          done()
        })
      })
      
      test('delete reply with valid password', function(done) {
        chai.request(server)
        .delete('/api/replies/fcc')
        .send({ thread_id: testId2, reply_id: testId1, delete_password: 'pass' })
        .end(function(err, res){
          assert.equal(res.status, 200)
          assert.equal(res.text, 'Success')
          done()
        })
      })
      
    })
    
  })

})
