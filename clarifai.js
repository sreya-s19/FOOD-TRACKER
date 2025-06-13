// ========== API CONFIGURATION ==========
// Clarifai API (for food image recognition)
const PAT = 'YOUR API'; // Clarifai Personal Access Token
const USER_ID = 'YOUR USER ID';
const APP_ID = 'YOUR ID';
const MODEL_ID = 'YOUR ID';
const MODEL_VERSION_ID = 'YOUR ID';

// Nutritionix API (for nutrition information)
const NUTRITIONIX_APP_ID = 'YOUR ID';
const NUTRITIONIX_API_KEY = 'YOUR ID';

// Firebase configuration is in script.js
// ========================================

// Upload image and analyze with Clarifai
function uploadImage() {
  const file = document.getElementById('imageInput').files[0];
  if (!file) return alert("Please upload an image.");

  // Show loading state
  document.getElementById("result").innerHTML = "🔄 Analyzing image...";
  document.getElementById('nutritionInfo').innerHTML = '';

  const reader = new FileReader();
  reader.onloadend = function () {
    const base64Image = reader.result.split(',')[1];

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID
      },
      inputs: [
        {
          data: {
            image: {
              base64: base64Image
            }
          }
        }
      ]
    });

    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
      },
      body: raw
    };

    fetch(`https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.outputs && result.outputs[0] && result.outputs[0].data && result.outputs[0].data.concepts) {
          const concepts = result.outputs[0].data.concepts;
          const topPrediction = concepts[0].name;
          const confidence = (concepts[0].value * 100).toFixed(2);

          document.getElementById("result").innerHTML =
            `🍽️ <strong>${topPrediction}</strong> detected with <strong>${confidence}%</strong> confidence.`;

          if (confidence < 70) {
            document.getElementById("result").innerHTML += `<p>Confidence is low, please enter the food manually below.</p>`;
            document.getElementById('nutritionInfo').innerHTML = '';
          } else {
            fetchNutrition(topPrediction);
          }
        } else {
          document.getElementById("result").innerText = "❌ No food items detected in the image.";
        }
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById("result").innerText = "❌ Something went wrong during image analysis.";
      });
  };

  reader.readAsDataURL(file);
}

// Fetch nutrition info from Nutritionix API
function fetchNutrition(foodName) {
  if (!foodName) return;

  // Show loading state
  document.getElementById('nutritionInfo').innerHTML = "🔄 Fetching nutrition information...";

  const url = `https://trackapi.nutritionix.com/v2/natural/nutrients`;

  const data = {
    query: foodName,
    timezone: "US/Eastern"
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': NUTRITIONIX_APP_ID,
      'x-app-key': NUTRITIONIX_API_KEY
    },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(data => {
      if (data.foods && data.foods.length > 0) {
        const food = data.foods[0];
        document.getElementById('nutritionInfo').innerHTML = `
          <h3>Nutrition Information for <em>${foodName}</em>:</h3>
          <ul style="list-style:none; padding-left:0; color: #FFD700; text-align:left;">
            <li>Calories: ${food.nf_calories} kcal</li>
            <li>Protein: ${food.nf_protein} g</li>
            <li>Fat: ${food.nf_total_fat} g</li>
            <li>Carbohydrates: ${food.nf_total_carbohydrate} g</li>
            <li>Serving Size: ${food.serving_qty} ${food.serving_unit}</li>
          </ul>
        `;
      } else {
        document.getElementById('nutritionInfo').innerText = "No nutrition data found.";
      }
    })
    .catch(err => {
      console.error('Nutritionix API error:', err);
      document.getElementById('nutritionInfo').innerText = "Error fetching nutrition info.";
    });
}

// Manual search triggered by button click
function manualSearch() {
  const input = document.getElementById('manualSearchInput').value.trim();
  if (input) {
    document.getElementById("result").innerHTML = `🔍 Searching for: <strong>${input}</strong>`;
    fetchNutrition(input);
  } else {
    alert('Please enter a food name to search.');
  }
}

// Expose functions to global scope so HTML onclick handlers can access them
window.uploadImage = uploadImage;
window.manualSearch = manualSearch;