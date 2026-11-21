import express from 'express'; 
const app = express(); 


// import routes here 


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


export default app; 