import {useMutation, useQueryClient} from "@tanstack/react-query";
import {signIn} from "../lib/mutationFunctions.js";

const useSignIn = () => {
    const queryClient = useQueryClient();
    const {mutate,isPending, error} = useMutation({
        mutationFn: signIn,
        onSuccess: () => queryClient.invalidateQueries({queryKey:["authUser"]})
    })
    return {isPending, signInMutation: mutate, error};
}
export default useSignIn;