const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        'success-50': '#e0f7e7',
        'success-100': '#b3ebc2',
        'success-200': '#80de99',
        'success-300': '#4dd170',
        'success-400': '#26c752',
        'success-500': '#00bd33',
        'success-600': '#00b72e',
        'success-700': '#00ae27',
        'success-800': '#00a620',
        'success-900': '#009814',
        'success-A100': '#c3ffc8',
        'success-A200': '#90ff98',
        'success-A400': '#5dff69',
        'success-A700': '#44ff51',

        'purple-50': '#f1eef3',
        'purple-100': '#dbd4e2',
        'purple-200': '#c3b8ce',
        'purple-300': '#ab9cba',
        'purple-400': '#9986ac',
        'purple-500': '#87719d',
        'purple-600': '#7f6995',
        'purple-700': '#745e8b',
        'purple-800': '#6a5481',
        'purple-900': '#57426f',
        'purple-A100': '#e1c9ff',
        'purple-A200': '#c696ff',
        'purple-A400': '#aa63ff',
        'purple-A700': '#9c49ff',

        "green-100": "#D9EFE6",
        "black-500": "#333333",
        "gray-border": "#BEBEBE",
        "black-border": "#000000",
        "gray-200": "#989898"
      },
      backgroundImage: {
        'gradient-117-to-r': 'linear-gradient(140deg, #D9EFE6 0%, #E7DCF1 100%)',
        'gradient-117-to-l': 'linear-gradient(90deg, rgba(231, 220, 241, 0.5) 0, rgba(217, 239, 230, 0.5) 100%)'
      },
      fontSize: {
        'fs-8': '8px',
        'fs-xsm': '12px',
        'fs-14': '14px',
        'fs-sm': '16px',
        'fs-18': '18px',
        'fs-md': '20px',
        'fs-22': '22px',
        'fs-24': '24px',
        'fs-lg': '28px',
        'fs-xlg': '32px',
      },
      fontWeight: {
        'fw-500': '500',
        'fw-700': '700'
      },
      lineHeight: {
        'lh-1.5': '1.5',
        'lh-100': '100%'
      },
      borderRadius: {
        'custom-ssm': '6px',
        'custom-sm': '8px',
        'custom-md': '12px',
        'custom-lg': '16px',
        'custom-xl': '20px',
        'custom-xxl': '24px',
      },
      borderWidth: {
        '0.5': '0.5px',
        '1': '1px'
      },
      borderColor: {
        'gray-border': '#BEBEBE'
      },
      spacing: {
        '2px': '2px',
        '4px': '4px',
        '6px': '6px',
        '8px': '8px',
        '10px': '10px',
        '12px': '12px',
        '16px': '16px',
        '18px': '18px',
        '20px': '20px',
        '24px': '24px',
        '26px': '26px',
        '28px': '28px',
        '32px': '32px',
        '40px': '40px',
        '48px': '48px',
        '64px': '64px',
      }
    }
  },
  plugins: [],
});