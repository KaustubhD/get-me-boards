Anon Message Board
------
A service where you can create threads about a topic and submit replies to it

On the front-end,
- edit `public/client.js`, `public/style.css` and `views/index.html`
- drag in `assets`, like images or music, to add them to your project

On the back-end,
- your app starts at `server.js`
- add frameworks and packages in `package.json`
- safely store app secrets in `.env` (nobody can see this but you and people you invite)


Directions to use
-------------------

**API** | **GET** | **POST** | **PUT** | **DELETE**
-------- | --------- | ---------- | -------- | --------
**/api/threads/{ board }** | list recent threads | create thread | report thread | delete thread with password
**/api/replies/{ board }** | show all replies on thread | create reply on thread | report reply on thread | delete reply on thread



Objectives
-------------------
- [ ] Only allow your site to be loading in an iFrame on your own pages.
- [ ] Do not allow DNS prefetching.
- [ ] Only allow your site to send the referrer for your own pages.
- [ ] I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.(Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
- [ ] I can POST a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
- [ ] I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.
- [ ] I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
- [ ] I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')
- [ ] I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password. (Text response will be 'incorrect password' or 'success')
- [ ] I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')
- [ ] I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')
- [ ] Complete functional tests that wholely test routes and pass


Testing
-------------------
For testing, the ```NODE_ENV``` variable needs to be set to testin the **.env** file


Live Project
-------------------
[\ ゜o゜)ノ](https://get-me-boards.glitch.me)
