const socket = io.connect("http://127.0.0.1:3000");

$("#user-form").submit((event) => {
  event.preventDefault();

  const $nameInput = $("#name");
  const name = $nameInput.val();

  localStorage.setItem("name", name); // local not storage in case browser crashes and loses info

  socket.emit("register", { name });

  $nameInput.val(""); // clear input

  return false;
});

function buildMessages(messages) {
  const ul = $("<ul id='userMessages'>");

  for (const message of messages) {
    if (localStorage.getItem("name") === message.name) {
      message.name = "(You)";
    }

    ul.append($("<li>").text(`${message.name}: ${message.text}`));
  }

  $("#messages").html(ul);
}

socket.on("register", (data) => {
  buildMessages(data.messages);

  if (data.name && data.name !== localStorage.getItem("name")) {
    $("#userMessages").append(
      $("<li>").text(`[${data.name} has joined the game]`)
    );
  }

  $("#user").hide();
  $("#room").show();
});

socket.on("role", (role) => {
  $("#userMessages").append($("<li>").text(`[Your role is ${role}]`));
});

socket.on("messages", (messages) => {
  buildMessages(messages);
});

$("#message-form").submit((event) => {
  event.preventDefault();

  const messageInput = $("#message-input");
  const text = messageInput.val();
  const name = localStorage.getItem("name");

  socket.emit("message", { text, name });

  messageInput.val(""); // clear input

  return false;
});

$(document).ready(() => {
  $("#room").hide();

  if (localStorage.getItem("name")) {
    socket.emit("reconnect");
  }
});
