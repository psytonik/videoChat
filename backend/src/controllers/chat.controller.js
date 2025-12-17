import {generateStreamToken} from "../config/stream.config.js";

export const getStreamToken = async (req, res) => {
    try {
        const token = await generateStreamToken(req.user.id);

        return res.status(200).json({token});
    } catch (e) {
        console.error("Error in getStreamTokenController", e.message);
        return res.status(500).json({error: e.message});
    }
}