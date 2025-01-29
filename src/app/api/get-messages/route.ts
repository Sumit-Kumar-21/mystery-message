import { getServerSession } from "next-auth";

import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/model/User";

export const GET = async () => {

    await dbConnect();

    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Authentication Failed"
                },
                { status: 401 }
            )
        }

        const userId = '67988b7e78fcc14bce3f13d9';

        const userObjId = new mongoose.Types.ObjectId(userId);

        const user = await UserModel.aggregate([
            { $match: { _id: userObjId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])
        return (!user || !user.length) ? Response.json(
            {
                success: false,
                message: "User not found"
            },
            { status: 404 }
        ) : Response.json(
            {
                success: true,
                message: "Successfully fetch",
                messages: user[0].messages
            },
            { status: 200 }
        )



    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: "Failed to getting messages"
            },
            { status: 500 }
        )
    }
}