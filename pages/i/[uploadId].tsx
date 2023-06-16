import NavBar from '@/components/layout/nav';

export default function FileView() {
	return (
		<div>
			<NavBar />
			<div className='full-screen bg-secondary bg-opacity-20'>
				<div className='flex items-center justify-center h-full'>

					<img className='hover:scale-110 rounded-3xl hover:rounded-sm duration-300 shadow-xl max-h-[70vh]' src='https://picsum.photos/1080/720' />
				</div>
			</div>
		</div>
	);
}
