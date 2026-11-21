import express from 'express'; 
const app = express(); 


// import routes here
import insights from './routes/insights.route.js';


//set up express middleware here as such 
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