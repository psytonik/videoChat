import {useState, useEffect} from 'react';
import {useNavigate, useParams} from "react-router";
import useAuthUser from "../hooks/useAuthUser.js";
import useGetStreamToken from "../hooks/useGetStreamToken.js";
import {
    StreamVideo,
    StreamVideoClient,
    StreamCall,
    CallControls,
    SpeakerLayout,
    StreamTheme,
    CallingState,
    useCallStateHooks
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {STREAM_API_KEY} from "../lib/utils.jsx";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader.jsx";

const CallPage = () => {
    const {id: callId} = useParams();
    const [client, setClient] = useState(null);
    const [call, setCall] = useState(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const {authUser, isLoading} = useAuthUser();
    const {tokenData} = useGetStreamToken(authUser);
    useEffect(() => {
        const initCall = async () => {
            if(!tokenData?.token || !authUser || !callId) return;
            try {
                console.log("initialization of Stream Video Client");
                const user = {
                    id: authUser._id,
                    name: authUser.fullName,
                    image: authUser.profilePic
                };
                const videoClient = new StreamVideoClient({
                    apiKey: STREAM_API_KEY,
                    user,
                    token: tokenData.token,
                });
                const callInstance = videoClient.call("default", callId);
                await callInstance.join({create: true})
                setClient(videoClient);
                setCall(callInstance);
            } catch (e) {
                console.error(e.message);
                toast.error(e.message);
            } finally {
                setIsConnecting(false);
            }
        }
        initCall();
    },[tokenData, authUser, callId]);

    if(isLoading || isConnecting) {
        return <PageLoader/>
    }
    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="relative">
                {client && call ? (
                    <StreamVideo client={client}>
                        <StreamCall call={call}>
                            <CallContent />
                        </StreamCall>
                    </StreamVideo>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p>Could not initialize call. Please refresh or try again later.</p>
                    </div>
                )}
            </div>
        </div>
    );

};
const CallContent = () => {
    const {useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const navigate = useNavigate();
    if (callingState === CallingState.LEFT) return navigate("/");
    return (
        <StreamTheme>
            <SpeakerLayout/>
            <CallControls />
        </StreamTheme>
    )
}
export default CallPage;