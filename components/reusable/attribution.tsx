import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FaGithub, FaMeteor } from 'react-icons/fa';

export default function Attribution() {
    const [open, setOpen] = useState(false);
    const modalRef = useRef<any>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        window.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef]);

    return (
        <div className='absolute bottom-5 left-5 z-50'>
            <div ref={modalRef}>

            {open && (
                <motion.div
                    initial={{ translateX: "-50vw" }}
                    animate={{ translateX: "0vw" }}
                    exit={{ translateX: "-50vw" }}
                    transition={{ duration: 0.5 }}
                    className='mb-5 max-w-[90vw] md:max-w-xl'
                >
                    <div className="bg-secondary p-3 shadow-xl rounded-lg flex flex-col gap-3">
                        <p className='text-3xl font-bold'>Welcome to <span className='meteor-text'>Meteor</span></p>
                        <p>Welcome to Meteor, an open-source project created by <span className='font-bold underline'><a href='https://thyke.xyz'>Thyke Adams</a></span> with the aim of providing a safe and secure way to quickly set up a ShareX uploader. Meteor enables easy sharing of various types of content, including screenshots, files, and code snippets, with those who matter most. It is fully open source and can be easily deployed on your own hardware, allowing you to set up your own domain and personalize your experience. With Meteor, you can confidently share your content with peace of mind.</p>

                        <div className='flex'>
                            {[
                                {
                                    icon: FaGithub,
                                    url: "https://github.com/ThykeAdams/meteor"
                                }
                            ].map((item) => (
                                <a className='bg-secondary p-3 rounded-lg hover:bg-opacity-70 shadow-lg' href={item.url}>
                                    <item.icon />
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
            </div>
            <div className='flex'>
                <div onClick={() => setOpen(!open)} className='bg-secondary p-3 rounded-lg hover:bg-opacity-70'>
                    <FaMeteor />
                </div>
            </div>
        </div>
    );
}
