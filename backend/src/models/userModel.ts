import mongoose, { Schema, Document } from 'mongoose';

export type UserDocument = mongoose.Document & {
    email: string;
    password: string;
};


const userSchema = new mongoose.Schema<UserDocument>(
    {
        email: { type: String, unique: true },
        password: String,

    },
    { timestamps: true },
);


export const UserModel = mongoose.model<UserDocument>("User", userSchema);