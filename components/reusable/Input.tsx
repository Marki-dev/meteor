import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"


export type InputType = {
    placeholder?: string;
    type?: string;
    fail?: boolean;
    failReason?: string
    value?: string;
    disabled?: boolean;
    internalIcon?: React.ReactNode;
    onIconClick?: () => void;
    // eslint-disable-next-line no-unused-vars
    onChange?: (val: string) => void;
}
export default function Input({ placeholder, type, value, internalIcon, disabled, onIconClick, onChange }: InputType) {
    const [internalType, setType] = React.useState(type || "text");
    const [showPassword, setShowPassword] = React.useState(true)

    function togglePassword() {
        setShowPassword(!showPassword)
        setType(showPassword ? "text" : "password")

    }

    function change(e: any) {
        if (!onChange) return
        onChange(e.target.value)
    }
    function internalClick() {
        if (!onIconClick) return
        onIconClick()
    }
    return (
        <div className={`rounded-lg p-1 border border-opacity-30 border-white hover:border-green-500 duration-300 bg-primary flex items-center relative w-full`}>

            <input disabled={disabled} value={value} type={internalType} onChange={change} placeholder={placeholder} className="disabled:text-gray-400 disabled:cursor-not-allowed rounded-md px-3 py-1 w-full bg-primary focus:ring-0" />
            {type === "password" && (
                <div className="px-3 text-2xl" onClick={togglePassword}>
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </div>
            )}
            <div onClick={internalClick}>
                {internalIcon}
            </div>
        </div>
    )
}