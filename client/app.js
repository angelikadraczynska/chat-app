const socket = io();

const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName = '';

socket.on('message', ({ author, content }) => addMessage(author, content));

socket.on('join', user =>
addMessage('ChatBot', `<i><b>${user}</b> logged in</i>`)
);

socket.on('leave', user =>
addMessage('ChatBot', `<i><b>${user}</b> left the conversation</i>`)
);

function login() {
  if (userNameInput.value.length === 0) {
    window.alert('Enter your nickname');
  } else {
    userName = userNameInput.value;
    loginForm.classList.remove('show');
    messagesSection.classList.add('show');
    socket.emit('join', userName);
  }
}

function sendMessage() {
  if (messageContentInput.value.length === 0) {
    window.alert('Enter your message');
  } else {
    addMessage(userName, messageContentInput.value);
    socket.emit('message', { author: userName, content: messageContentInput.value })
    messageContentInput.value = '';
  }
}

function addMessage(author, content) {
  const message = document.createElement('li');
  message.classList.add('message', 'message--received');
  if (author === userName) message.classList.add('message--self');
  message.innerHTML = `
  <h3 class="message__author">${userName === author ? 'You' : author}</h3>
  <div class="message__content">
    ${content}
  </div>
`;
  messagesList.appendChild(message);
}

loginForm.addEventListener('submit', function(event) {
  event.preventDefault();
  login();
});

addMessageForm.addEventListener('submit', function(event) {
  event.preventDefault();
  sendMessage();
});
