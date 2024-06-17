// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDGExdHfXns3id2QmNcVZEigePdmUWGWh8",
  authDomain: "archaung-8d0bc.firebaseapp.com",
  projectId: "archaung-8d0bc",
  storageBucket: "archaung-8d0bc.appspot.com",
  messagingSenderId: "134281590603",
  appId: "1:134281590603:web:2073b233a75b42a2afdace"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Send message function
async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    // Display user message
    displayMessage('You', userInput);

    try {
        // Call Gemini API
        const response = await fetch('https://api.gemini.com/v1/your-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer AIzaSyDyXXfA_B1oOVHSt5W96NxvaN2q-vLDpXs`
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();

        // Log the response for debugging
        console.log(data);

        // Extract bot's reply from the response
        const botMessage = data.reply;  // Adjust this line based on the actual API response structure

        // Check if botMessage is undefined
        if (botMessage === undefined) {
            throw new Error('Bot reply is undefined. Please check the API response structure.');
        }

        // Display bot message
        displayMessage('Bot', botMessage);

        // Save messages to Firestore
        await db.collection('messages').add({
            user: userInput,
            bot: botMessage,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Clear input
        document.getElementById('user-input').value = '';
    } catch (error) {
        console.error('Error fetching bot reply:', error);
        displayMessage('Bot', 'Error: Unable to get response from the server.');
    }
}

// Function to display message
function displayMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
