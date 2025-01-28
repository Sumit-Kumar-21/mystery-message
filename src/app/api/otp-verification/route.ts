import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { verifySchema } from "@/schemas";


export const GET = async (req: Request) => {

    await dbConnect();

    try {

        const { searchParams } = new URL(req.url);
        const { otp , username } = {
            otp: searchParams.get('otp'),
            username: searchParams.get('username')
        };

        const {data, success, error} = verifySchema.safeParse(otp);

        if (!success) {
            const errorMessage = error.format()._errors || []
            return Response.json(
                {
                    success: false,
                    message: errorMessage.length ? errorMessage.join(', ') : "Invalid OTP type"
                },
                { status: 400 }
            )
        };

        const user = await UserModel.findOne({
            username,
            verifyCode: data
        });

        if(!user) {
            return Response.json(
                {
                    success: false,
                    message: "Verification code is incorrect"
                },
                { status: 400 }
            )
        }

        if (user.verifyCodeExpiry < new Date()) {
            return Response.json(
                {
                    success: false,
                    message: "OTP expired pls register again to get new verification code"
                },
                { status: 400 }
            )
        }

        const updateUserIfVerified = await UserModel.findOneAndUpdate({
            username,
            verifyCode: data
        }, {
            isVerified: true
        });

        return updateUserIfVerified ? Response.json(
            {
                success: true,
                message: "Verification success"
            },
            { status: 200 }
        ) :
        Response.json(
            {
                success: false,
                message: "Verification failed"
            },
            { status: 400 }
        )

        
        
    } catch (error) {
        console.log('Error while verify otp: ', error);
        return Response.json(
            {
                success: false,
                message: "Error while verifying otp"
            },
            { status: 500 }
        )
    }
}