import MeteorFetch from '@/util/web/MeteorFetch';
import { type User } from '@prisma/client';
import { useRouter } from 'next/router';
import {
	createContext,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
	useState,
	useEffect,
} from 'react';

// Extend User type to include the new fields

export type UserContextType = {
	user: User | undefined;
	setUser: Dispatch<SetStateAction<User | undefined>>;
	error: string;

	logout: () => void;
};
export const UserContext = createContext<UserContextType | undefined>(
	undefined
);

export function UserContextProvider({ children }: { children: ReactNode }) {
	const router = useRouter();

	const [user, setUser] = useState<User | undefined>(undefined);
	const [error, setError] = useState<string>('');

	useEffect(() => {
		setError('');
		void MeteorFetch('/me').then(res => {
			if (res.error) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				setError(res.error ?? '');
				console.error(res.error);
				return;
			}

			console.log(res);
			setUser(res as User);
		});
	}, []);

	async function logout() {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const res = await MeteorFetch('/auth/logout', { method: 'POST' });
		if (res.error) {
			console.error(res.error);
			return;
		}

		setUser(undefined);
		await router.push('/login');
		return true;
	}

	return (
		<UserContext.Provider value={{ user, setUser, error, logout }}>
			{children}
		</UserContext.Provider>
	);
}
