// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	typescript: {
		shim: false
	},
	modules: [
		'@nuxtjs/google-fonts',
		'nuxt-headlessui',
	],
	css: ['~/assets/css/main.css'],
	plugins: [{ src: '~/plugins/vercel.ts', mode: 'client' }],
	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	runtimeConfig: {
		public: {
			enableAnalytics: false,
			endpoint: 'https://krissada.com/api/calvish'
		}
	},
	googleFonts: {
		families: {
			'Fira Sans': [400, 500, 700],
			Inter: [400, 500, 700],
			'JetBrains Mono': [400, 500, 700]
		}
	},
});
