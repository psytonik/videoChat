import {Router} from "express";
import protectedRoute from "../middleware/auth.middleware.js";
import {
    acceptFriendRequest,
    removeFriend,
    getFriendRequest,
    getMyFriends,
    getRecommendedUsers,
    outgoingFriendRequest,
    sendFriendRequest
} from "../controllers/users.controller.js";

const router = Router();

router.use(protectedRoute);
router.get("/", getRecommendedUsers)
router.get("/friends", getMyFriends)

router.post("/friend-request/:id", sendFriendRequest)
router.delete("/friend-request/:id", removeFriend)
router.put("/friend-request/:id/accept", acceptFriendRequest)

router.get("/friend-requests", getFriendRequest);
router.get("/outgoing-friend-requests", outgoingFriendRequest);

export default router;