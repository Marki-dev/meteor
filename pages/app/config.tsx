import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import DashboardWrapper from '@/components/layout/DashboardWrapper'
import { FaCamera, FaCommentDots, FaFileAlt, FaStickyNote, FaUpload } from 'react-icons/fa'

export default function ConfigGeneration() {
    return (
        <DashboardWrapper>
            <div className='flex gap-10'>
                <div className='bg-primary p-3 rounded-lg shadow-lg whitespace-nowrap'>
                    <p className='text-4xl font-bold'>Config Generation</p>
                    <p className='text-xl font-bold opacity-50'>Generate Configuration Files for Uploaders</p>
                </div>
                <div className='bg-primary p-3 rounded-lg shadow-lg w-full'>
                    <p className='text-4xl font-bold'>Token</p>
                    <p className='text-xl font-bold opacity-50'><HiddenText text="asdasda"/></p>
                </div>
                
            </div>
        </DashboardWrapper>
    )
}


function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function HiddenText({text}: {text: string}) {
    const [showToken, setShowToken] = useState(false);

  return (
    <div className="relative">
      <div className={showToken ? "blur-none" : "blur-xl"}>
        <p>{text}</p>
      </div>
    </div>
  );
}