import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import Toast from '../ui/Toast';

interface JsonViewerProps {
    value: any;
    copyReplace?: string;
    redact?: string[];
    takeOverFunction?: () => void;
}

const JSONRender: React.FC<JsonViewerProps> = ({ value, takeOverFunction, copyReplace, redact }) => {
    let jsonValue = JSON.stringify(value, null, 2);
    if (redact) {
        for (let i = 0; i < redact.length; i++) {
            const key = redact[i];

            jsonValue = jsonValue.replace(key, key.length > 1 ? "*".repeat(key.length) : "*");
        }
    }
    function copyCode() {
        if (takeOverFunction) return takeOverFunction()
        navigator.clipboard.writeText(value)
        Toast({
            titleText: "Copied to clipboard!",
        })
    }
    return (
        <div className='rounded-xl relative'>
            <div onClick={copyCode} className='absolute top-4 right-4 p-3 bg-primary rounded-md shadow-xl hover:opacity-80'>
                {copyReplace || "Copy"}
            </div>
            <SyntaxHighlighter language="json" style={vscDarkPlus}>
                {jsonValue}
            </SyntaxHighlighter>
        </div>
    );
};

export default JSONRender;