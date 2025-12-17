import React, {useState} from 'react';
import useAuthUser from "../hooks/useAuthUser.js";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {completeOnboarding} from "../lib/mutationFunctions.js";
import toast from "react-hot-toast";
import {CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon} from "lucide-react";
import {LANGUAGES} from "../constants/index.js";

const OnboardingPage = () => {
    const {authUser} = useAuthUser();
    const queryClient = useQueryClient();
    const [onboardedUser, setOnboardedUser] = useState({
        fullName:authUser?.fullName || "",
        bio:authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location:authUser?.location || "",
        profilePic:authUser?.profilePic || "",
    });
    const {mutate:onboardingMutation, isPending} = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            toast.success("Onboarding Complete !!!");
            queryClient.invalidateQueries({queryKey:["authUser"]});
        },
        onError: (err)=> {
            toast.error(err.response.data.message)
        }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        onboardingMutation(onboardedUser)
    }
    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

        setOnboardedUser({ ...onboardedUser, profilePic: randomAvatar });
        toast.success("Random profile picture generated!");
    }
    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* PROFILE PIC CONTAINER */}
                        <div className="flex flex-col items-center space-y-4 justify-center">
                            {/* IMAGE PREVIEW */}
                            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                                {onboardedUser.profilePic ? (
                                    <img src={onboardedUser.profilePic} alt="Profile Preview" className="size-12 text-base-content opacity-40"/>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <CameraIcon className="size-12 text-base-content opacity-40" />
                                    </div>
                                )
                                }
                            </div>
                            {/* Generate Random Avatar BTN */}
                            <div className="flex items-center gap-2">
                                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                                    <ShuffleIcon className="size-4 mr-2"></ShuffleIcon>
                                    Generate Random Avatar
                                </button>
                            </div>
                        </div>
                        {/* FULL NAME */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend label-text">Full Name</legend>
                            <input
                                type="text"
                                name="fullName"
                                value={onboardedUser.fullName}
                                onChange={(e) => setOnboardedUser({...onboardedUser, fullName: e.target.value})}
                                className="input input-bordered w-full"
                                placeholder="Full Name"
                            />
                        </fieldset>
                        {/* BIO */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend label-text">Your bio</legend>
                            <textarea
                                name="bio"
                                value={onboardedUser.bio}
                                onChange={(e) => setOnboardedUser({...onboardedUser, bio: e.target.value})}
                                className="textarea textarea-bordered h-24 w-full"
                                placeholder="Tell others about yourself and your language learning goals"
                            />
                        </fieldset>
                        {/* Languages */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Native Language */}
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend label-text">Native Language</legend>
                                <select
                                    name="nativeLanguage"
                                    value={onboardedUser.nativeLanguage}
                                    onChange={(e)=>setOnboardedUser({...onboardedUser, nativeLanguage: e.target.value})}
                                    className="select select-bordered w-full"
                                >
                                    <option value="">Select your native language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </fieldset>
                            {/* LEARNING LANGUAGE */}
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend label-text">Learning Language</legend>
                                <select name="learningLanguage"
                                    value={onboardedUser.learningLanguage}
                                    onChange={(e)=>setOnboardedUser({...onboardedUser, learningLanguage: e.target.value})}
                                        className="select select-bordered w-full"
                                >
                                    <option value="">Select language you're learning</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                            </fieldset>
                        </div>
                        {/* LOCATION */}
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend label-text">Location</legend>
                            <div className="relative">
                                <MapPinIcon className="absolute  top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                                <input
                                    type="text"
                                    name="location"
                                    value={onboardedUser.location}
                                    onChange={(e) => setOnboardedUser({...onboardedUser, location: e.target.value})}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="City, Country"
                                />
                            </div>
                        </fieldset>
                        {/* SUBMIT BUTTON */}

                        <button type="submit" className="btn btn-primary w-full" disabled={isPending}>
                            {!isPending ? (
                                <>
                                    <ShipWheelIcon className="size-5 mr-2" />
                                    Complete Onboarding
                                </>
                            ) : (
                                <>
                                    <LoaderIcon className="animate-spin size-5 mr-2" />
                                    Onboarding...
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default OnboardingPage;