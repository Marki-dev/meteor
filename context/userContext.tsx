import MeteorFetch from "@/util/web/MeteorFetch";
import { User } from "@prisma/client";
import { useRouter } from "next/router";
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useState,
    useEffect
} from "react";

// Extend User type to include the new fields

export type UserContextType = {
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>
    error: string;

    logout: () => void;
};
export const UserContext = createContext<UserContextType | null>(null);

export function UserContextProvider({ children }: { children: ReactNode }) {
    const router = useRouter()

    const [user, setUser] = useState<User | null>(null)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        setError("")
        MeteorFetch("/me").then((res) => {
            if (res.error) {
                setError(res.error)
                return console.error(res.error)
            }
            setUser(res)
        })
    }, [])

    async function logout() {
        const res = await MeteorFetch("/auth/logout", { method: "POST" })
        if (res.error) return console.error(res.error)
        setUser(null)
        router.push("/login")
        return true
    }
    return (
        <UserContext.Provider value={{ user, setUser, error, logout }}>
            {children}
        </UserContext.Provider>
    );
}