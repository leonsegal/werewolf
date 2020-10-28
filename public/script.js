const socket = io();

const chat = document.querySelector(".chat-form");
const Input = document.querySelector(".chat-input");

chat.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log("chat clicked");

  socket.emit("chat", Input.value);

  Input.value = "";
});
