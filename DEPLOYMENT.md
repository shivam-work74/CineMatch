# CineMatch Deployment Guide

This guide will help you deploy the CineMatch application to production.

## Prerequisites

1. Node.js (version 18 or higher)
2. MongoDB Atlas account
3. TMDB API key
4. Hosting platform (e.g., Render, Heroku, AWS, etc.)

## Deployment Steps

### 1. Build the Frontend

```bash
cd CineMatch-Frontend
npm run build
```

This will create a `dist` folder with the production build.

### 2. Set Environment Variables

#### Backend (.env)
Create a `.env` file in the `CineMatch-Backend` directory:

```
DATABASE_URL=your_mongodb_connection_string
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_strong_jwt_secret
FRONTEND_URL=your_frontend_url
PORT=3001
```

#### Frontend (.env.production)
Create a `.env.production` file in the `CineMatch-Frontend` directory:

```
VITE_BACKEND_URL=https://your-backend-url.com/api
```

### 3. Deploy the Backend

The backend can be deployed to any Node.js hosting platform. Make sure to:

1. Set the environment variables on your hosting platform
2. Ensure the PORT is set correctly (usually provided by the platform)
3. The backend will automatically serve the frontend files in production mode

### 4. Deploy to Popular Platforms

#### Render.com
1. Create a new Web Service
2. Connect your GitHub repository
3. Set the build command: `cd CineMatch-Backend && npm install && cd ../CineMatch-Frontend && npm install && npm run build`
4. Set the start command: `cd CineMatch-Backend && npm start`
5. Add environment variables in the Render dashboard

#### Heroku
1. Create a new app
2. Connect your GitHub repository
3. Add the following buildpacks:
   - `heroku/nodejs`
4. Add a postbuild script to package.json:
   ```json
   "scripts": {
     "postbuild": "cd ../CineMatch-Frontend && npm install && npm run build"
   }
   ```
5. Set environment variables in the Heroku dashboard

### 5. Domain Configuration

If you're using a custom domain:

1. Point your domain's DNS to your hosting platform
2. Update the `FRONTEND_URL` environment variable to match your domain
3. Ensure CORS settings in the backend allow your domain

## Environment Variables

### Backend
- `DATABASE_URL`: MongoDB connection string
- `TMDB_API_KEY`: The Movie Database API key
- `JWT_SECRET`: Secret key for JWT token signing
- `FRONTEND_URL`: URL of the frontend application (for CORS)
- `PORT`: Port to run the server on (default: 3001)

### Frontend
- `VITE_BACKEND_URL`: URL of the backend API (including /api path)

## Troubleshooting

1. **CORS Issues**: Ensure `FRONTEND_URL` is correctly set in the backend
2. **WebSocket Connection Issues**: Verify the backend URL is correctly configured in `socket.js`
3. **Missing Environment Variables**: Check that all required environment variables are set
4. **Database Connection Issues**: Verify the `DATABASE_URL` is correct and the database is accessible

## Support

For any issues with deployment, please check the console logs of your hosting platform and ensure all environment variables are correctly set.