Food Tracker AI 🥗

Replace "YOUR ID" with your actual id in Clarifai.js, Index.html, Script.js.

A smart nutrition tracking application that leverages artificial intelligence to simplify food logging. Users can upload an image of their meal, and the app will automatically identify the food and fetch its detailed nutritional information.

Features
📸 AI-Powered Image Recognition: Upload an image of any food, and the application will use the Clarifai API to identify it with a confidence score.
📊 Instant Nutritional Analysis: Once a food is identified, its nutritional data (calories, protein, fat, carbohydrates) is fetched from the Nutritionix API and displayed.
✍️ Manual Entry: A robust manual search bar allows users to look up any food item that can't be recognized by image.
💡 Quick Suggestions: Common food items like 'Pizza', 'Salad', and 'Chicken' are available as one-click buttons for faster searching.
🔒 Secure Backend Proxy: A Node.js and Express server acts as a proxy to securely handle API requests, resolving browser CORS issues and protecting API keys.

The Problem It Solves
Traditional calorie counting apps require tedious manual searching and data entry. This project demonstrates a more intuitive "snap and track" approach, making it faster and easier for users to log their meals and stay on top of their nutritional goals.

Tech Stack
Frontend: HTML5, CSS3, Vanilla JavaScript
Backend: Node.js, Express.js

APIs & Services:
Clarifai API: For AI-driven food image recognition.
Nutritionix API: For comprehensive nutritional data.
Development: VS Code with Live Server, Node.js

How to Run Locally
Clone the repository:
git clone https://github.com/your-username/food-tracker-ai.git
cd food-tracker-ai
Use code with caution.
Bash
Set up the Frontend:
You can run the index.html file using the Live Server extension in VS Code.
Set up the Backend:
Navigate to the backend directory:
cd backend
Use code with caution.
Bash
Install dependencies:
npm install
Use code with caution.
Bash
Start the backend server:
node server.js
Use code with caution.
Bash
The server will be running on http://localhost:3000.
Usage:
Open the frontend in your browser (usually at http://127.0.0.1:5500).
Choose an image file and click "Analyze" to see the magic!
