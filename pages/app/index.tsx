import { useEffect, useRef, useState } from 'react';
import DashboardWrapper from '@/components/layout/DashboardWrapper';
import {
  FaCamera,
  FaDotCircle,
  FaFileAlt,
  FaStickyNote,
  FaUpload,
} from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import AuthLock from '@/components/utility/AuthLock';
import MeteorFetch from '@/util/web/MeteorFetch';
import Link from 'next/link';
import { getDurationSince } from '@/util/universal/getDurationSince';
import { type Upload } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';

export default function MainAPPPage() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [stats, setStats] = useState();
  useEffect(() => {
    void MeteorFetch('/me/uploads').then(r => {
      setUploads(r.uploads as any[]);
    });
  }, []);
  return (
    <AuthLock>
      <DashboardWrapper>
        {/* Stats Display */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
          {[
            { name: 'Total Uploads', value: 0, icon: FaUpload },
            { name: 'Images', value: 0, icon: FaCamera },
            { name: 'Text Snippets', value: 0, icon: FaStickyNote },
            { name: 'Other Files', value: 0, icon: FaFileAlt },
          ].map((stat, i) => (
            <div
              key={i}
              className='flex bg-primary p-3 rounded-lg md:justify-between'
            >
              <div className='flex items-center justify-center w-1/2'>
                <div className='bg-secondary p-5 rounded-full'>
                  <stat.icon className='text-4xl' />
                </div>
              </div>
              <div className='flex flex-col items-center justify-center w-1/2'>
                <div className='text-center'>
                  <p className='underline text-xl font-bold'>{stat.name}</p>
                  <p className='text-6xl font-black'>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 transition-all gap-3 my-3'>
          {uploads.slice(0, 15).map((upload, i) => (
            <UploadCard key={i} upload={upload} />
          ))}
        </div>
      </DashboardWrapper>
    </AuthLock>
  );
}

type UploadCardProps = {
  upload: Upload;
};

function UploadCard({ upload }: UploadCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  function openDropdown(e: React.MouseEvent) {
    e.preventDefault();
    setDropdownOpen(true);
  }

  function closeDropdown() {
    setDropdownOpen(false);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function handleDropdownClick(e: React.MouseEvent) {
    e.stopPropagation();
  }

  return (
    <Link href={`/u/${upload.shortId}`}>
      <div className=' bg-primary p-3 rounded-lg md:justify-between hover:scale-[1.05] group duration-300'>
        <img
          src={`/api/upload/${upload.shortId}`}
          alt=''
          className='grayscale group-hover:grayscale-0 rounded-lg w-full h-48  object-none'
        />
        <div className='flex justify-between items-center'>
          <div className='flex w-1/2 items-center h-full'>
            <div>
              <p className='text-xl font-bold opacity-50'>{upload.shortId}</p>
              <p className='text-xs opacity-20'>
                {getDurationSince(new Date(upload.created_at))} ago
              </p>
            </div>
          </div>
          <div className='flex items-center'>
            <BsThreeDots onClick={openDropdown} className='text-3xl' />
            <div
              ref={dropdownRef}
              className='relative'
              onClick={handleDropdownClick}
            >
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div className='absolute'>aaaaaa</motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
