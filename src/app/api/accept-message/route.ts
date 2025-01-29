import dbConnect from "@/lib/dbConnect";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";

export const POST = async (req: Request) => {

    await dbConnect();

    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                { status: 401 }
            )
        }

        const user = session.user;
        const { acceptMessages } = await req.json();
        const userId = user._id;

        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: acceptMessages
        }, { new: true });

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update"
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status updated successfully",
                updatedUser
            },
            { status: 200 }
        )

    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: "Change failed"
            },
            { status: 500 }
        )

    }
}

export const GET = async () => {
    await dbConnect();

    try {

        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return Response.json(
                {
                    success: false,
                    message: "Not authenticated"
                },
                { status: 401 }
            )
        }

        const sessionUser = session.user;
        const userId = sessionUser._id;

        const user = await UserModel.findById(userId);

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "failed to find the user"
                },
                { status: 404 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance status",
                isAcceptingMessage: user.isAcceptingMessage
            },
            { status: 200 }
        )

    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: "Failed to getting message acceptance status"
            },
            { status: 500 }
        )

    }
}