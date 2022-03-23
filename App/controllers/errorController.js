import dotenv from "dotenv";
dotenv.config();

import baseError from "../utils/baseError.js";

import httpStatusCodes from '../responses/httpStatusCodes.js';
import formatValidateErrors from '../utils/formatValidateErrors.js';

const developmentError = (error, res)=>{
      console.log("🔴🔴🔴 Development Environment Error 🔴🔴🔴")
      console.log("ERROR STACK 🦀🦀🐽", error.stack)
      console.log("ERROR MESSAGE 🦀🦀", error.message)
      console.log("ERROR 🦀🦀", error)
      console.log("ALL ERRORS 🦀🦀", error.errors)
      
    return res.status(error.statusCode).json({
        errorMsg: error.message,
        errorStack: error.stack,
        error: error,
        mode: "Development"
    });
}

const emailDuplicate = error =>{
  return new baseError(`Duplicate entry for email ${error.keyValue.email}`, httpStatusCodes.CONFLICT);
}



const validationError = error =>{

    let validateError = {};
  
    const formatedErrors = formatValidateErrors(error)

    validateError.message = formatedErrors;
    validateError.isOperational = true;
    validateError.statusCode = httpStatusCodes.BAD_REQUEST;

    return validateError;
}

const inputParseError = error =>{
  return new baseError(error.message, httpStatusCodes.UNPROCESSABLE);;
}


const productionError = (error, res)=>{
  if(error.isOperational === true)
    return res.status(error.statusCode).json(error.message);
  
  // Not defined (handled) error 
  else{
    console.log("Not defined Error")
    console.log("ERROR STACK 🦀🦀", error.stack)
    console.log("ERROR MESSAGE 🦀🦀", error.message)
    console.log("ERROR 🦀🦀", error)
    console.log("ALL ERRORS 🦀🦀", error.errors)
    return res.status(httpStatusCodes.SERVICE_ERROR).json({message: "Something went wrong"});
  }
  
}

const globalErrorHandling = (error, req, res, next) => {
  let newError = error;
  newError.statusCode = error.statusCode || httpStatusCodes.INTERNAL_SERVER;

  // Error for development environment
  if(process.env.APP_ENV === 'development') {
    error.statusCode = httpStatusCodes.DEV_ERROR;
    developmentError(error, res);
  }

 
  // Error for production environment
  else if(process.env.APP_ENV === 'production') {

      // Error code for duplicate entry
      if (error.code === 11000) {

        // Email conflict(duplicate) Error
        if(error.keyValue.email)
          newError = emailDuplicate(error); 
          
      }

      // Input validation error
      else if(error.name === 'ValidationError')
        newError = validationError(error);        
      
      // Api syntax error
      else if(error.expose)
        newError = inputParseError(error);

      else if(error.name === "CastError" && error.kind === "ObjectId")
        newError = objectIdError(error)  

      else if(error.name === "CastError" && error.valueType === "Promise")
        newError = promiseCast(error)  

      productionError(newError, res);
      
  }
 

}

export default globalErrorHandling;
