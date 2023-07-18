import { useState } from 'react';
import DashboardWrapper from '@/components/layout/DashboardWrapper';
import { motion } from 'framer-motion';
import EmbedConfig from '@/components/singleUse/settings/embedConfig';
import ConfigGeneration from '@/components/singleUse/settings/configGeneration';
import DomainConfiguration from '@/components/singleUse/settings/domainConfiguration';
import AuthLock from '@/components/utility/AuthLock';

export default function Settings() {
  const tabs: Record<string, JSX.Element> = {
    Configuration: <ConfigGeneration />,
    'Embed Settings': <EmbedConfig />,
    'Domain Configuration': <DomainConfiguration />,
  };
  type tabsType = keyof typeof tabs;
  const [currentTab, setTab] = useState<tabsType>('Configuration');
  const underlineLayoutId = 'underline';

  return (
    <AuthLock>
      <DashboardWrapper>
        <div className='relative mt-4 md:mt-0'>
          <div className='flex justify-between'>
            <div className='flex mb-5 overflow-scroll scrollbar-hide cursor-pointer'>
              {Object.keys(tabs).map((tab: tabsType) => (
                <div
                  key={tab}
                  onClick={() => {
                    setTab(tab);
                  }}
                  className='relative inline-flex justify-center items-center group'
                >
                  {currentTab === tab && (
                    <motion.div
                      className='absolute inset-0 rounded-lg bg-x3 bg-opacity-50 z-20'
                      layoutId={underlineLayoutId}
                      style={{
                        transform: 'none',
                        transformOrigin: '50% 50% 0px',
                      }}
                    />
                  )}
                  <div
                    className={`bg-primary p-3 shadow-lg z-10 h-full flex items-center font-medium py-2 px-5 transition-all group-first:rounded-l-lg group-last:rounded-r-lg ${
                      currentTab === tab ? 'text-lg' : 'text-md'
                    }`}
                  >
                    <p className='text-xl font-bold'>{tab}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='h-full'>{tabs[currentTab]}</div>
        </div>
      </DashboardWrapper>
    </AuthLock>
  );
}
