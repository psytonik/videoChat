import React, {useState} from 'react';
import {ShipWheelIcon} from "lucide-react";
import {Link} from "react-router";
import useSignUp from "../hooks/useSignUp.js";
import {useThemeStore} from "../store/useThemeStore.js";

const SignUpPage = () => {
    const [signUpData, setSignUpData] = useState({
        fullName:'',
        email:'',
        password:'',
    });
    const {theme} = useThemeStore()
    const {signUpMutation, isPending, error} = useSignUp();

    const handleSignUp = (e) => {
        e.preventDefault();
        signUpMutation(signUpData);
    }

    return (
        <div className="h-screen flex items-center justify-center p-4 sm:p-6 md:p-8" data-theme={theme}>
            <div className="border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden">
                {/* Left Side */}
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
                        <form onSubmit={handleSignUp}>
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold">Create an account</h2>
                                    <p className="text-sm opacity-70">Join Streamify and start your language learning adventure</p>
                                </div>
                                <div className="space-y-3">
                                    {/* Full Name */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Full Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="input input-border w-full"
                                            placeholder="John Doe" value={signUpData.fullName}
                                            onChange={(e) => setSignUpData({...signUpData, fullName:e.target.value})}
                                            required={true}
                                        />
                                    </div>
                                    {/* Email */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Email</span>
                                        </label>
                                        <input
                                            type="email"
                                            className="input input-border w-full"
                                            placeholder="johndoe@gmail.com"
                                            value={signUpData.email}
                                            onChange={(e) => setSignUpData({...signUpData, email:e.target.value})}
                                            required={true}
                                        />
                                    </div>
                                    {/* Password */}
                                    <div className="form-control w-full">
                                        <label className="label">
                                            <span className="label-text">Password</span>
                                        </label>
                                        <input
                                            type="password"
                                            className="input input-border w-full"
                                            placeholder="****"
                                            value={signUpData.password}
                                            onChange={(e) => setSignUpData({...signUpData, password:e.target.value})}
                                            required={true}
                                        />
                                        <p className="text-xs opacity-70 mt-1">
                                            Password must be at least 8 characters long
                                        </p>
                                    </div>

                                    <div className="form-control">
                                        <label className="label cursor-pointer justify-start gap-2">
                                            <input type="checkbox" className="checkbox checkbox-sm" required={true}/>
                                            <span className="text-xs leading-tight"> I agree to the {" "}
                                                <span className="text-primary hover:underline">terms of service</span> and {" "}
                                                <span className="text-primary hover:underline">privacy policy</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <button className="btn btn-primary w-full" type="submit">
                                    {isPending ? (
                                        <>
                                            <span className="loading loading-spinner loading-xs"></span>
                                            Loading...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>

                                <div className="text-center mt-4">
                                    <p className="text-xs">
                                        Already have an account?{" "}
                                    </p>
                                    <Link to="/signin" className="text-primary hover:underline">
                                        Sign In
                                    </Link>
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

export default SignUpPage;