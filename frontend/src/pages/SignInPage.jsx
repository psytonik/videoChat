import React, {useState} from 'react';
import useSignIn from "../hooks/useSignIn.js";
import {ShipWheelIcon} from "lucide-react";
import {Link} from "react-router";
import {useThemeStore} from "../store/useThemeStore.js";

const SignInPage = () => {
    const [signInData, setSignInData] = useState({
        email: "",
        password: "",
    });
    const {theme} = useThemeStore()
    const {error,isPending, signInMutation } = useSignIn();
    const handleSignIn = (e) => {
        e.preventDefault();
        signInMutation(signInData);
    }
    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme={theme}>
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/*Left side*/}
                <div className="w-full lg:w-1/2 p-4 sm:p-8 flex flex-col ">
                    <div className="mb-4 flex items-center justify-start gap-2">
                        <ShipWheelIcon className="size-9 text-primary"/>
                        <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">Streamify</span>
                    </div>
                    {/* Error Message */}
                    <div>
                        {error && (
                            <div className="alert alert-error mb-4">
                                <span>{error.response.data.message}</span>
                            </div>
                        )}
                    </div>
                    <div className="w-full">
                        <form onSubmit={handleSignIn}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Welcome Back</h2>
                                    <p className="text-sm opacity-70">Sign in to your account to continue your language journey</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <div className="w-full form-control space-y-2">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            value={signInData.email}
                                            onChange={(e)=>setSignInData({...signInData, email: e.target.value})}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <div className="form-control w-full space-y-2">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input type="password"
                                            name="password"
                                            placeholder="Password"
                                            value={signInData.password}
                                            onChange={(e)=>setSignInData({...signInData, password: e.target.value})}
                                            className="input input-bordered w-full"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn w-full btn-primary" disabled={isPending}>
                                        {isPending ? (
                                            <>
                                                <span className="loading loading-spinner loading-xs"></span>
                                                Signing in...
                                            </>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                    <div className="text-center mt-4">
                                        <p className="text-sm">
                                            Don't have an account?{" "}
                                            <Link to="/signup" className="text-primary hover:underline">
                                                Create one
                                            </Link>
                                        </p>
                                    </div>

                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Right Side */}
                <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
                    <div className="max-w-md p-8">
                        <div className="relative aspect-square max-w-sm mx-auto">
                            <img src='/mobile.png' alt="mobile picture" className="w-full h-full"/>
                        </div>

                        <div className="text-center space-y-3 mt-6">
                            <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
                            <p className="opacity-70">Practice conversations, make friends, and improve your language skills together</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;