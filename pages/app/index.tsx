import { useEffect } from 'react'
import { useRouter } from 'next/router'
import DashboardWrapper from '@/components/layout/DashboardWrapper'
import { FaCamera, FaCommentDots, FaFileAlt, FaStickyNote, FaUpload } from 'react-icons/fa'

export default function MainAPPPage() {
    return (
        <DashboardWrapper>
            {/* Stats Display */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
                {[
                    { name: "Total Uploads", value: 0, icon: FaUpload },
                    { name: "Images", value: 0, icon: FaCamera },
                    { name: "Text Snippets", value: 0, icon: FaStickyNote },
                    { name: "Other Files", value: 0, icon: FaFileAlt },
                ].map((stat, i) => (
                    <div key={i} className='flex bg-primary p-3 rounded-lg md:justify-between'>
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
                {Array.from({ length: 5 *2 }).map((stat, i) => (
                    <div key={i} className=' bg-primary p-3 rounded-lg md:justify-between hover:scale-[1.05] group duration-300'>
                        <img src={`https://picsum.photos/${getRandomNumber(256, 2560)}/${getRandomNumber(256, 2560)}?penis=${i}`} alt='' className='grayscale group-hover:grayscale-0 rounded-lg w-full h-48  object-none' />
                        <div className='flex justify-between items-center'>
                            <div className='flex w-1/2 items-center'>
                                <p className='text-4xl font-bold opacity-50'>UploadID</p>
                            </div>
                            <div className='flex items-center'>
                                <FaCommentDots className='text-3xl'/>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </DashboardWrapper>
    )
}


function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  