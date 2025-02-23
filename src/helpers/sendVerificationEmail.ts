import { resend } from "@/lib/resend";
import VerificationEmailTemp from "../../emails/verificationEmailTemp";
import { IApiResponse } from "@/types/apiResponse";

interface SendVerificationEmailProps {
    email: string;
    username: string;
    otp: string
}

export async function sendVerificationEmail({ email, username, otp }: SendVerificationEmailProps): Promise<IApiResponse> {

    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Mystery message | Verification code',
        react: VerificationEmailTemp({ username, otp }),
    });
    
    if (error) {
        console.error('Error sending verification email', error);
        return {
            success: false,
            message: 'Failed to send verification email'
        };
    }
    
    console.log("Message sent with id:", data?.id)
    return {
        success: true,
        message: 'Verification email sent successfully'
    }
}