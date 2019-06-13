var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId
const MONGODB_CONNECTION_STRING = process.env.DB

function create(req, res){
  let board = req.body.board ? req.body.board : req.params.board
  let { text, delete_password } = req.body
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    if(err){
      console.error(err)
      return
    }
    db.db().collection(board)
      .findOne({ text })
      .then(thread => {
        if(thread) // i.e thread already exists
          res.send('Thread already exists')
        else{
          let date = new Date().toISOString()
          let obj = {
            board,
            text,
            delete_password,
            created_on: date,
            bumped_on: date,
            reported: false,
            replies: [],
            replycount: 0
          }
          db.db().collection(board)
            .insertOne(obj)
            .then(newThread => {
              res.redirect(`/b/${board}/`)
            })
            .catch(err => res.status(400).json({err}))
        }
      })    
  })
}



function list(req, res){
  let board = req.body.board ? req.body.board : req.params.board
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    if(err){
      console.error(err)
      return
    }
    db.db().collection(board)
      .find({})
      .project({
        "delete_password": 0,
        "reported": 0,
        "replies.reported": 0,
        "replies.delete_password": 0
      })
      .sort({bumped_on: -1})
      .limit(10)
      .toArray()
      .then(arr => {
        arr.forEach(th => {
          if(th.replycount > 3)
            th.replies = th.replies.slice(-3)
        })
        res.json(arr)
      })
      .catch(err => res.status(400).json({err}))
  })
}



function del(req, res){
  let { delete_password, thread_id } = req.body
  let board = req.body.board ? req.body.board : req.params.board
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    if(err){
      console.error(err)
      return
    }
    db.db().collection(board)
      .findOneAndDelete({_id: ObjectId(thread_id), delete_password})
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
  let { report_id } = req.body
  let board = req.body.board ? req.body.board : req.params.board
  
  MongoClient.connect(MONGODB_CONNECTION_STRING, { useNewUrlParser: true }, function(err, db) {
    if(err){
      console.error(err)
      return
    }
    db.db().collection(board)
      .findOneAndUpdate(
        {_id: ObjectId(report_id)},
        {$set: {reported: true}},
        {returnNewDocument: true}
      )
      .then(newDoc => {
        if(newDoc.value.reported)
          res.send('Success')
      })
      .catch(err => res.status(400).json({err}))
  })
}


module.exports = {
  create,
  list,
  delete: del,
  report
}