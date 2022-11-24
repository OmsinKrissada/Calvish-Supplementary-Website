export default defineNuxtPlugin(nuxtApp => {
	if (process.env.NODE_ENV !== 'development') {
		import('@vercel/analytics').then(r => r.inject());
		console.log('injecting vercel analytics');
	};
});
