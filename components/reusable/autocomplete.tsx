/* eslint-disable @typescript-eslint/indent */
import { type ChangeEventHandler, useState, useEffect } from 'react';

type AutocompleteProps = {
	options?: string[];
	type: 'input' | 'textarea';
	maxChars?: number;
	value?: string;
	onChange?: (d: string) => void;
};

export default function AutoCompleteInput({
	options = [],
	onChange,
	type,
	maxChars,
	value = '',
}: AutocompleteProps) {
	const [lastWord, setLastWord] = useState<string>('');
	const [inputValue, setInputValue] = useState<string>(value);
	const [selectedOption, setSelectedOption] = useState<string>();

	useEffect(() => {
		setInputValue(value);
	}, [value]);

	const handleTextChange: ChangeEventHandler<
		HTMLInputElement | HTMLTextAreaElement
	> = event => {
		const inputText = event.target.value;
		const cursorPos = event.target.selectionStart;

		const wordsBeforeCursor = inputText.substr(0, cursorPos!).trim().split(' ');
		const lastWordBeforeCursor =
			wordsBeforeCursor[wordsBeforeCursor.length - 1];

		setLastWord(lastWordBeforeCursor);
		setInputValue(inputText);
		onChange?.(inputText);
	};

	const filteredOptions = options.filter(option => option.startsWith(lastWord));
	const openComboBox = filteredOptions.length > 0 && lastWord.length > 0;

	const finishAutoComplete = (option: string) => {
		setInputValue(prevInputValue => {
			const words = prevInputValue.trim().split(' ');
			words[words.length - 1] = option;
			return words.join(' ') + ' ';
		});
		setSelectedOption('');
		setLastWord('');
		if (onChange) {
			onChange(inputValue);
		}
	};

	const remainingChars = maxChars
		? maxChars - Number(inputValue?.length)
		: undefined;
	const hasReachedMaxChars = maxChars && inputValue?.length >= maxChars;

	return (
		<div className='relative w-full'>
			{type === 'input' ? (
				<input
					className='bg-secondary rounded-lg p-1 focus:outline-none border-2 border-secondary focus:border-x3 w-full'
					value={inputValue}
					onChange={handleTextChange}
				/>
			) : (
				<textarea
					rows={6}
					className='bg-secondary rounded-lg p-1 focus:outline-none border-2 border-secondary focus:border-x3 w-full'
					value={inputValue}
					onChange={handleTextChange}
				/>
			)}
			{remainingChars !== undefined && (
				<div className='text-xs text-right text-gray-500'>{`${remainingChars} characters remaining`}</div>
			)}
			{hasReachedMaxChars && (
				<div className='text-xs text-right text-red-500'>
					Maximum character limit reached
				</div>
			)}
			{openComboBox && (
				<div className='absolute mt-1 p-1 bg-secondary w-full rounded-lg shadow-lg max-h-52 overflow-y-scroll z-40'>
					{filteredOptions.map(option => (
						<div
							key={option}
							className={`px-3 py-1 cursor-pointer first:rounded-t-md last:rounded-b-md hover:bg-primary ${
								option === selectedOption ? 'bg-primary text-white' : ''
							}`}
							onClick={() => {
								finishAutoComplete(option);
							}}
						>
							{option}
						</div>
					))}
				</div>
			)}
		</div>
	);
}
