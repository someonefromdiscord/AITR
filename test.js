const io = require('socket.io-client');
const tf = require('@tensorflow/tfjs-node');

// Connect to the existing Socket.IO server
const socket = io('https://box.km.mk/socket.io'); // Replace with your server URL
socket.emit("user joined", "AITrainer", "green")
// Simple in-memory dataset for training
let trainingData = [];
let labels = [];

// Listen for incoming messages
socket.on('data', (data) => {
    console.log('Received message:', data);
    processMessage(data); // Process the incoming message
});

// Function to process incoming messages and prepare them for training
function processMessage(message) {
    // Here we assume the message is an object with text and label properties
    if (message.text && message.label) {
        trainingData.push(message.text);
        labels.push(message.label);
        console.log('Added to training data:', message.text);

        // Optionally train the AI every N messages or on demand
        if (trainingData.length >= 10) { // Example: train after 10 messages
            trainAI();
        }
    }
}

// Function to train the AI model
async function trainAI() {
    console.log('Training AI with collected data...');

    // Convert texts to tensors (this is a placeholder; implement your own preprocessing)
    const xs = tf.tensor2d(trainingData.map(text => text.split('').map(char => char.charCodeAt(0))), [trainingData.length, trainingData[0].length]);
    const ys = tf.tensor2d(labels.map(label => label === 'positive' ? [1] : [0]), [labels.length, 1]); // Binary classification example

    // Define a simple model (this is just an example)
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 5, activation: 'relu', inputShape: [trainingData[0].length] }));
    model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));

    model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy', metrics: ['accuracy'] });

    // Train the model
    await model.fit(xs, ys, { epochs: 10 });

    console.log('Training complete.');

    // Clear training data after training (optional)
    trainingData = [];
    labels = [];
}

// Handle errors
socket.on('connect_error', (err) => {
    console.error('Connection error:', err);
});
if (data.msg == "exi1") {
    process.exit(1)
};
// Keep the process alive indefinitely
process.on('SIGINT', () => {
    console.log("Shutting down gracefully...");
    socket.disconnect();
    process.exit();
});

console.log("Listening for messages...");

// This will keep the script running indefinitely.
setInterval(() => {}, 1000); // Keeps the event loop active
