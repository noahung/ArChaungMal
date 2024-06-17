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
        // Correct API URL and endpoint
        const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY'; // Replace YOUR_API_KEY with your actual API key

        // Call Gemini API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer AIzaSyDyXXfA_B1oOVHSt5W96NxvaN2q-vLDpXs` // If an API key is required in the headers, otherwise remove this line
            },
            body: JSON.stringify({ contents: [{ parts: [{ text: userInput }] }] })
        });

        // Check if response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Log the response for debugging
        console.log('API Response:', data);

        // Extract bot's reply from the response
        const botMessage = data.contents[0].parts[0].text; // Adjust this line based on the actual API response structure

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
        displayMessage('Bot', `Error: ${error.message}`);
