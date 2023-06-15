import { UserContext } from "@/context/userContext";
import { useContext } from "react";

export const useUser = () => {
    return useContext(UserContext);
}