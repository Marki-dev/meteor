import Input from '@/components/reusable/Input';
import NavBar from '@/components/layout/nav';
import { useState } from 'react';
import MeteorFetch from '@/util/web/MeteorFetch';
import { useRouter } from 'next/router';
import { useUser } from '@/hooks/UserHook';
import { type User } from '@prisma/client';

export default function Login() {
  const router = useRouter();
  const userContext = useUser();

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState({ username: '', password: '' });
  function changeCreds(cred: 'username' | 'password', value: string) {
    setCreds({ ...creds, [cred]: value });
  }

  function login() {
    if (loading) {
      return;
    }

    setLoading(true);
    void MeteorFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(creds),
    }).then(res => {
      setLoading(false);
      if (res.errors?.length) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        setError(res.errors[0]);
        console.error(res.error);
        return;
      }

      console.log(res);
      userContext?.setUser(res as User);
      console.log('setUser');
      void router.push('/app');
    });
  }

  return (
    <div className='relative'>
      <NavBar />
      <div className='meteor-login-bg' />
      <div className='full-screen flex justify-center items-center'>
        <div className='bg-secondary rounded-lg p-10 shadow-2xl w-[80%] md:w-auto'>
          <p className='text-6xl font-bold meteor-text'>Meteor</p>
          <p className='opacity-70 font-semibold'>Simple ShareX Uploader</p>
          <div className='flex flex-col gap-3 mt-5'>
            <div>
              <p>Username</p>
              <Input
                onChange={val => {
                  changeCreds('username', val);
                }}
                placeholder='Thykie'
              />
            </div>
            <div>
              <p>Password</p>
              <Input
                onChange={val => {
                  changeCreds('password', val);
                }}
                type='password'
                placeholder='GayFurry12345'
              />
            </div>
            <p className='text-red-500 text-sm'>{error}</p>
            <div
              onClick={login}
              className='meteor-login-button rounded-lg shadow-lg bg-[#6079C6] p-3 flex items-center justify-center hover:bg-opacity-80 cursor-pointer'
            >
              <p className='text-3xl font-black'>Login</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
