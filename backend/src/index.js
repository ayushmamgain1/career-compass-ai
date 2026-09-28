import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);

import dotenv from 'dotenv';
import { server } from './utils/socket.js';
import connectDb from './config/db.js';

dotenv.config({path: './env'});

connectDb()
.then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    });
})
.catch((error) => {
    console.log(`MONGODB connection failed !!! ERROR: ${error}`);
});