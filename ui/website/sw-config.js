module.exports = {
	runtimeCaching: [
	{
		urlPattern: /^(https?:\/\/(([a-zA-Z0-9]+-?)+[a-zA-Z0-9]+\.)+[a-zA-Z]+)(:\d+)?(\/.*)?(\?.*)?(#.*)?$/,
		handler: 'networkFirst',
	}
	],
};