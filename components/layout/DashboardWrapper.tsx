import { ReactFragment, ReactNode, useState } from "react";
import NavBar from "./nav";
import { FaHamburger } from "react-icons/fa";
import SideBar from "./Sidebar";

export default function DashboardWrapper({ children }: { children: ReactNode }) {
    const [showSidebar, setShowSidebar] = useState(false);
    function handleSidebarToggle() {
        setShowSidebar(!showSidebar);
    }

    return (
        <div className="overflow-hidden">
            <NavBar />
            <div className="flex">
                {/* Mobile only sidebar */}
                <SideBar set={setShowSidebar} show={showSidebar} />

                <div className="bg-secondary w-full md:rounded-tl-2xl pt-10 md:pt-5 p-5 overflow-y-scroll overflow-x-hidden full-screen relative ">
                    <button className="flex md:hidden absolute top-3 rounded-lg bg-primary p-2" onClick={handleSidebarToggle}><FaHamburger /></button>
                    {children}
                </div>
            </div>
        </div>
    );
}

