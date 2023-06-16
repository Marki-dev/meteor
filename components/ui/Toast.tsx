import {toast} from 'react-hot-toast';
import {FaTimesCircle} from 'react-icons/fa';

type ToastOptions = {
	titleText: string;
	type?: 'success' | 'error' | 'loading' | 'info';
};

export default function Toast({titleText, type = 'success'}: ToastOptions) {
	const color = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'loading' ? 'bg-yellow-500' : 'bg-blue-500';
	return toast.custom(t => {
		function dismiss() {
			toast.dismiss(t.id);
		}

		setTimeout(() => {
			dismiss();
		}, 10000);
		return (
			<div className='bg-secondary rounded-full h-14 flex items-center gap-3 copy'>
				<div className='px-3 max-'>
					{titleText}
				</div>
				<div onClick={dismiss} className={'rounded-[10px] aspect-square h-full flex items-center justify-center ' + color}>
					<FaTimesCircle className='text-4xl hover:opacity-50' />
				</div>
			</div>
		);
	});
}
