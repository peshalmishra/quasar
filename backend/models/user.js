import mongoose from "mongoose";
import {Schema} from 'mongoose';
import Task from "./task.js";

const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member',
    },
},{timestamps: true})

userSchema.pre("findOneAndDelete", async function(next){
    const userId = this.getQuery()._id;
    await Task.deleteMany({user:userId});
    next();
})

const USER = mongoose.model("USER",userSchema);
export default USER;