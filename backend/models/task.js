import mongoose from "mongoose";
import { Schema } from "mongoose";
import USER from "./user.js"; 

const taskSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',  
        required: true, 
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
        default: {}

    }, 
    
},{timestamps: true});


const Task = mongoose.model("Task", taskSchema);

export default Task;
