// src/assets/fonts/fonts.js

/**
 * Font configuration for React Web
 * This maps font names to their public URLs
 */

// Using public URL paths - adjust these based on your project structure
const fonts = {
  // Example font configuration using public URLs
  "Roboto-Regular": "/fonts/Roboto-Regular.ttf",
  "Roboto-Bold": "/fonts/Roboto-Bold.ttf",
  "Roboto-Italic": "/fonts/Roboto-Italic.ttf",
  "OpenSans-Regular": "/fonts/OpenSans-Regular.ttf",
  "OpenSans-Bold": "/fonts/OpenSans-Bold.ttf",

  // Alternative: If using base64 encoded fonts for immediate availability
  // "Roboto-Regular": "data:font/truetype;charset=utf-8;base64,...",

  // Add more fonts as needed
  // Format: 'FontName-Weight': '/path/to/font-file.ttf',
};

/**
 * CSS @font-face declarations for static CSS usage
 * You can also include this in your CSS file
 */
export const fontFaceCSS = `
  @font-face {
    font-family: 'Roboto-Regular';
    src: url('/fonts/Roboto-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto-Bold';
    src: url('/fonts/Roboto-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'Roboto-Italic';
    src: url('/fonts/Roboto-Italic.ttf') format('truetype');
    font-weight: normal;
    font-style: italic;
    font-display: swap;
  }

  @font-face {
    font-family: 'OpenSans-Regular';
    src: url('/fonts/OpenSans-Regular.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: 'OpenSans-Bold';
    src: url('/fonts/OpenSans-Bold.ttf') format('truetype');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
`;

export default fonts;
