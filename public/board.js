var currentBoard = window.location.pathname.endsWith('/') ? window.location.pathname.slice(3,-1) : window.location.pathname.slice(3)
var url = "/api/threads/" + currentBoard


document.querySelector('#boardTitle').textContent = 'Welcome to ' + window.location.pathname
fetch(url)
.then(res => res.json())
.then(data => {
    var boardThreads= []
    data.forEach(function(ele) {
      var thread = `
      <div class="thread">
        <div class="main">
        <p class="id">id: ${ele._id} (${ele.created_on})</p>
        <form id="reportThread">
          <input type="hidden" name="report_id" value="${ele._id}">
          <input type="submit" value="Report">
        </form>
        <form id="deleteThread">
          <input type="hidden" value="${ele._id}" name="thread_id" required>
          <input type="text" placeholder="password" name="delete_password" required>
          <input type="submit" value="Delete">
        </form>
        <h3>${ele.text}</h3>
      </div>
      <div class="replies">`

      var hiddenCount = ele.replycount - 3
      if(hiddenCount < 1) hiddenCount = 0
      thread += `<h5>${ele.replycount} replies total (${hiddenCount} hidden)- <a href="${window.location.pathname + ele._id}">See the full thread here</a>.</h5>`

      thread += ele.replies.reduce((acc, rep) => {
        `<div class="reply">
          <p class="id">id: ${rep._id} (${rep.created_on})</p>
          <form id="reportReply">
            <input type="hidden" name="thread_id" value="'+ele._id+'"><input type="hidden" name="reply_id" value="${rep._id}">
            <input type="submit" value="Report">
          </form>
          <form id="deleteReply">
            <input type="hidden" value="${ele._id}" name="thread_id" required>
            <input type="hidden" value="'+rep._id+'" name="reply_id" required=""><input type="text" placeholder="password" name="delete_password" required>
            <input type="submit" value="Delete">
          </form>
          <p>${rep.text}</p>
        </div>`
      }, '')

      thread += `
        <div class="newReply">
        <form action="/api/replies/${currentBoard}/" method="post" id="newReply">
          <input type="hidden" name="thread_id" value="${ele._id}">
          <textarea rows="5" cols="80" type="text" placeholder="Quick reply..." name="text" required></textarea>
          <input type="text" placeholder="password to delete" name="delete_password" required>
          <input style="margin-left: 5px" type="submit" value="Submit">
        </form>
        </div></div></div>
      `
      
      boardThreads.push(thread)
    })
    document.querySelector('#boardDisplay').innerHTML = boardThreads.join('')
})


document.getElementById('newThread').addEventListener('submit', function(){
  this.setAttribute('action', "/api/threads/" + currentBoard)
})

document.querySelector('#boardDisplay').addEventListener('submit', function(e){
  let method, url
  
  if(e.target.id == 'reportThread'){
    url = "/api/threads/" + currentBoard
    method = 'PUT'
  }
  else if(e.target.id == 'reportReply'){
    url = "/api/replies/" + currentBoard
    method = 'PUT'
  }
  else if(e.target.id == 'deleteThread'){
    url = "/api/threads/" + currentBoard
    method = 'DELETE'
  }
  else if(e.target.id == 'deleteReply'){
    url = "/api/replies/" + currentBoard
    method = 'DELETE'
  }
  
  if(url && method){ // Only do this for above conditions, let rest of them proceed 
    fetch(url, {
      method,
      body: new URLSearchParams(new FormData(e.target))
    })
    .then(data => alert(data))
    e.preventDefault()
  }
})