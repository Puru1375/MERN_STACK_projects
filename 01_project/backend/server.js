


// node init -y        -            inialization  node
// npm install express
// npm install nodemode -d     -    display changes without restart server 
// npm install mangoose      -    for database connection




// const express = require('express'); // for use this syntax need to do CommonJS syntax in package.json

import express from 'express';
import noteRoutes from './routes/noteRoutes.js';
import connectDB from './config/db.js';

const app = express();

connectDB(); 

app.use(express.json()); // for parsing application/json

app.use("/api/notes", noteRoutes);


app.listen(5001, () => {
  console.log('Server is running on port 5000');
});