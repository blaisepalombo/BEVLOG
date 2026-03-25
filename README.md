# BevLog

BevLog is a full-stack web application that allows users to track, rate, and review energy drinks. Users can sign in with Google, log drinks they’ve tried, and view their personal history in a clean dashboard.

## Live Demo
https://project-2-80o0.onrender.com/

## Features
- Google OAuth authentication
- Create, read, update, and delete drink entries
- Store drink details like brand, name, size, caffeine, sugar, and rating
- Personal dashboard with user-specific data
- Notes and timestamps for each entry
- REST API with documented endpoints (Swagger)

## Tech Stack
- Node.js
- Express
- MongoDB (Mongoose)
- Google OAuth (Passport.js)
- Express Session + MongoDB Store
- Swagger (API documentation)
- Render (deployment)

## Project Structure
controllers/
models/
routes/
config/
swagger/
public/
server.js

## Getting Started

1. Clone the repo
git clone https://github.com/your-username/bevlog.git
cd bevlog

2. Install dependencies
npm install

3. Set up environment variables

Create a .env file in the root:

PORT=3000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BASE_URL=http://localhost:3000

4. Run the app
npm start

Visit:
http://localhost:3000

## API Documentation
Swagger docs are available at:
/api-docs

## Example Data Model
{
  "brand": "C4",
  "drinkName": "Jolly Rancher Green Apple",
  "sizeOz": 16,
  "caffeineMg": 200,
  "sugarG": 0,
  "rating": 7,
  "notes": "",
  "userId": "user_id_here",
  "userDisplayName": "User Name",
  "userEmail": "user@email.com",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}

## What I Learned
- Implementing OAuth authentication with Passport
- Structuring a REST API with proper routing and controllers
- Managing sessions and user-specific data
- Working with MongoDB for persistent storage
- Deploying a full-stack app to Render
- Debugging real-world issues with authentication and CORS

## Future Improvements
- Add filtering and sorting on dashboard
- Show stats like average rating and total caffeine intake
- Improve UI/UX with better visual feedback
- Add image uploads for drinks
- Expand to support more beverage types

## Author
Blaise Palombo  
Web Design & Development Student
