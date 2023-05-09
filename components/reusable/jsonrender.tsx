import { useState } from 'react';

interface SyntaxHighlighterProps {
    json: Record<string, any>;
    first?: boolean;
}

export default function JSONRender({ json, first = true }: SyntaxHighlighterProps) {
    console.log("Aaaa")
    return first ? (
        <div className='bg-[#15161A] p-3 relative w-full h-full rounded-lg'>
            <div className='absolute top-3 right-3 bg-secondary p-3 rounded-lg hover:bg-opacity-20 shadow-lg hover:scale-105 duration-200'>
                <p className='font-black'>Copy</p>
            </div>
            <JSONComponent json={json} />
        </div>
    ) : <JSONComponent json={json} />;
}
function JSONComponent(json: Record<string, any>) {
    return (
        <div className="text-xs font-mono rounded-lg">
            <span className="text-purple-500">{'{'}</span>
            {Object.keys(json).map((key, index) => (
                <div key={index} className="pl-4">
                    <span className="text-yellow-500">{`"${key}"`}</span>:
                    <span className="text-gray-500"> </span>
                    {typeof json[key] === 'object' ? (
                        <JSONRender json={json[key]} first={false} />
                    ) : typeof json[key] === 'number' ? (
                        <span className="text-blue-500">{json[key]}</span>
                    ) : (
                        <span className="text-green-500">{`"${json[key]}"`}</span>
                    )}
                    {index !== Object.keys(json).length - 1 ? (
                        <span className="text-purple-500">{','}</span>
                    ) : null}
                </div>
            ))}
            <span className="text-purple-500">{'}'}</span>
        </div >
    )
}