// const express = require("express");
// var http = require("http");
// const cors = require("cors");
// const { Socket } = require("socket.io");
// const mysql = require("mysql");
// const bodyParser = require("body-parser");
// const twilio = require("twilio");



// const app = express();
// const port =process.env.PORT || 8080;
// var server = http.createServer(app);
// var io = require("socket.io")(server,{
//     cors:{
//         origin:"*"
//     }
// })

// app.use(express.json());
// app.use(cors());

// var clients={};

// io.on("connection",(socket)=>{
//     socket.on("login",(id)=>{
//         console.log("sender ID :"+id);
//         clients[id]=socket;
       
//     })
//     socket.on("msg",(msg)=>{
//         console.log(msg);
//         let destination=msg.destination;
//         if(clients[destination]){
//             clients[destination].emit("msg",msg); 
//         }
       
//     })
   
// })

// server.listen(port,"0.0.0.0",()=>{
//     console.log("server started");
// })



const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const socketController = require('./controllers/socketController');
const authController = require('./controllers/authController');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

app.use('/auth', authController); // Use the authentication controller

// Socket.io setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

socketController(io); // Pass the Socket.io instance to the controller

server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});