import { StreamChat } from 'stream-chat';
import "dotenv/config";

const ApiKey = process.env.STREAMIFY_KEY;
const ApiSecret = process.env.STREAMIFY_SECRET;
if(!ApiKey || !ApiSecret){
    console.error("No API key or API secret provided");
}
const streamClient = new StreamChat(ApiKey, ApiSecret,{

});
export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error(error);
    }
}

export const generateStreamToken = async (userId) => {
    try {
        const uId = userId.toString();

        return  streamClient.createToken(uId)
    } catch (e) {
        console.error("generateStreamToken: ", e.message);
    }
}