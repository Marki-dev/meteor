import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import DashboardWrapper from '@/components/layout/DashboardWrapper'
import { FaCamera, FaCommentDots, FaFileAlt, FaStickyNote, FaUpload } from 'react-icons/fa'
import JSONRender from '@/components/reusable/jsonrender'
import getConfig from '@/util/web/configGen'

export default function ConfigGeneration() {
  return (
    <DashboardWrapper>
      <div className='grid grid-cols-4 gap-10'>
        <div className='bg-primary p-3 rounded-lg shadow-lg whitespace-nowrap col-span-2'>
          <p className='text-4xl font-bold'>Config Generation</p>
          <p className='text-xl font-bold opacity-50'>Generate Configuration Files for Uploaders</p>
        </div>
        <div className='bg-primary p-3 rounded-lg shadow-lg w-full col-span-2'>
          <p className='text-4xl font-bold'>Token</p>
          <div className='text-xl font-bold opacity-50'>
            <HiddenText key={"oenis"} text="asdasda" />
          </div>
        </div>

        {/* Config Generator */}
        <ConfigGenerator />
      </div>
    </DashboardWrapper>
  )
}
type configTypes = string
function ConfigGenerator() {
  const [configType, setConfigType] = useState<configTypes>("")
  console.log(configType)
  return (
    <>
      <div className='bg-primary p-3 rounded-lg shadow-lg w-full col-span-1 row-span-2'>
        <div className='flex flex-col items-center h-full'>
          <p className='text-xl opacity-70 font-bold mt-3 mb-4'>Select a config type</p>
          <div className='flex flex-col items-center justify-center w-full gap-2'>
            {["ShareX"].map((type, i) => (
              <button key={i} onClick={() => setConfigType(type.toLowerCase())} className={`${configType == type.toLowerCase() ? "bg-blue-500 bg-opacity-50" : "bg-secondary"} p-3 rounded-lg w-full`}>
                <p className='text-2xl font-bold'>{type}</p>
              </button>
            ))}
          </div>
        </div>

      </div>
      <div className='bg-primary p-3 rounded-lg shadow-lg w-full col-span-3 row-span-2'>
        {configType ? (
          <>
            <JSONRender json={getConfig(configType, [["token", "fucker"]])} />
          </>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <p className='text-4xl font-bold'>Select a config type</p>
          </div>
        )}
      </div>

    </>
  )
}




function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function HiddenText({ text }: { text: string }) {
  const [showToken, setShowToken] = useState(false);
  const ref = typeof window !== 'undefined' ? useRef<HTMLDivElement>(null) : null;

  useEffect(() => {
    if (ref) {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setShowToken(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [ref]);

  return (
    <div className="relative" ref={ref}>
      <div className='bg-[#15161A] border-secondary border rounded-lg p-2' onClick={() => setShowToken(true)}>
        {showToken ? text : "Click to show token"}
      </div>
    </div>
  );
}
