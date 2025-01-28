import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { hashPassword } from '@/lib/common';

export const POST = async (req: Request) => {

    await dbConnect();

    try {
        const { username, email, password } = await req.json();

        console.log(username, email, password);

        const allusers= await UserModel.find()
        console.log("🚀 ~ POST ~ allusers:", allusers)
        
        const userExistByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (userExistByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'username is already exist'
                },
                { status: 400 }
            );
        }

        const userExistByEmail = await UserModel.findOne({ email });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const hashedPass = await hashPassword(password)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        if (userExistByEmail) {
            if (userExistByEmail.isVerified) {
                return Response.json(
                    {
                        success: false,
                        message: 'Email is already exist'
                    },
                    { status: 400 }
                );
            }
            userExistByEmail.password = hashedPass;
            userExistByEmail.verifyCodeExpiry = expiryDate;
            userExistByEmail.verifyCode = verificationCode;

            await userExistByEmail.save();
        }
        else {
            const newUser = new UserModel({
                username,
                email,
                password: hashedPass,
                verifyCode: verificationCode,
                verifyCodeExpiry: expiryDate,
                messages: []
            });
            await newUser.save();
        }

        // send verification email
        // const { success, message } = await sendVerificationEmail({
        //     email,
        //     username,
        //     otp: verificationCode
        // })


        // if (!success) {
        //     return Response.json(
        //         {
        //             success: false,
        //             message: "message"
        //         },
        //         { status: 500 }
        //     )
        // }

        return Response.json(
            {
                success: true,
                message: "User Registered successfully. Please verify your email"
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error registering user:', error);
        return Response.json(
            {
                success: false,
                message: 'Failed to register user'
            },
            {
                status: 500
            }
        )

    }

}