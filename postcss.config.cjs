/** @type {import('postcss').Config} */
module.exports = {
	plugins: {
		'@tailwindcss/postcss': {}, // ✅ Use the new plugin name here
		autoprefixer: {}
	}
};
