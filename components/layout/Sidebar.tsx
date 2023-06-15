import Link from "next/link";
import { useRef, useEffect } from "react";
import { FaCogs, FaHome, FaUpload, FaUsersCog, FaWrench } from "react-icons/fa";
import { IconType } from "react-icons/lib";

export default function SideBar({ set, show }: { set: (val: boolean) => void, show: boolean }) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    let options = [
        {
            name: "Home",
            items: [
                {
                    name: "Home",
                    icon: FaHome,
                    link: "/app"
                },
                {
                    name: "Uploads",
                    icon: FaUpload,
                    link: "/app/uploads"
                },
                {
                    name: "Settings",
                    icon: FaCogs,
                    link: "/app/settings"
                },

            ]
        },
        {
            name: "Account",
            items: [
                {
                    name: "Account Settings",
                    icon: FaUsersCog,
                    link: "/app/accountSettings"
                },
            ]
        },

    ]
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                set(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [sidebarRef]);

    return (
        <>
            <div
                className={`fixed left-0 top-0 w-64 h-full bg-nav py-3 pr-3 z-50 transition-transform transform mt-[4rem] ${show ? "translate-x-0" : "-translate-x-full "
                    } lg:hidden`}
                ref={sidebarRef}
            >
                {options.map((option, i) => (
                    <SideBarGroup key={i} {...option} />
                ))}
            </div>
            <div className="hidden md:flex md:w-1/3 lg:w-1/6 bg-nav flex-col gap-10 mt-5">
                {options.map((option, i) => (
                    <SideBarGroup key={i} {...option} />
                ))}
            </div>
        </>
    )
}
type SideBarGroupProps = {
    name: string,
    items: SideBarElementProps[]
}
function SideBarGroup({ name, items }: SideBarGroupProps) {
    return (
        <div className="flex flex-col gap-1">
            <p className="text-sm opacity-50 underline pl-1">{name}</p>
            {items.map((item, i) => (
                <SideBarElement key={i} {...item} />
            ))}
        </div>
    )
}

type SideBarElementProps = {
    name: string,
    icon: IconType,
    link: string
}
function SideBarElement(options: SideBarElementProps) {
    return (
        <Link href={options.link}>
            <div className="w-full pr-2">
                <div className="bg-secondary bg-opacity-60 p-3 rounded-r-xl duration-300 shadow-lg transition-all w-[90%] hover:w-[100%] flex items-center justify-start gap-2">
                    <options.icon />
                    <p className="text-white text-lg font-bold">{options.name}</p>
                </div>
            </div>
        </Link>
    )
}