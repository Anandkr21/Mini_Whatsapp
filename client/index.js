const socket = io("http://localhost:8080/", { transports: ["websocket"] });

const form = document.getElementById("chatbox");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

const append = (message, position) => {
    const messageElement = document.createElement("div");
    messageElement.innerText = message;
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, "right");
    socket.emit("send", message);
    messageInput.value = "";
})

const Username = prompt("ENTER YOUR NAME TO JOIN");

socket.emit("new-user-joined", Username);

const user = document.getElementById('UserName');
user.innerText = Username;

socket.on("user-joined", (name) => {
    append(`${name} : joined the chat`, "right");
});


socket.on('list', (userlist) => {
    append(`${userlist} : joined the chat`, "right");
    const alluser = document.getElementById('listofuser')
    alluser.innerHTML = userlist;
})


socket.on("receive", (data) => {
    append(`${data.name}: ${data.message}`, "left");
});

socket.on("leave", (name) => {
    append(`${name} : Left the chat`, "left");
});

socket.on("user-online", (count) => {
    const online = document.getElementById("count");
    online.innerHTML = count;
})