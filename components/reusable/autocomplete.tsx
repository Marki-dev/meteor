import { type } from 'os';
import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react';

type AutocompleteProps = {
    options: string[];
    type: "input" | "textarea";
    onChange?: (d: string) => void;
};

export default function AutoCompleteInput({ options, onChange, type }: AutocompleteProps) {
    const [lastWord, setLastWord] = useState<string>('');
    const [inputValue, setInputValue] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<string>('');
    console.log(selectedOption)

    const handleTextChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        const inputText = event.target.value;
        const cursorPos = event.target.selectionStart;

        const wordsBeforeCursor = inputText.substr(0, cursorPos!).trim().split(' ');
        const lastWordBeforeCursor = wordsBeforeCursor[wordsBeforeCursor.length - 1];

        setLastWord(lastWordBeforeCursor);
        setInputValue(inputText);
    };


    const filteredOptions = options.filter((option) => option.includes(lastWord));
    const openComboBox = filteredOptions.length > 0 && lastWord.length > 0;

    const finishAutoComplete = (option: string) => {
        setInputValue((prevInputValue) => {
            const words = prevInputValue.trim().split(' ');
            words[words.length - 1] = option;
            return words.join(' ') + " ";
        });
        setSelectedOption('');
        setLastWord('');
        if (onChange) {
            onChange(inputValue);
        }
    };

    return (
        <div className="relative w-full">
            {type === "input" ? (
                <input
                    className="bg-secondary rounded-lg p-1 focus:outline-none border-2 border-secondary focus:border-x3 w-full"
                    value={inputValue}
                    onChange={handleTextChange}
                />
            ) : (
                <textarea
                    rows={10}
                    className="bg-secondary rounded-lg p-1 focus:outline-none border-2 border-secondary focus:border-x3 w-full"
                    value={inputValue}
                    onChange={handleTextChange}
                />
            )}
            {openComboBox && (
                <div className="absolute mt-1 p-1 bg-secondary w-full rounded-lg shadow-lg max-h-52 overflow-y-scroll">
                    {filteredOptions.map((option) => (
                        <div
                            key={option}
                            className={`px-3 py-1 cursor-pointer first:rounded-t-md last:rounded-b-md hover:bg-primary ${option === selectedOption ? 'bg-primary text-white' : ''
                                }`}
                            onClick={() => finishAutoComplete(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
