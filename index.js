const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname + "/public")));

app.get("/", (req, res) => {
  res.status(200).send("Working");
});

// server listen as using socket.io (not app listen)
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
