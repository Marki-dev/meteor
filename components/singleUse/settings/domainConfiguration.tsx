import JSONRender from '@/components/reusable/jsonrender';
import getConfig from '@/util/web/configGen';
import { useEffect, useRef, useState } from 'react';
import { FaCogs, FaPlay, FaTrash } from 'react-icons/fa';

type DomainType = {
  domain: string;
  status: 'notPointed' | 'verification' | 'ready' | 'active' | 'error';
  lastChecked: string;
  addedOn: string;
};
const cleanText = {
  notPointed: {
    text: 'Not Pointed',
    color: '#D62F4C',
  },
  verification: {
    text: 'Verification',
    color: '#F9C74F',
  },
  ready: {
    text: 'Ready',
    color: '#277DA1',
  },
  error: {
    text: 'Error',
    color: '#F94144',
  },
  active: {
    text: 'Active',
    color: '#90BE6D',
  },
};
export default function DomainConfiguration() {
  const templatingArray = Array.from({ length: 20 }, () => ({
    domain: 'test.com',
    status: 'notPointed',
    lastChecked: '2021-10-10',
    addedOn: '2021-10-10',
  })) as DomainType[];
  const [domains, setDomains] = useState<DomainType[]>([
    {
      domain: 'thykka.xyz',
      status: 'active',
      lastChecked: '2021-10-10',
      addedOn: '2021-10-10',
    },
    {
      domain: 'thykeis.gay',
      status: 'ready',
      lastChecked: '2021-10-10',
      addedOn: '2021-10-10',
    },
    ...templatingArray,
  ]);
  return (
    <div className='flex flex-col gap-3'>
      <div className='flex gap-3 flex-col md:flex-row'>
        <div className='bg-primary p-3 rounded-lg shadow-lg w-full md:w-1/2'>
          <p className='text-4xl font-bold'>Domain Configuration</p>
          <p className='text-xl font-bold opacity-50'>
            Manage all your domains and check the status of them
          </p>
        </div>
        <div className='bg-primary p-3 rounded-lg shadow-lg w-full md:w-1/2'>
          <p className='text-4xl font-bold'>Active Domain</p>
          <p className='text-xl font-bold opacity-75'>
            You are currently using{' '}
            <span className='font-bold text-orange-500'>thykka.xyz</span> as
            your domain.
          </p>
          <p className='text-sm opacity-40'>
            Click on any of the play buttons down below to change your domain
          </p>
        </div>
      </div>
      <div className='bg-primary p-3 rounded-lg shadow-lg w-full flex flex-col gap-3'>
        <div className='bg-secondary rounded-md bg-opacity-75 p-3 text-lg font-bold text-center overflow-scroll'>
          <div className='flex'>
            <div className='w-1/6 min-w-[10rem]'>
              <p>Domain</p>
            </div>
            <div className='w-1/5 min-w-[10rem]'>
              <p>Status</p>
            </div>
            <div className='w-1/5 min-w-[10rem]'>
              <p>Last Checked</p>
            </div>
            <div className='w-1/5 min-w-[10rem]'>
              <p>Added On</p>
            </div>
            <div className='w-1/5 min-w-[10rem]'>
              <p>Actions</p>
            </div>
          </div>
          {domains.map((domain, i) => (
            <div
              key={i}
              className='bg-secondary even:bg-primary first:rounded-t-md last:rounded-b-md bg-opacity-75 flex px-3 text-sm font-bold text-center h-10'
            >
              <div className='w-1/6 min-w-[10rem]'>
                <p>{domain.domain}</p>
              </div>
              <div className='w-1/5 min-w-[10rem]'>
                <p style={{ color: cleanText[domain.status].color }}>
                  {cleanText[domain.status].text}
                </p>
              </div>
              <div className='w-1/5 min-w-[10rem]'>
                <p>{domain.lastChecked}</p>
              </div>
              <div className='w-1/5 min-w-[10rem]'>
                <p>{domain.addedOn}</p>
              </div>
              <div className='w-1/5 min-w-[10rem] flex items-center justify-around'>
                <div className='flex'>
                  <div className='bg-green-500 bg-opacity-50 hover:bg-opacity-75 duration-150 p-1 rounded-l-md'>
                    <FaPlay />
                  </div>
                  <div className='bg-orange-500 bg-opacity-50 hover:bg-opacity-75 duration-150 p-1'>
                    <FaCogs />
                  </div>
                  <div className='bg-red-500 bg-opacity-50 hover:bg-opacity-75 duration-150 p-1 rounded-r-md'>
                    <FaTrash />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
