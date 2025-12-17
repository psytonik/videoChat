import React from 'react';
import useAuthUser from "../hooks/useAuthUser.js";
import {Link, useLocation} from "react-router";
import useSignOut from "../hooks/useSignOut.js";
import {BellIcon, LogOutIcon, ShipWheelIcon} from "lucide-react";
import ThemeSelector from "./ThemeSelector.jsx";

const NavBarComponent = () => {
    const { authUser } = useAuthUser();
    const location = useLocation();
    const isChatPage = location.pathname?.startsWith("/chat");
    const { signOutMutation } = useSignOut();

    return (
        <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center ">
            <div className="container mx-auto px-4 ms:px-6 lg:px-8">
                <div className="flex items-center justify-end w-full">
                    {/* LOGO only if chat page */}
                    {isChatPage && (
                        <div className="pl-5">
                            <Link to="/" className="flex items-center gap-2.5">
                                <ShipWheelIcon className="size-9 text-primary"/>
                                <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-linear-to-r from-primary to-secondary tracking-wider">Streamify</span>
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                        <Link to="/notifications" className="btn btn-ghost btn-circle" >
                            <BellIcon className="h-6 w-6 text-base-content opacity-70"/>
                        </Link>
                    </div>

                    <ThemeSelector/>
                    <div className="avatar">
                        <div className="w-9 rounded-full">
                            <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer"/>
                        </div>
                    </div>

                    <button className="btn btn-ghost btn-circle" onClick={signOutMutation}>
                        <LogOutIcon className="w-6 h-6 text-base-content opacity-70"/>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default NavBarComponent;