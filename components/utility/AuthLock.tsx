import { useUser } from '@/hooks/UserHook';
import Link from 'next/link';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FaExclamation } from 'react-icons/fa';

export default function AuthLock({ children }: { children: React.ReactNode }) {
  const user = useUser();

  if (user?.user === null && !user?.error) {
    return (
      <div className='w-screen h-screen flex flex-col items-center justify-center'>
        <div className='animate-spin text-[10rem]'>
          <AiOutlineLoading3Quarters />
        </div>
        <p className='text-3xl opacity-25 font-semibold'>Loading...</p>
      </div>
    );
  }

  if ((user?.error?.length ?? 0) > 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <h1 className='text-[10rem] text-red-400 animate-wiggle'>
          <FaExclamation />
        </h1>
        <h1 className='text-[5rem] font-bold'>401</h1>
        <p className='text-2xl opacity-70'>
          You need to be{' '}
          <Link href='/login'>
            <span className='font-bold underline'>logged in</span>
          </Link>{' '}
          to see this page
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
