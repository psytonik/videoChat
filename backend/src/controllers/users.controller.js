import User from "../models/User.model.js";
import FriendRequest from "../models/FriendRequest.model.js";

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId =  req.user.id;
        const currentUser = req.user;
        if (!currentUser) {
            return res.status(404).json({errorCode: "404", message: "User not found"});
        }
        const recommendedUsers = await User.find({
            $and : [
                {_id: {$ne: currentUserId}},
                {_id: {$nin: currentUser.friends}},
                {isOnboarded: true},
            ],
        })
        res.status(200).json(recommendedUsers);
    } catch (e) {
        console.error("Error in getRecommendedUsers controller", e.message);
    }
}

export const getMyFriends = async (req, res) => {
    try {
        const {friends} = await User.findById(req.user.id)
            .select("friends")
            .populate("friends","fullName nativeLanguage learningLanguage profilePic");
        res.status(200).json(friends);
    } catch (e) {
        console.error("Error in getMyFriends controller", e.message);
    }
}

export const sendFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;
        if(myId === recipientId) {
            return res.status(400).json({
                errorCode: "400",
                message: "You can't send a friend request to yourself"
            });
        }
        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({
                errorCode: "404",
                message: "User not found"
            });
        }
        if(recipient.friends.includes(myId)) {
            return res.status(400).json({errorCode: "400", message: "User already in friends list"});
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                {sender: myId, recipient: recipientId},
                {sender: recipientId, recipient: myId},
            ]
        })
        if(existingRequest) {
            return res.status(400).json({errorCode: "400", message: "Friend request already sent to this user"});
        }
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });
        return res.status(201).json(friendRequest);
    } catch (e) {
        console.error("Error in sendFriendRequest controller", e.message);
        return res.status(500).json({errorCode: "500", message: e.message});
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({errorCode: "404", message: "User request not found"});
        }
        if(friendRequest.status === "accepted") {
            return res.status(400).json({
                errorCode: "400",
                message:"request already accepted"
            });
        }
        if (friendRequest.recipient.toString() !== myId) {
            return res.status(403).json({errorCode: "403", message: "You are not authorized to accept his request"});
        }
        friendRequest.status = "accepted";
        await friendRequest.save();
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addToSet: { friends: friendRequest.recipient }
        })
        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addToSet: { friends: friendRequest.sender }
        });

        return res.status(200).json({message:"accepted", requester:requestId});
    } catch (e) {
        console.error("Error in acceptFriendRequest controller", e.message);
        return res.status(500).json({errorCode: "500", message: e.message});
    }
}

export const getFriendRequest = async (req, res) => {
    try {
        const myId = req.user.id;
        const incomingRequests = await FriendRequest.find({
            recipient: myId,
            status: "pending"
        }).populate("sender", "fullName nativeLanguage learningLanguage profilePic");
        const acceptedRequests = await FriendRequest.find({
            recipient: myId,
            status: "accepted"
        }).populate("recipient", "fullName profilePic");
        return res.status(200).json({incomingRequests, acceptedRequests});
    } catch (e) {
        console.error("Error in getFriendRequest controller", e.message);
        return res.status(500).json({errorCode: "500", message: `Error in getFriendRequests controller: ${e.message}` });
    }
}

export const outgoingFriendRequest = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName nativeLanguage learningLanguage profilePic");
        return res.status(200).json(outgoingRequests);
    } catch (e) {
        console.error("Error in outgoingFriendRequest controller", e.message);
        return res.status(500).json({errorCode: "500", message: `Error in outgoingFriendRequest controller: ${e.message}` });
    }
}