import JSONRender from '@/components/reusable/jsonrender';
import { useUser } from '@/hooks/UserHook';
import getConfig from '@/util/web/configGen';
import { useEffect, useRef, useState } from 'react';

export default function ConfigGeneration() {
  const userContext = useUser();
  return (
    <div className='grid grid-cols-4 gap-10'>
      <div className='bg-primary p-3 rounded-lg shadow-lg  col-span-4 md:col-span-2'>
        <p className='text-4xl font-bold'>Config Generation</p>
        <p className='text-xl font-bold opacity-50'>
          Generate Configuration Files for Uploader
        </p>
      </div>
      <div className='bg-primary p-3 rounded-lg shadow-lg w-full col-span-4 md:col-span-2'>
        <p className='text-4xl font-bold'>Token</p>
        <div className='text-xl font-bold opacity-50 py-3'>
          <TokenDisplay text={userContext?.user?.uploadToken ?? 'Loading'} />
        </div>
      </div>

      {/* Config Generator */}
      <ConfigGenerator />
    </div>
  );
}

type configTypes = string;
function ConfigGenerator() {
  const userContext = useUser();
  const [configType, setConfigType] = useState<configTypes>('');

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob(
      [
        JSON.stringify(getConfig(configType)).replace(
          '{{token}}',
          userContext?.user?.uploadToken ?? 'Loading'
        ),
      ],
      {
        type: 'application/json',
      }
    );
    element.href = URL.createObjectURL(file);
    element.download = 'config.sxcu';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div className='bg-primary p-3 rounded-lg shadow-lg w-full col-span-4 md:col-span-1 row-span-2'>
        <div className='flex flex-col items-center h-full'>
          <p className='text-xl opacity-70 font-bold mt-3 mb-4'>
            Select a config type
          </p>
          <div className='flex flex-col items-center justify-center w-full gap-2'>
            {['ShareX', 'ShareNix', 'FlameShot', 'MagicCap'].map((type, i) => (
              <button
                key={i}
                onClick={() => {
                  setConfigType(type.toLowerCase());
                }}
                className={`${
                  configType === type.toLowerCase()
                    ? 'bg-blue-400 bg-opacity-75'
                    : 'bg-secondary'
                } p-3 rounded-lg w-full`}
              >
                <p className='text-2xl font-bold'>{type}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-primary p-3 rounded-lg shadow-lg w-full col-span-4 md:col-span-3 row-span-2'>
        {configType ? (
          <>
            <JSONRender
              takeOverFunction={() => {
                handleDownload();
              }}
              redact={[userContext?.user?.uploadToken ?? 'Loading']}
              copyReplace='Download'
              value={getConfig(configType, [
                ['{{token}}', userContext?.user?.uploadToken ?? 'Loading'],
                ['{{domain}}', userContext?.user?.activeDomain ?? 'Loading'],
              ])}
            />
          </>
        ) : (
          <div className='flex flex-col items-center justify-center h-full'>
            <p className='text-4xl font-bold'>Select a config type</p>
          </div>
        )}
      </div>
    </>
  );
}

function TokenDisplay({ text }: { text: string }) {
  const [showToken, setShowToken] = useState(false);
  const ref =
    typeof window === 'undefined' ? null : useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref) {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setShowToken(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [ref]);

  return (
    <div className='relative' ref={ref}>
      <div
        className='bg-[#15161A] border-secondary border rounded-lg p-2 cursor-pointer overflow-x-scroll scrollbar-hide'
        onClick={() => {
          setShowToken(!showToken);
        }}
      >
        {showToken ? text : 'Click to show token'}
      </div>
    </div>
  );
}
