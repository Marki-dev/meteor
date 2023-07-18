import { useState, type ChangeEvent } from 'react';

type CheckboxProps = {
  label: string;
  defaultChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
};

function Checkbox({ label, defaultChecked = false, onChange }: CheckboxProps) {
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsChecked(event.target.checked);
    onChange?.(event.target.checked);
  };

  return (
    <div className='flex items-center gap-2 cursor-pointer'>
      <input
        type='checkbox'
        className='form-checkbox h-5 w-5 text-green-500 bg-nav'
        checked={isChecked}
        onChange={handleChange}
      />
      <label className='text-white opacity-70 font-medium'>{label}</label>
    </div>
  );
}

export default Checkbox;
