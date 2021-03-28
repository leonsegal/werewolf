const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const port = 3000;
let users = [];
const roles = ["villager1", "villager2", "werewolf", "seer"];
const userRoles = {}; // name: role
let gameStarted = false;

// make public dir accessible from outside for web page
app.use(express.static(path.join(__dirname + "/public")));

server.listen(port, () =>
  console.log(`Welcome to therewolf, listening on port: ${port}`)
);

app.get("/", (req, res) => res.sendFile(`${__dirname}/public/index.html`));
app.get("/all", (req, res) => res.sendFile(`${__dirname}/public/all.html`));
app.get("/werewolves", (req, res) =>
  res.sendFile(`${__dirname}/public/werewolves.html`)
);

const therewolf = io.of("/therewolf");

therewolf.on("connection", (client) => {
  client.on("join", (data) => {
    if (data.room === "lobby" && !users.includes(data.name)) {
      users.push(data.name);
    }

    client.join(data.room);
    therewolf.in(data.room).emit("message", { users });

    if (!gameStarted && users.length === 4) {
      gameStarted = true;
      therewolf.emit("message", "Game started");

      // get random role from roles and remove that role
    }
  });

  client.on("leave", (data) => {
    if (data.room === "lobby" && users.includes(data.name)) {
      users = users.filter((user) => user.name !== data.name);
    }

    client.leave(data.room);
    therewolf.in(data.room).emit("message", { users });

    if (gameStarted && users.length > 3) {
      gameStarted = false;
      therewolf.emit("message", "Game aborted");

      // get role from user and add back to roles
    }
  });

  client.on("message", (data) =>
    therewolf.in(data.room).emit("message", data.message)
  );

  client.on("disconnect", (data) => {
    return therewolf.emit(
      "message",
      `${data.name || "Unknown"} left the game, their role was: ${
        data.role || "unknown"
      }`
    );

    // todo: remove user from users
  });
});
