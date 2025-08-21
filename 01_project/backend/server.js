


// node init -y        -            inialization  node
// npm install express
// npm install nodemode -d     -    display changes without restart server 
// npm install mangoose      -    for database connection
// npm install dotenv       -    for environment variables
// npm install @upstash/redis @upstash/ratelimit - for rate limiting

// npm create vite@latest .   
// npm install
// npm run dev
// npm install react-router
// npm install react-hot-toast
// npm i -D daisyui@latest       -   for tailwand 




// const express = require('express'); // for use this syntax need to do CommonJS syntax in package.json

import express from 'express';
import noteRoutes from './routes/noteRoutes.js';
import connectDB from './config/db.js';
import rateLimiter from './midleware/rateLimiter.js';

const app = express();



app.use(express.json()); // for parsing application/json

app.use(rateLimiter);

app.use("/api/notes", noteRoutes);


connectDB().then(() => {
    app.listen(5001, () => {
        console.log(`Server is running on port 5001`);
    });
})