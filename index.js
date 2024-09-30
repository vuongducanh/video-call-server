// var express = require("express");

// var app = (module.exports = express.createServer());

// var io = require("socket.io")(app);

// io.on("connection", function (socket) {
//   io.sockets.emit(
//     "user-joined",
//     socket.id,
//     io.engine.clientsCount,
//     Object.keys(io.sockets.clients().sockets)
//   );

//   socket.on("signal", (toId, message) => {
//     io.to(toId).emit("signal", socket.id, message);
//   });

//   socket.on("message", function (data) {
//     io.sockets.emit("broadcast-message", socket.id, data);
//   });

//   socket.on("disconnect", function () {
//     io.sockets.emit("user-left", socket.id);
//   });
// });

// app.listen(3000, function () {
//   console.log(
//     "Express server listening on port %d in %s mode",
//     app.address().port,
//     app.settings.env
//   );
// });

// app.get("/", (req, res) => {
//   res.send("Work ok");
// });

// api/socket.js
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  io.sockets.emit(
    "user-joined",
    socket.id,
    io.engine.clientsCount,
    Object.keys(io.sockets.sockets)
  );

  socket.on("signal", (toId, message) => {
    io.to(toId).emit("signal", socket.id, message);
  });

  socket.on("message", (data) => {
    io.sockets.emit("broadcast-message", socket.id, data);
  });

  socket.on("disconnect", () => {
    io.sockets.emit("user-left", socket.id);
  });
});

// Cung cấp endpoint cho Vercel
app.get("/", (req, res) => {
  res.send("Work ok");
});

// Xuất server cho Vercel
module.exports = (req, res) => {
  if (req.method === 'GET') {
    return app(req, res);
  }
  // Đối với WebSocket, bạn cần xử lý kết nối riêng
  return server(req, res);
};
