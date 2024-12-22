// approach 2 : (for database connection)
// is on db folder in indexedDB.js

import dotenv from "dotenv";
import { app } from "./app.js";
import connectDB from "./db/index.js";
dotenv.config();

connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("Server is not listening");
        throw error
    })
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on PORT: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log("DATABASE ");
})



// approach 1 : (for database connection)

// import dotenv from "dotenv";
// import mongoose from "mongoose";
// import {DB_NAME} from "./constant.js"
// import express from "express"

// dotenv.config();

// const app= express();


// ( async()=>{
//     try{
//         const database=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         console.log("Connected database successfully : "+ database.connection.host);
//         app.on("error",(error)=>{
//             console.error("Error"+ error);
//             throw error
//         })

//         app.listen(process.env.PORT, ()=>{
//             console.log(`Server is running on Port : ${process.env.PORT}`);
//         })
//     }
//     catch(error){
//         console.error("ERROR: "+error)
//         throw error
//     }
// })()