import mongoose, { Schema, Document } from 'mongoose';

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
    username: string;
};


const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        password: {
            type: String,
            unique: true,
            required: [true, "Password is required"],
             
        },
        username:{
            type: String,
            required: [true, "Username is required"],
            unique: true,
            index:true
        }

    },
    { timestamps: true },
);


export const UserModel = mongoose.model<UserDocument>("User", userSchema);