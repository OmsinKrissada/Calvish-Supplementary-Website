/** @type {import('tailwindcss').Config}*/
const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				fira: 'Fira Sans',
				sans: 'Inter',
				mono: 'JetBrains Mono'
			}
		}
	},

	plugins: []
};

module.exports = config;
