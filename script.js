const container = document.createElement('div');
document.body.appendChild(container);

container.innerHTML = `
    <button class="chatbot-toggler">
        <span class="material-symbols-rounded">mode_comment</span>
        <span class="material-symbols-outlined">close</span>
    </button>
    <div class="chatbot">
        <header>
            <h2>Chat</h2>
            <span class="close-btn material-symbols-outlined">close</span>
        </header>
        <ul class="chatbox">
            <li class="chat incoming">
                <span class="material-symbols-outlined">psychology</span>
                <p>Hi there!<br>First of all, you need to log in before proceeding 👇🏾</p>
            </li>
            <br>
            <li class="chat login-form">
                <form id="login-form">
                    <label for="email">Email:</label>
                    <input type="email" id="email" required>
                    <label for="password">Password:</label>
                    <input type="password" id="password" required>
                    <br> <br>
                    <button type="submit">Login</button>
                </form>
            </li>
        </ul>
        <div class="chat-input" id="chat-input" style="display:none;">
            <label>
                <textarea placeholder="Feel free to ask" spellcheck="false" required></textarea>
            </label>
            <span id="send-btn" class="material-symbols-rounded">send</span>
        </div>
    </div>
`;

// Create and append link elements for stylesheets
const styleSheet1 = document.createElement('link');
styleSheet1.rel = 'stylesheet';
styleSheet1.href = '/static/css/styles.css';
document.head.appendChild(styleSheet1);

const styleSheet2 = document.createElement('link');
styleSheet2.rel = 'stylesheet';
styleSheet2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
document.head.appendChild(styleSheet2);

const styleSheet3 = document.createElement('link');
styleSheet3.rel = 'stylesheet';
styleSheet3.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0';
document.head.appendChild(styleSheet3);

const chatbotToggler = container.querySelector('.chatbot-toggler');
const closeBtn = container.querySelector('.close-btn');
const chatbox = container.querySelector('.chatbox');
const chatInput = container.querySelector('.chat-input textarea');
const sendChatBtn = container.querySelector('#send-btn');
const loginForm = container.querySelector('#login-form');
const chatInputArea = container.querySelector('#chat-input');

const inputInitHeight = chatInput.scrollHeight;
let userMessage = null


document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('loggedIn') === 'true') {
        loginForm.parentElement.style.display = 'none';
        chatInputArea.style.display = 'flex';

        const email = localStorage.getItem('userEmail');
        const greeting = createChatLi(`Welcome back, ${email}!`, 'incoming');
        chatbox.appendChild(greeting);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    } else {
        loginForm.parentElement.style.display = 'flex';
        chatInputArea.style.display = 'none';
    }
});

const createChatLi = (message, className) => {
    const chatLi = document.createElement('li');
    chatLi.classList.add('chat', `${className}`);
    chatLi.innerHTML = className === 'outgoing' ? '<p></p>' : '<span class="material-symbols-outlined">psychology</span><p></p>';
    chatLi.querySelector('p').textContent = message;
    return chatLi;
};

const createLoader = () => {
    const loader = document.createElement('div');
    loader.classList.add('loader');
    return loader;
};

// Function to get the access token from Flask
const getTokenFromFlask = (username, password) => {
    fetch('https://chatflow--dev-test.azurewebsites.net/api/get-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userEmail', username);

            loginForm.parentElement.style.display = 'none';
            chatInputArea.style.display = 'flex';

            const greeting = createChatLi(`You have successfully logged in`, 'incoming');
            chatbox.appendChild(greeting);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        } else {
            alert(data.error);
        }
    })
    .catch(error => {
        alert('Error fetching token.');
        localStorage.removeItem('loggedIn');
    });
};


loginForm.addEventListener('submit',  (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

     getTokenFromFlask(email, password);
});

function generateTabId(userId) {
    return `${userId}_${Math.random().toString(36).substring(2, 15)}`;
}
function notifyServerAboutNewTab(chatElement) {

    const userId = 'user-1';
    let chatId = window.name;

    if (!chatId) {
        chatId = generateTabId(userId);
        window.name = chatId;
    }
    const formData = new FormData();
    const API_URL = 'https://chatflow--dev-test.azurewebsites.net/answer'; // TODO : change the endpoint
    const messageElement = chatElement.querySelector('p');

    const loader = createLoader();
    chatbox.appendChild(loader);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    formData.append('user_message', userMessage);
    formData.append('mode', 'cors');
    formData.append('user_id', userId);
    formData.append('chatId', chatId);

    const accessToken = localStorage.getItem('accessToken');

    const requestOptions = {
        method: 'POST',
        headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        body: formData,
    };
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(r => {
            if(r.error){
                messageElement.classList.add('error');
                messageElement.textContent = r.error;
            }
            else if(r.success)
                messageElement.textContent = r.success.trim();
        })
        .catch(error => {
            messageElement.classList.add('error');
            messageElement.textContent = error;
        })
        .finally(() => {
            chatbox.removeChild(loader);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });

}
window.addEventListener('focus', notifyServerAboutNewTab);
const handleChat =  () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = '';
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(async () => {
        const incomingChatLi = createChatLi('Thinking...', 'incoming');
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);

        notifyServerAboutNewTab(incomingChatLi);
    }, 600);
};

chatInput.addEventListener('input', () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener('click', handleChat);
closeBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'));
chatbotToggler.addEventListener('click', () => {
    document.body.classList.toggle('show-chatbot');
    const rotateDeg = document.body.classList.contains('show-chatbot') ? 90 : 0;
    chatbotToggler.style.transform = `rotate(${rotateDeg}deg)`;
});
