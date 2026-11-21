import express from 'express'; 
import cors from 'cors'; 
const app = express(); 


// import routes here
import insights from './routes/insights.route.js';


//set up express middleware here as such 
// Let the hosted frontend call this API from another domain.
// Set CORS_ORIGIN on Railway to your frontend URL(s), comma-separated, to lock it down.
app.use(cors({ 
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim()) : '*', 
})); 
app.use(express.json()); 

//health check 
app.get('/', (req, res) => { 
    res.status(200).json({ 
        health: "ok", 
        statusCode: 200
    }); 
}); 

// Mount routes here
// POST /api/insights (the frontend's Vite proxy forwards /api/* here)
app.use('/api', insights);


export default app; 