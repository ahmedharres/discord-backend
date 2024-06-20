
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const socketServer = require('./SocketServer')
const authRoutes = require('./routes/authRoutes');
const authFriendInvitationRoutes = require('./routes/authFriendInvitationRoutes')

const PORT = process.env.PORT || process.env.API_PORT;
const app = express();
app.use(express.json());
app.use(cors());


//register the routes
app.use('/api/auth', authRoutes);
app.use('/api/friend-invitation', authFriendInvitationRoutes);


const server = http.createServer(app);
socketServer.registerSocketServer(server);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`server is listening on port ${PORT}`);


        });
    })

    .catch(err => {
        console.log("Database Connection Failed. Server Is Not Started ");
        console.error(err);
    });
