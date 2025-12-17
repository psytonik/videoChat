import React, {useEffect, useState} from 'react';
import {Chat, Channel, MessageList, MessageInput, Window, ChannelHeader, Thread} from 'stream-chat-react';
import {useParams} from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import {StreamChat} from "stream-chat";
import toast from "react-hot-toast";
import ChatLoader from "../components/ChatLoader.jsx";
import CallButton from "../components/CallButton.jsx";
import useGetStreamToken from "../hooks/useGetStreamToken.js";
import {STREAM_API_KEY} from "../lib/utils.jsx";

const ChatPage = () => {
    const {id:targetUserId} = useParams();
    const [chatClient, setChatClient] = useState(null);
    const [chatChannel, setChatChannel] = useState(null);
    const [loading, setLoading] = useState(true);
    const {authUser} = useAuthUser();
    const {tokenData} = useGetStreamToken(authUser);

    useEffect(() => {
        const initChat = async () => {
            if(!tokenData?.token || !authUser) return;
            try {
                const client = StreamChat.getInstance(STREAM_API_KEY);
                await client.connectUser({
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                }, tokenData.token);
                const channelId = [authUser._id,targetUserId].sort().join('-');
                const currentChannel = client.channel("messaging",channelId, {
                    members: [authUser._id, targetUserId]
                });
                await currentChannel.watch();
                setChatClient(client);
                setChatChannel(currentChannel);
            } catch (e) {
                console.log(e);
                toast.error(e.response.data.message);
            } finally {
                setLoading(false);
            }
        }
        initChat();
    },[tokenData, authUser, targetUserId]);

    const handleVideoCall = () => {
        if(chatChannel) {
            const callUrl = `${window.location.origin}/call/${chatChannel.id}`;
            chatChannel.sendMessage({
                text: `I've started video call. Join me here ${callUrl}`,
            });
            toast.success("video call link sent successfully.");
        }
    }

    if(loading || !chatClient || !chatChannel) {
        return (
            <ChatLoader/>
        )
    }
    return (
        <div className="h-[93vh]">
            <Chat client={chatClient} >
                <Channel channel={chatChannel} >
                    <div className="w-full relative ">
                        <CallButton handleVideoCall={handleVideoCall} />
                        <Window>
                            <ChannelHeader/>
                            <MessageList/>
                            <MessageInput focus={true}/>
                        </Window>
                    </div>
                    <Thread/>

                </Channel>
            </Chat>
        </div>
    );
};

export default ChatPage;