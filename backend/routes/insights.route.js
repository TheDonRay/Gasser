import express from 'express'; 
const insights = express.Router(); 

// call controller function here 
import {insightsControllerFunction} from '../controllers/insights.controller.js'; 

insights.post("/insights", insightsControllerFunction); 

export default insights; 