import Input from '@/components/reusable/Input';
import NavBar from '@/components/layout/nav';
import { useEffect, useState } from 'react';
import MeteorFetch from '@/util/web/MeteorFetch';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/UserHook';
import { type User } from '@prisma/client';
import { FaArrowRight, FaCircleNotch, FaCross, FaTimes } from 'react-icons/fa';

export default function NoRedirect() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    if (!id || typeof id === 'object') return;
    void MeteorFetch(`/s/${id}`).then(r => {
      setLoading(false);
      if (!r.url) {
        setFailed(true);
        return;
      }

      void router.prefetch(r.url as string);

      setUrl(r.url as string);
    });
  }, [id]);

  useEffect(() => {
    if (!url) return;
    void router.push(url);
  }, [url]);

  return (
    <div className='relative'>
      <NavBar />
      <div className='flex items-center justify-center w-full h-[calc(100vh-5rem)]'>
        <div className='bg-secondary p-5 rounded-lg'>
          {failed ? (
            <div className='flex flex-col items-center justify-center'>
              <FaTimes className='text-6xl text-red-400' />
              <p className='font-bold'>Invalid Short URL</p>
            </div>
          ) : loading ? (
            <div className='flex flex-col items-center justify-center'>
              <FaCircleNotch className='text-6xl animate-spin' />
              <p className='font-bold'>Loading...</p>
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <FaArrowRight className='text-6xl animate-bounce text-green-400' />
              <p className='font-bold'>Redirecting...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
