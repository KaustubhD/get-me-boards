var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
const MONGODB_CONNECTION_STRING = process.env.DB


function post(req, res){
  let board = req.body.board ? req.body.board : req.params.board
  let { text, delete_password, thread_id } = req.body
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, {useNewUrlParser: true}, function(err, db){
    if(err){
      console.error(err)
      return
    }
    
    let date = new Date().toISOString()
    let obj = {
      _id: new ObjectId(),
      text,
      created_on: date,
      delete_password,
      reported: false
    }
    
    db.db().collection(board)
      .findOneAndUpdate(
        {_id: ObjectId(thread_id)},
        {$push: { replies: obj}, $set: { bumped_on: date}},
        {returnNewDocument: true}
      )
      .then(newDoc => res.redirect(`/b/${board}/${thread_id}`))
      .catch(err => res.status(400).json({err}))      
  
  })
}


function list(req, res){
  let board = req.params.board
  let thread_id = req.query.thread_id
  
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    if(err){
      console.error(err)
      return
    }
    db.db().collection(board)
      .findOne(
        {_id: ObjectId(thread_id)},
        {projection: {
          "delete_password": 0,
          "reported": 0,
          "replies.reported": 0,
          "replies.delete_password": 0
        }}
      )
      .then(arr => {
        res.json(arr)
      })
      .catch(err => res.status(400).json({err}))
  })
}



function del(req, res){
  let { thread_id, reply_id, delete_password } = req.body
  let board = req.params.board
  
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    if(err){
      console.error(err)
      return
    }
    db.db().collection(board)
      .findOneAndUpdate(
        {
          _id: ObjectId(thread_id),
          replies: { $elemMatch: { _id: new ObjectId(reply_id), delete_password: delete_password } }
        },
        {
          $set: { "replies.$.text": '[deleted]'}
        }
      )
      .then(doc => {
        if(doc.value)
          res.send('Success')
        else
          res.send('Incorrect password')
      })
      .catch(err => res.status(400).json({err}))
  })
}



function report(req, res){
  let { thread_id, reply_id } = req.body
  let board = req.params.board
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    if(err){
      console.error(err)
      return
    }
    db.db().collection(board)
      .findOneAndUpdate(
        {
          _id: ObjectId(thread_id),
          replies: { $elemMatch: { _id: ObjectId(reply_id)} }
        },
        {
          $set: { "replies.$.reported": 'true'}
        },
        {returnNewDocument: true}
      )
      .then(doc => {
        if(doc.value)
          res.send('Success')
      })
      .catch(err => res.status(400).json({err}))
  })
}

module.exports = {
  post,
  list,
  del,
  report
}