const withMT = require("@material-tailwind/react/utils/withMT");
module.exports = withMT({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./**/@material-tailwind/**/*.{html,js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        "gradient-green": "#D9EFE6",
        "gradient-purple": "#E7DCF1",
        "primary-color": "#87719D",
        "black-primary-color": "#333333",
        "gray-border": "#BEBEBE"
      },
      backgroundImage: {
        'gradient-117': 'linear-gradient(140deg, #D9EFE6 0%, #E7DCF1 100%)'
      },
      fontSize: {
        'fs-8': '8px',
        'fs-14': '14px',
        'fs-16': '16px',
        'fs-18': '18px',
        'fs-20': '20px',
        'fs-22': '22px',
        'fs-24': '24px',
        'fs-28': '28px'
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
        '4px': '4px',
        '6px': '6px',
        '8px': '8px',
        '10px': '10px',
        '12px': '12px',
        '16px': '16px',
      }
    }
  },
  plugins: [],
});