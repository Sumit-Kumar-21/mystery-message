import { Document } from "mongoose";

export interface IMessage extends Document {
    content: string;
    createdAt: Date;
};

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Array<IMessage>
};