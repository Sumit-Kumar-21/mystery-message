import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas";


export const GET = async (req: Request ) => {
         
    await dbConnect();

    try {

        const  { searchParams } = new URL(req.url);

        const username = searchParams.get('username')
        const {data, error, success} = usernameValidation.safeParse(username);
        

        if(!success) {
            const usernameErrors = error.format()._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameErrors.length ? usernameErrors.join(', ') : 'Invalid query param'
                },
                { status: 400 }
            )
        }

        console.log({success, error}, 'this is result data error');
        

        const userExist = await UserModel.findOne({
            username: data,
            isVerified: true
        });

        return userExist ? Response.json(
            {
                success: false,
                message: 'Username already taken'
            },
            { status: 400 }
        ) :
        Response.json(
            {
                success: true,
                message: 'Username is unique'
            },
            { status : 200 }
        )
        
    } catch (error) {
        console.log("Error while getting users:", error)
        return Response.json(
            {
                success: false,
                message: "Getting error while verifying username"
            },
            { status: 500 }
        )
        
    }

}