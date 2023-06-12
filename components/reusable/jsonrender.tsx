import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Toast from '../ui/Toast';

interface JsonViewerProps {
    value: any;
}

const JSONRender: React.FC<JsonViewerProps> = ({ value }) => {
    const jsonValue = JSON.stringify(value, null, 2);

    function copyCode() {
        navigator.clipboard.writeText(value)
        Toast({
            titleText: "Copied to clipboard!",
        })
    }
    return (
        <div className='rounded-xl relative'>
            <div onClick={copyCode} className='absolute top-4 right-4 p-3 copy'>
                Copy
            </div>
            <SyntaxHighlighter language="json" style={vscDarkPlus}>
                {jsonValue}
            </SyntaxHighlighter>
        </div>
    );
};

export default JSONRender;