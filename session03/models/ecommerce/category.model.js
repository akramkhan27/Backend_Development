import mongoose from "mongoose";

const categorySchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    }
},{timestamps: true})

const Category= mongoose.Model("Category", categorySchema);