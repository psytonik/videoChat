import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signOut} from "../lib/mutationFunctions.js";

const useSignOut = () => {
    const queryClient = useQueryClient();
    const {mutate} = useMutation({
        mutationFn: signOut,
        onSuccess: ()=> queryClient.invalidateQueries({queryKey:["authUser"]})
    })
    return { signOutMutation: mutate };
}
export default useSignOut;