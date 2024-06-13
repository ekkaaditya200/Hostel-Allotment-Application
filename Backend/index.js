const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.get('/',()=>{
    console.log("Hello Everyone !");
})

mongoose.connect("mongodb://localhost:27017/").then(()=>console.log("Successfully Connected !")).catch(()=>console.log("Error"))

app.listen(port, ()=>{
    console.log(`Listening to port no ${port}`);
})