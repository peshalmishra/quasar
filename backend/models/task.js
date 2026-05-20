import mongoose from "mongoose";
import { Schema } from "mongoose";

const taskSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER',
            required: true,
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER',
            default: null,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        status: {
            type: String,
            enum: ['todo', 'inprogress', 'done'],
            default: 'todo',
        },
        attachments: [
            {
                filename: String,
                mimetype: String,
                data: String,      // base64 encoded
                size: Number,
                uploadedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
