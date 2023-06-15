import JSONRender from "@/components/reusable/jsonrender"
import MeteorFetch from "@/util/web/MeteorFetch"
import getConfig from "@/util/web/configGen"
import { useEffect, useRef, useState } from "react"
import { FaCogs, FaPlay, FaTrash } from "react-icons/fa"
import { format } from "date-fns"


type tokenType = {
    id: string,
    userId: number,
    ip_address: string,
    user_agent: string,
    created_at: string,
    last_seen: string,
}
export default function SessionManager() {
    const [tokens, setTokens] = useState<tokenType[]>([])

    useEffect(() => {
        MeteorFetch(`/me/tokens`).then((data) => {
            setTokens(data)
        })
    }, [])
    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-3 flex-col md:flex-row">
                <div className='bg-primary p-3 rounded-lg shadow-lg w-full md:w-1/2'>
                    <p className='text-4xl font-bold'>Open Sessions</p>
                    <p className='text-xl font-bold'><span className="opacity-50">Manage Sessions</span> <span className="text-red-400">Terminate any unknown sessions</span></p>
                </div>
                <div />
            </div>
            <div className='bg-primary p-3 rounded-lg shadow-lg w-full flex flex-col gap-3'>
                {tokens.map((token, index) => (
                    <TokenBlock key={index} {...token} />
                ))}
            </div>
        </div>
    )
}

function TokenBlock(token: tokenType) {
    const [open, setOpen] = useState(false)
    return (
        <div>
            <div className="bg-secondary rounded-md bg-opacity-75 p-3 text-lg font-bold text-center flex flex-wrap w-full">
                <div className="w-1/12">
                    {token.id}
                </div>
            </div>
        </div>
    )
}