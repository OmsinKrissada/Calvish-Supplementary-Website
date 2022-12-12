export default defineNuxtPlugin(nuxtApp => {
	const config = useRuntimeConfig();
	if (config.public.enableAnalytics) {
		import('@vercel/analytics').then(r => r.inject());
		console.log('injecting vercel analytics');
	};
});
