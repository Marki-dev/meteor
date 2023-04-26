import Input from "@/components/reusable/Input";
import { useState } from "react";

export default function Login() {

    const [creds, setCreds] = useState({ username: "", password: "" })
    function changeCreds(cred: "username" | "password", value: string) {
        setCreds({ ...creds, [cred]: value })
    }
    return (
        <div>
            <div className="meteor-login-bg" />
            <div className="w-screen h-screen flex justify-center items-center">
                <div className="bg-secondary rounded-lg p-10 shadow-2xl w-[80%] md:w-auto">
                    <p className="text-6xl font-bold meteor-text">Meteor</p>
                    <p className="opacity-70 font-semibold">Simple ShareX Uploader</p>
                    <div className="flex flex-col gap-3 mt-5">
                        <div>
                            <p>Username</p>
                            <Input onChange={(val) => changeCreds("username", val)} placeholder="Thykie" />
                        </div>
                        <div>
                            <p>Password</p>
                            <Input onChange={(val) => changeCreds("password", val)} placeholder="GayFurry12345" />
                        </div>
                        <div className="meteor-login-button rounded-lg shadow-lg bg-[#6079C6] p-3 flex items-center justify-center hover:bg-opacity-80 cursor-pointer">
                            <p className="text-3xl font-black">Login</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
