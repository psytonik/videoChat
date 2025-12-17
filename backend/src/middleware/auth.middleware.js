import jwt from 'jsonwebtoken';
import User from "../models/User.model.js";
const protectedRoute = async (req,res,next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({
                errorCode: 401,
                message: 'Unauthorized - No token provided',
            })
        }
        const decoded = await jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({
                errorCode: 401,
                message: 'Unauthorized - Invalid Token',
            })
        }
        const user = await User
            .findOne({_id: decoded.userId})
            .select("-password");
        if(!user){
            return res.status(404).json({
                errorCode: 404,
                message: 'User not found',
            })
        }
        req.user = user;
        next()
    } catch(err){
        res.status(401).json({
            errorCode:401,
            message:"Unauthorized"
        })
    }
}
export default protectedRoute