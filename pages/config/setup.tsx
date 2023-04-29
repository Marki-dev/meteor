import { useState, isValidElement } from 'react';
import { motion } from 'framer-motion';
import NavBar from '@/components/layout/nav';
import Checkbox from '@/components/reusable/Checkbox';
import { RadioGroup } from '@headlessui/react';
import { FaCheckCircle } from 'react-icons/fa';

type ConfigType = {
    attribution?: boolean;
    mode?: "s3" | "filesystem";
}

export default function ConfigFlow() {
    const [config, setConfig] = useState<ConfigType>({})
    function changeConfig(key: keyof ConfigType, value: any) {
        setConfig({ ...config, [key]: value })
        console.log(config)
    }
    return (
        <div className="relative">
            <NavBar />
            <div className="meteor-login-bg" />
            <div className="full-screen flex justify-center items-center">
                <div className="bg-secondary rounded-lg p-10 shadow-2xl w-[80%] md:max-w-[30vw]">
                    <Animator>
                        <div className="flex justify-center items-center flex-col gap-y-5">
                            <p>Welcome to Meteor, the finest open-source ShareX uploader in a box (thanks to Docker).</p>
                            <p>As it seems that this is your first time accessing this dashboard after installing Meteor, we need to do a bit of setup before we can get started.</p>
                        </div>
                        <div className="flex justify-center items-center flex-col gap-y-5">
                            <p>Firstly, we need to discuss modifying this app.</p>
                            <p>Personally, I don't mind if you alter the branding, color scheme, or even add or modify features to fit your needs. However, I request that you not remove the attribution displayed on the bottom left of the page. I spent a great deal of time creating this app, and I would like people to know who built it – Thyke.</p>
                            {config.attribution === false && (
                                <p className='text-red-500 font-black'>Please Acknowlage the Attribution</p>
                            )}
                            <Checkbox onChange={(b) => (changeConfig("attribution", b))} label='I will not modify the Attribution' />
                        </div>
                        <div className="flex justify-center items-center flex-col gap-y-5">
                            <p>Application Mode</p>
                            <ApplicationMode onChange={(d) => changeConfig('mode', d)} items={[
                                { name: "FileSystem", value: "filesystem", description: "Meteor will store all uploads in the local filesystem. This is the default mode, and is recommended for most users." },
                                { name: "S3", value: "s3", description: "Meteor will store all uploads in an S3 bucket. This is recommended for users who want to store their uploads in a remote location, or who want to use Meteor as a CDN." },
                            ]} />
                            {config.mode === "s3" && (
                                <p>cheese</p>
                            )}

                        </div>
                        {config.mode === "s3" && (
                            <div className="flex justify-center items-center flex-col gap-y-5">
                                <p>Amazon S3</p>
                                <p>Enter your Amazon S3 credentials below. If you don't have an S3 bucket, you can create one <a href="https://s3.console.aws.amazon.com/s3/home" className="text-primary">here</a>.</p>
                                <div className="flex justify-center items-center flex-col gap-y-5">
                                    <input type="text" placeholder="Access Key" className="bg-nav rounded-lg p-2 w-[80%] md:max-w-[30vw]" />
                                    <input type="text" placeholder="Secret Key" className="bg-nav rounded-lg p-2 w-[80%] md:max-w-[30vw]" />
                                    <input type="text" placeholder="Bucket Name" className="bg-nav rounded-lg p-2 w-[80%] md:max-w-[30vw]" />
                                    <input type="text" placeholder="Region" className="bg-nav rounded-lg p-2 w-[80%] md:max-w-[30vw]" />
                                </div>
                            </div>
                        )}
                        <div className="flex justify-center items-center flex-col gap-y-5">
                            <p>Setup Complete</p>
                            {/* Reboot Button */}
                            <button className="bg-green-500 rounded-lg p-3 w-[80%] md:max-w-[30vw]">Reboot</button>

                        </div>
                    </Animator>
                </div>
            </div>
        </div>
    )
}


type ApplicationModeProps = {
    items: {
        name: string
        description: string,
        value: string
    }[]
    onChange?: (d: string) => void
}

function ApplicationMode({ items, onChange }: ApplicationModeProps) {
    const [selected, setSelected] = useState(items[0])

    function handleChange(d: any) {
        setSelected(d)
        onChange && onChange(d)
    }
    return (
        <RadioGroup value={selected} onChange={handleChange}>
            <div className="space-y-2">
                {items.map((item) => (
                    <RadioGroup.Option
                        key={item.name}
                        value={item.value}
                        className={({ active, checked }) =>
                            `${active
                                ? 'ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300'
                                : ''
                            }
                    ${checked ? 'bg-primary' : 'bg-x3'
                            }
                      relative flex rounded-lg px-5 py-4 shadow-md focus:outline-none`
                        }
                    >
                        {({ active, checked }) => (
                            <>
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex items-center w-3/4">
                                        <div className="text-sm">
                                            <RadioGroup.Label
                                                as="p"
                                                className={`font-medium `}
                                            >
                                                {item.name}
                                            </RadioGroup.Label>
                                            <RadioGroup.Description
                                                as="span"
                                                className={`inline`}
                                            >
                                                {item.description}
                                            </RadioGroup.Description>
                                        </div>
                                    </div>
                                    {checked && (
                                        <div className="shrink-0 text-white">
                                            <FaCheckCircle className="h-6 w-6" />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </RadioGroup.Option>
                ))}
            </div>
        </RadioGroup>
    )
}

function Animator({ children }: { children: React.ReactNode[] }) {
    const [currentStep, setCurrentStep] = useState(1);

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(currentStep - 1);
    };
    console.log(children)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className='relative'
        >
            <p className='font-black text-xl'>{currentStep}/{children.filter(c => !!c).length}</p>
            {/* Filter CHildren so that if any of em are false, they wont be rendered */}
            {children.filter((c) => c)?.map((child, index) => {
                if (!child) return null;
                return (
                    <ConfigStep title={`Step ${index + 1}`} isActive={currentStep === index + 1}>
                        <div className='w-full flex justify-center'>
                            <h1 className="text-6xl font-bold text-white meteor-text text-center">Meteor</h1>
                        </div>

                        {child}
                    </ConfigStep>
                )
            })}

            <div className='flex justify-between mt-10'>
                <button className='bg-gray-500 p-2 rounded-md disabled:cursor-not-allowed' disabled={currentStep === 1} onClick={handlePrevStep}>
                    Previous
                </button>
                <button className='bg-blue-500 p-2 rounded-md disabled:cursor-not-allowed' disabled={currentStep === children.filter(c => !!c).length} onClick={handleNextStep}>
                    Next
                </button>

            </div>
        </motion.div>
    );
}


interface ConfigStepProps {
    title: string;
    children: React.ReactNode;
    isActive: boolean;
}

const ConfigStep: React.FC<ConfigStepProps> = ({ title, children, isActive }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            style={{ display: isActive ? 'block' : 'none' }}
        >
            {/* <h3>{title}</h3> */}
            {children}
        </motion.div>
    );
};
