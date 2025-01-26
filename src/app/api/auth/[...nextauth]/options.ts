import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { comparePassword } from "@/lib/common";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Email/Username" },
                password: { label: "Password", type: "password" }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials): Promise<any> {

                if (!credentials?.password && !credentials?.username) throw new Error('Please enter your credentials');;
                await dbConnect();
                try {

                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.username },
                            { username: credentials.username }
                        ]
                    });

                    if (!user) throw new Error('User not found');
                    if (!user.isVerified) throw new Error('Please verify your account first before login');

                    const isPasswordCorrect = await comparePassword(credentials.password, user.password)
                    if (!isPasswordCorrect) throw new Error('Password is incorrect');

                    return user;

                } catch (error) {
                    throw error
                }
            },
        })
    ],
    callbacks: {
        async session({ session, token }) {

            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }
            return session
        },
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }

            return token
        }
    },
    pages: {
        signIn: '/sign-in'
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,

}