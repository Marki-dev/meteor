import { UserContext } from '@/context/userContext';
import { useContext } from 'react';

export const useUser = () => useContext(UserContext);
