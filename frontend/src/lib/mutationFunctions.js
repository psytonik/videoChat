import {axiosInstance} from "./axios.js";

export const signUp = async (signUpData) => {
    const resp = await axiosInstance.post('/auth/sign-up', signUpData);
    return resp.data;
}
export const signIn = async (signInData) => {
    const resp = await axiosInstance.post('/auth/sign-in', signInData);
    return resp.data;
}

export const getAuthUser = async ()=> {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data;
    } catch (error) {
        // console.error(error);
        return null;
    }
}

export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post("/auth/onboarding", userData);
    return res.data;
}
export const signOut = async () => {
    const res = await axiosInstance.post("/auth/sign-out");
    return res.data;
}

export const getUserFriends = async () => {
    const res = await axiosInstance.get("/users/friends");
    return res.data;
}

export const getRecommendedUsers = async () => {
    const res = await axiosInstance.get("/users");
    return res.data;
}

export const getOutgoingFriendReqs = async () => {
    const res = await axiosInstance.get("/users/outgoing-friend-requests");
    return res.data;
}

export const sendFriendRequest = async (userId) => {
    const res = await axiosInstance.post(`/users/friend-request/${userId}` );
    return res.data;
}
export const getFriendRequests = async () => {
    const response = await axiosInstance.get("/users/friend-requests");
    return response.data;
}
export const acceptFriendRequest = async (userId) => {
    const resp = await axiosInstance.put(`/users/friend-request/${userId}/accept` );
    return resp.data;
}
export const getStreamToken = async () => {
    const res = await axiosInstance.get(`/chat/token/`);
    return res.data;
}