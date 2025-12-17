import React from 'react';
import SidebarComponent from "./SidebarComponent.jsx";
import NavBarComponent from "./NavBarComponent.jsx";

const Layout = ({children, showSidebar= false}) => {
    return (
        <div className="min-h-screen">
            <div className="flex">
                {showSidebar && <SidebarComponent />}
                <div className="flex-1 flex flex-col">
                    <NavBarComponent/>
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Layout;