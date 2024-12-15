import mongoose from "mongoose";

const subTodoSchema= new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    isComplete:{
        type: Boolean,
        default: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

const SubTodo= mongoose.model("SubTodo",subTodoSchema)