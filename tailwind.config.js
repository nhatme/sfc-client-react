const withMT = require("@material-tailwind/react/utils/withMT");
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}"
//   ],
//   theme: {
//     extend: {
//       colors: {

//       }
//     },
//   },
//   plugins: [],
// }

module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});