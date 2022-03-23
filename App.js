// Load Environmental Variable
import dotenv from "dotenv";
dotenv.config();

import express from "express";
const App = express();

// Middleware to accept data from Apis
App.use(express.json());
App.use(express.urlencoded({ extended: false }));

import appConfig from "./App/config/appConfig.js";

// Middleware
import globalErrorHandling from './app/controllers/errorController.js';

// Application routes
import userRoute from "./routes/user.js";

// Mouting routes
App.use(`${appConfig.PREFIX}/user`, userRoute);

App.get(`${appConfig.PREFIX}/home`, (req, res, next)=>{
  return res.send("from home page");
})

// Unhandled Route
App.get("*", (req, res)=>{
  return res.send("Route is not found in the application");
});

// Application global error handling middleware that handles all the errors
App.use(globalErrorHandling)

export default App;




