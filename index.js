const express = require("express");

const app = express();
const server = require("http").createServer(app);
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.status(200).send("Working");
});

// server listen as using socket.io (not app listen)
server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
