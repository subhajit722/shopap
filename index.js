

import express from 'express';
import cors from 'cors';

import item from './Router/ItemRoute.js'
import User from './Router/UserRouter.js'
import Card from './Router/CardRoute.js'
import Address from './Router/AddressRoute.js'


const app = express();

// Enable CORS for all routes
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001" , "'http://192.168.70.67:3000'" , 'http://192.168.1.12:3000'], 
    credentials: true // Enable CORS credentials
}));

app.use(express.json({ limit: '50mb' }));

// app.use('/api/product', Products);
// app.use('/api/table', table);
app.use('/api/item', item);
app.use('/api/user', User);
app.use('/api/card', Card);
app.use('/api/address', Address)



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
