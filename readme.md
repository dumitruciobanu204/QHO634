# IRIS - AI-Powered Plant Care Assistant

IRIS is an AI-powered plant care assistant that helps users identify plants, assess their health, and receive context-aware care advice based on environmental conditions such as weather and seasonal changes.

This project integrates OpenAI, Plant.id API, Firebase, and OpenWeatherMap to provide a smart plant management system, allowing users to chat about their plants and receive real-time adaptive guidance.

## Features

- AI Plant Identification: Upload an image, and the system identifies the plant and its health condition.
- AI Chat System: Chat with AI to get personalised plant care advice.
- Weather-Based Recommendations: Adjust care strategies based on current and forecasted weather.
- Plant Profiles: Save plants and track care history.
- Seasonal Awareness: Adapts plant care recommendations based on seasonal growth cycles.
- Geolocation Integration: Uses OpenWeatherMap API to refine plant care based on local weather.
- Firebase Database: Securely stores plant profiles and messages.

## Live Demo

[Access IRIS on Vercel](https://qho-634.vercel.app/)

## Tech Stack

- Frontend: HTML, CSS, JavaScript  
- Backend: Node.js, Express.js  
- Database: Firebase Firestore  
- AI & APIs:  
  - OpenAI GPT-3.5 for AI chat responses  
  - Plant.id API for plant identification  
  - OpenWeatherMap API for weather integration  

## Project Structure

```
IRIS/
│── backend/
│   ├── config/            # Configuration files (API keys, Firebase setup)
│   ├── controllers/       # API controllers for chat, plant profiles
│   ├── routes/            # Express.js route handlers
│   ├── services/          # Business logic and API integrations
│   ├── utils/             # Utility functions (error handling, Firebase, etc.)
│   ├── .env               # Environment variables (ignored in Git)
│── frontend/
│   ├── public/            # Static files (index.html, CSS, images)
│   ├── js/                # JavaScript files (chat, plant profiles, etc.)
│── README.md              # Project documentation
│── package.json           # Dependencies and scripts
│── vercel.json            # Vercel deployment config
```

## Installation & Setup

### Clone the Repository

```
git clone https://github.com/dumitruciobanu204/QHO634
cd backend
```

### Install Dependencies

```
npm install
```

### Set Up Environment Variables

Create a `.env` file in the backend directory and add:

```
OPENAI_API_KEY=your-openai-api-key
PLANTID_API_KEY=your-plant-id-api-key
FIREBASE_API_KEY=your-firebase-api-key
OPENWEATHERMAP_API_KEY=your-openweathermap-api-key
```

### Start the Server

```
npm run dev
```

The backend should now be running at `http://localhost:3000`.

## API Endpoints

### Chat with AI

- POST `/api/chat`

```
{
  "chatId": "12345",
  "message": "How should I care for my Monstera?"
}
```

Response: AI-generated plant care advice.

### Upload Plant Image

- POST `/api/identify`

```
{
  "chatId": "12345",
  "image": "base64-encoded-image"
}
```

Response: Identified plant name and health assessment.

### Get Plant Profiles

- GET `/api/plant-profiles`

Response: List of saved plant profiles.

### Save New Plant Profile

- POST `/api/plant-profiles`

```
{
  "plantName": "Fiddle Leaf Fig",
  "preferences": "Bright indirect light",
  "plantImage": "base64-encoded-image"
}
```

Response: Saved plant profile data.

## Deploying to Vercel

### Install Vercel CLI

```
npm install -g vercel
```

### Connect Project to Vercel

```
vercel
```

- When prompted, link to an existing Vercel project or create a new one.

### Set Environment Variables on Vercel

```
vercel env add OPENAI_API_KEY your-openai-api-key
vercel env add PLANTID_API_KEY your-plant-id-api-key
vercel env add FIREBASE_API_KEY your-firebase-api-key
vercel env add OPENWEATHERMAP_API_KEY your-openweathermap-api-key
```

### Deploy the App

```
vercel deploy
```

Your project is now live on Vercel.

## Troubleshooting

### Common Issues & Fixes

1. **Backend not starting?**
   - Ensure `.env` file is correctly set up.  
   - Check for missing dependencies (`npm install` again).

2. **Cannot connect to Firebase?**
   - Verify Firebase credentials in `config.js`.

3. **Rate Limit Errors from OpenAI?**
   - OpenAI has API limits; try again after a short wait.

## Future Enhancements

- Plant Growth Tracking: Log plant growth over time.
- Automated Care Scheduling: AI-generated watering/fertilizing schedules.
- Push Notifications: Receive reminders via email/SMS.

## Acknowledgments

- OpenAI for powering plant chat responses.
- Plant.id API for plant identification.
- Firebase Firestore for seamless database storage.
- OpenWeatherMap for weather-based plant care insights.