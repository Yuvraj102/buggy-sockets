const express = require("express");
const app = express();
const socket = require("socket.io");
const httpServer = require("http").createServer(app);
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded());
const io = socket(httpServer, { cors: { origin: "*" } });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});
app.get("/chat", (req, res) => {
  if (!req.query.name || !req.query.room) {
    res.redirect("/");
  } else {
    res.sendFile(__dirname + `/chat.html`);
  }
});
app.post("/login", (req, res) => {
  if (!req.body.username || !req.body.room_name) {
    res.redirect("/");
  } else {
    res.redirect(`/chat?name=${req.body.username}&room=${req.body.room_name}`);
  }
});
io.on("connection", (socket) => {
  console.log("got a new connection: ", socket.id);
  socket.on("new_user", (msg) => {
    console.log("new user connected message: ", msg);
    socket.join(msg.room);
  });
  socket.on("message", (msg) => {
    socket.to(msg.room).emit("message", msg.message);
    //socket.broadcast.to
    console.log("mess obj: ", msg);
    console.log("users from room: ", io.sockets.adapter.rooms.Map);
  });
});

httpServer.listen(5000, () => {
  console.log("server started on port 5000");
});

//ROOMS doc  https://socket.io/docs/v4/rooms/
// Getstarted https://socket.io/get-started/chat
