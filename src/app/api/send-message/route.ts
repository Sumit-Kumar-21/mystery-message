import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { IMessage } from "@/types";


export const POST = async (req: Request) => {

    await dbConnect();

    try {

        const { username, message } = await req.json();

        const receivingUser = await UserModel.findOne({
            username
        });

        if (!receivingUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                { status: 404 }
            )
        }
        else if (!receivingUser.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: 'User not accepting message'
                },
                { status: 403 }
            )
        };

        const newMessage = {
            content: message,
            createdAt: new Date()
        } as IMessage;

        receivingUser.messages.push(newMessage);
        await receivingUser.save();

        return Response.json(
            {
                success: true,
                message: 'Message sent successfully'
            },
            { status: 200 }
        )

    } catch (error) {
        console.log(error);
        return Response.json(
            {
                success: false,
                message: 'Failed to send message'
            },
            { status: 500 }
        )


    }
}