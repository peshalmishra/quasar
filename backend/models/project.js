import mongoose from "mongoose";
import { Schema } from "mongoose";

const projectSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'USER',
            required: true,
        },
        members: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'USER',
                },
                role: {
                    type: String,
                    enum: ['admin', 'member'],
                    default: 'member',
                },
            },
        ],
        status: {
            type: String,
            enum: ['active', 'completed', 'archived'],
            default: 'active',
        },
    },
    { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
