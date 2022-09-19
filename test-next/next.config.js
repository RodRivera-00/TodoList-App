/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	rewrites: async () => {
		//Don't include /users/ as it will show the confidential details
		return [
			{
				source: "/data/todo/:path*",
				destination: "http://localhost:8081/todo/:path*",
			},
			{
				source: "/data/comments/:path*",
				destination: "http://localhost:8081/comments/:path*",
			},
		];
	},
};

module.exports = nextConfig;
