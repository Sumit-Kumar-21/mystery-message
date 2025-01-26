import { IMessage } from "./model";


export interface IApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<IMessage>
}