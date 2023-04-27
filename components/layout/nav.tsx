import { ReactFragment } from "react";
import { FaMeteor } from "react-icons/fa";

export default function NavBar() {
    return (
        <div className="bg-nav min-h-[4rem] flex justify-between items-center px-3">
            <div className="flex items-center justify-center gap-3">
                <FaMeteor className="text-3xl"/>
                <p className="meteor-text text-4xl">Meteor</p>
            </div>
        </div>
    )
}