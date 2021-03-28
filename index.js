const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;

// make public dir accessible from outside for web page
app.use(express.static(path.join(__dirname + "/public")));

server.listen(port, () => console.log(`listening on port: ${port}`));

app.get("/", (req, res) => res.sendFile(`${__dirname}/public/index.html`));

io.on("connection", (socket) => {
  socket.on("message", (msg) => io.emit("message", msg));
  socket.on("disconnect", () => io.emit("message", "user disconnected"));
});
