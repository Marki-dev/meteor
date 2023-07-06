/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async redirects() {
		return [
			// {
			// 	source: '/s/:id',
			// 	destination: '/api/s/:id',
			// 	permanent: true,
			// },
		];
	},
};

module.exports = nextConfig;
