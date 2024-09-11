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
                            <p>Hi there!<br>First of all, you need to choose your orgunit 👇🏾</p>
                        </li>
                        <br>
                        <li class="chat incoming">
                            <span class="material-symbols-outlined">psychology</span>
                            <p><input type="radio" name="options" id="management">  Management <br><input type="radio" name="options" id="personal">  Personal <br><input type="radio" name="options" id=""> None </p>
                        </li>
                    </ul>
                    <div class="chat-input">
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
    styleSheet1.href = 'https://etienne113.github.io/chatFlow.github.io/styles.css';
    document.head.appendChild(styleSheet1);

    const styleSheet2 = document.createElement('link');
    styleSheet2.rel = 'stylesheet';
    styleSheet2.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
    document.head.appendChild(styleSheet2);

    const styleSheet3 = document.createElement('link');
    styleSheet3.rel = 'stylesheet';
    styleSheet3.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0';
    document.head.appendChild(styleSheet3);

    // Create and append meta element for viewport settings
    const viewportMeta = document.createElement('meta');
    viewportMeta.name = 'viewport';
    viewportMeta.content = 'width=device-width, initial-scale=1.0';
    document.head.appendChild(viewportMeta);


    const chatbotToggler = container.querySelector('.chatbot-toggler');
    const closeBtn = container.querySelector('.close-btn');
    const chatbox = container.querySelector('.chatbox');
    const chatInput = container.querySelector('.chat-input textarea');
    const sendChatBtn = container.querySelector('#send-btn');
    let userMessage = null;
    const inputInitHeight = chatInput.scrollHeight;

    const createChatLi = (message, className) => {
        // Create a chat <li> element with passed message and className
        const chatLi = document.createElement('li');
        chatLi.classList.add('chat', `${className}`);
        chatLi.innerHTML = className === 'outgoing' ? '<p></p>' : '<span class="material-symbols-outlined">psychology</span><p></p>';
        chatLi.querySelector('p').textContent = message;
        return chatLi; // return chat <li> element
    };

    const createLoader = () => {
        const loader = document.createElement('div');
        loader.classList.add('loader');
        return loader;
    };

    let selectedOption;

    function updateSelectedOption() {
        const options = document.getElementsByName('options');
        for (let i = 0; i < options.length; i++) {
            if (options[i].checked) {
                selectedOption = options[i].id;
                break;
            }
        }
    }

function generateTabId(userId) {
    return `${userId}_${Math.random().toString(36).substring(2, 15)}`;
}

async function notifyServerAboutNewTab(chatElement) {
    const userId = 'user-1';
    let chatId = window.name;

    if (!chatId) {
        chatId = generateTabId(userId);
        window.name = chatId;
    }

    const formData = new FormData();
    const API_URL = 'https://chatflow--dev.azurewebsites.net/answer';
    const messageElement = chatElement.querySelector('p');

    const loader = createLoader();
    chatbox.appendChild(loader);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    formData.append('user_message', userMessage);
    formData.append('orgunit', selectedOption);
    formData.append('mode', 'cors');
    formData.append('user_id', userId);
    formData.append('chatId', chatId);

    try {
        const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ikg5bmo1QU9Tc3dNcGhnMVNGeDdqYVYtbEI5dyIsImtpZCI6Ikg5bmo1QU9Tc3dNcGhnMVNGeDdqYVYtbEI5dyJ9.eyJhdWQiOiJhcGk6Ly8xNWZkNDViZS1jZDNjLTQxMTQtYTFhZC0xOWYwNzk1NjQ5ZjUiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83NGE0MGE0Zi1lNDkwLTRjZTItOTk2NS1lYjA4YWM5YzY4ZmUvIiwiaWF0IjoxNzI2MDcxMjYxLCJuYmYiOjE3MjYwNzEyNjEsImV4cCI6MTcyNjA3NjA0NCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhYQUFBQS81SnBOc1JPMVFONk13Sm4wSkMzYzFuM0hhWmNwUkNHc2oyYzZ2WUc2VkNoNnBjN21UNnI4dmEwRElmc3kwdGQiLCJhbXIiOlsicHdkIl0sImFwcGlkIjoiMTVmZDQ1YmUtY2QzYy00MTE0LWExYWQtMTlmMDc5NTY0OWY1IiwiYXBwaWRhY3IiOiIxIiwiZ2l2ZW5fbmFtZSI6IkV0aWVubmUiLCJpcGFkZHIiOiIxODUuNS44LjExOSIsIm5hbWUiOiJFdGllbm5lIEthbmlvbm1lbmkiLCJvaWQiOiI0M2M5Y2FkMC00OTNiLTRjOTctOWU3NC02NzM3ZGRkYjcxMTIiLCJyaCI6IjAuQVI4QVR3cWtkSkRrNGt5Wlplc0lySnhvX3I1Rl9SVTh6UlJCb2EwWjhIbFdTZlVmQUlrLiIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6ImpCSExPVDExQlhMX2djeVk1bVExclE3V2Rpb3dqSVhlODNjRXBQcjMzeUkiLCJ0aWQiOiI3NGE0MGE0Zi1lNDkwLTRjZTItOTk2NS1lYjA4YWM5YzY4ZmUiLCJ1bmlxdWVfbmFtZSI6ImV0aWVubmUua2FuaW9ubWVuaUBrcmFlbWVyLWV4cGVydHMuZGUiLCJ1cG4iOiJldGllbm5lLmthbmlvbm1lbmlAa3JhZW1lci1leHBlcnRzLmRlIiwidXRpIjoiWlZzbWVqeDZHME9ZVXVaMUpyQ1hBQSIsInZlciI6IjEuMCJ9.AipV9VU-0TgRjtMMK_7MVKUwvE0bdAgKH_cGXf5gMLD0VKLKX3h-BbdVgu09UtBr7NCV9ibuJF87eaoXnMw_kCQ6n2jzgd6hDdeBSevyU7E_C1lBOwPu5wgPcfPcjDhr68m2JkLyK7yhkh8_lJebMhs-MTwDTQRpQIOFiTEaXrUNTmYB6zYav3BUb3IsQeUj3Qco4uJOqHpO589j9ZIpkeeCwLlxCub5TqYpVxNe0ea8owo61rbZW5xh1TtMGWzW1KDaUZbWAgEJo4Cxo0boS0qsw_lUdshZqXswVp9wicgQWxiSfbwZfOaompPS5Ljj1pb01CQFbB92wer1-f6QnQ';
        const requestOptions = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        };

        const response = await fetch(API_URL, requestOptions);
        const result = await response.json();

        if (result.error) {
            messageElement.classList.add('error');
            messageElement.textContent = result.error;
        } else if (result.success) {
            messageElement.textContent = result.success.trim();
        }
    } catch (error) {
        messageElement.classList.add('error');
        messageElement.textContent = error.message;
    } finally {
        // Remove the loader after receiving the response
        chatbox.removeChild(loader);
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }
}

function handleReturnToOpenedTab() {
    const userId = 'your_user_id';
    const chatId = localStorage.getItem('chatId');
    const storedData = localStorage.getItem(chatId);
    if (storedData) {
        console.log('User returned to the first tab. Stored data:', JSON.parse(storedData));
    }
    fetch('/new-tab', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            userId,
            chatId,
        }),
    });
}


window.addEventListener('focus', notifyServerAboutNewTab);
//window.addEventListener('focus', handleReturnToOpenedTab);

const handleChat = () => {
        userMessage = chatInput.value.trim();
        if (!userMessage) return;

        // Clear the input textarea and set its height to default
        chatInput.value = '';
        chatInput.style.height = `${inputInitHeight}px`;

        // Append the user's message to the chatbox
        chatbox.appendChild(createChatLi(userMessage, 'outgoing'));
        chatbox.scrollTo(0, chatbox.scrollHeight);

        setTimeout(() => {
            // Display "Thinking..." message while waiting for the response
            const incomingChatLi = createChatLi('Thinking...', 'incoming');
            chatbox.appendChild(incomingChatLi);
            chatbox.scrollTo(0, chatbox.scrollHeight);
            updateSelectedOption();
            //generateResponse(incomingChatLi);
            notifyServerAboutNewTab(incomingChatLi);
        }, 600);
    };

    chatInput.addEventListener('input', () => {
        // Adjust the height of the input textarea based on its content
        chatInput.style.height = `${inputInitHeight}px`;
        chatInput.style.height = `${chatInput.scrollHeight}px`;
    });

    chatInput.addEventListener('keydown', (e) => {
        // If Enter key is pressed without Shift key and the window
        // width is greater than 800px, handle the chat
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth > 800) {
            e.preventDefault();
            handleChat();
        }
    });

    sendChatBtn.addEventListener('click', handleChat);
    closeBtn.addEventListener('click', () => document.body.classList.remove('show-chatbot'));
    chatbotToggler.addEventListener('click', () => {
        document.body.classList.toggle('show-chatbot');

        // Additional animation logic for the toggler
        const rotateDeg = document.body.classList.contains('show-chatbot') ? 90 : 0;
        chatbotToggler.style.transform = `rotate(${rotateDeg}deg)`;
    });
