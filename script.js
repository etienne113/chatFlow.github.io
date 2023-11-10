const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null; // Variable to store user's message
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", `${className}`);
    chatLi.innerHTML = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">psychology</span><p></p>`;
    chatLi.querySelector("p").textContent = message;
    return chatLi; // return chat <li> element
}

const createLoader = () => {
    const loader = document.createElement("div");
    loader.classList.add("loader");
    return loader;
};

let selectedOption;
function updateSelectedOption(){
    const options = document.getElementsByName('options');
    for (let i = 0; i < options.length; i++) {
        if (options[i].checked) {
            selectedOption = options[i].id;
            break;
        }
    }
}

const generateResponse = (chatElement) => {
    const API_URL = "http://127.0.0.1:5000/get-answer";
    const messageElement = chatElement.querySelector("p");

    // Display the loader while waiting for the response
    const loader = createLoader();
    chatbox.appendChild(loader);
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Define the properties and message for the API request
    const requestOptions = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: userMessage,
            department: selectedOption,
            mode: 'cors'
        })
    };

    // Send POST request to API, get response and set the response as paragraph text
    fetch(API_URL, requestOptions)
        .then(res => res.json())
        .then(r => {
            messageElement.textContent = r.answer.trim();
        })
        .catch(() => {
            messageElement.classList.add("error");
            messageElement.textContent = "Oops! Something went wrong. Please try again.";
        })
        .finally(() => {
            // Remove the loader after receiving the response
            chatbox.removeChild(loader);
            chatbox.scrollTo(0, chatbox.scrollHeight);
        });
};

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Clear the input textarea and set its height to default
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append the user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        // Display "Thinking..." message while waiting for the response
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        updateSelectedOption();
        generateResponse(incomingChatLi);
    }, 600);
};

chatInput.addEventListener("input", () => {
    // Adjust the height of the input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    // If Enter key is pressed without Shift key and the window
    // width is greater than 800px, handle the chat
    if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");

    // Additional animation logic for the toggler
    const rotateDeg = document.body.classList.contains("show-chatbot") ? 90 : 0;
    chatbotToggler.style.transform = `rotate(${rotateDeg}deg)`;
});