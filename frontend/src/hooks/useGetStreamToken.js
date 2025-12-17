import {getStreamToken} from "../lib/mutationFunctions.js";
import {useQuery} from "@tanstack/react-query";

const useGetStreamToken = (authUser) => {
    const {data:tokenData} = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!authUser
    })
    return {tokenData};
}
export default useGetStreamToken;