const path = require("path");
const express = require("express");

const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname + "/public")));

io.on("connection", () => {
  console.log("Some client connected");

  io.on("chat", (message) => {
    console.log("From client: ", message);
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Working");
});

// server listen as using socket.io (not app listen)
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
