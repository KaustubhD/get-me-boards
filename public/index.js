const boards = document.querySelectorAll('[name="board"]')
      

document.querySelector('#newThread').addEventListener('submit', function(){
  let board = boards[0].value
  this.setAttribute('action', "/api/threads/" + board)
})


document.querySelector('#newReply').addEventListener('submit', function(){
  var board = boards[3].value
  this.setAttribute('action', "/api/replies/" + board)
})


document.querySelector('#reportThread').addEventListener('submit', function(e){
  var url = "/api/threads/" + boards[1].value
  fetch(url, {
    method: "PUT",
    body: new URLSearchParams(new FormData(this))
  })
  .then(res => alert(res))
  e.preventDefault()
})


document.querySelector('#deleteThread').addEventListener('submit', function(e){
  var url = "/api/threads/" + boards[2].value
  fetch(url, {
    method: "DELETE",
    body: new URLSearchParams(new FormData(this))
  })
  .then(res => alert(res))
  e.preventDefault()
})


document.querySelector('#reportReply').addEventListener('submit', function(e){
  var url = "/api/replies/" + boards[4].value
  fetch(url, {
    method: "PUT",
    body: new URLSearchParams(new FormData(this))
  })
  .then(data => alert(data))
  e.preventDefault()
})


document.querySelector('#deleteReply').addEventListener('submit', function(e){
  var url = "/api/replies/" + boards[5].value
  fetch(url, {
    method: "DELETE",
    body: new URLSearchParams(new FormData(this))
  })
  .then(data => alert(data))
  e.preventDefault()
})
