// src/assets/fonts/fontLoader.js

/**
 * Load all custom fonts for the React Web application
 * This function should be called early in your app initialization
 * @returns {Promise} Promise that resolves when fonts are loaded
 */
export const loadFonts = async () => {
  try {
    // Create a font loading promise for each font
    const fontPromises = [];

    // Dynamically create font faces for each font
    Object.keys(fonts).forEach((fontName) => {
      const fontFace = new FontFace(fontName, `url(${fonts[fontName]})`);
      document.fonts.add(fontFace);
      fontPromises.push(fontFace.load());
    });

    // Wait for all fonts to load
    await Promise.all(fontPromises);
    console.log("Fonts loaded successfully");
    return true;
  } catch (error) {
    console.error("Error loading fonts:", error);
    return false;
  }
};

/**
 * Get font family name based on weight and style
 * @param {string} baseName - Base font name (e.g., 'Roboto', 'OpenSans')
 * @param {string} weight - Font weight ('regular', 'bold', 'light', etc.)
 * @param {boolean} italic - Whether to use italic style
 * @returns {string} Complete font family name
 */
export const getFontFamily = (baseName, weight = "regular", italic = false) => {
  const weightMap = {
    100: "Thin",
    200: "ExtraLight",
    300: "Light",
    400: "Regular",
    500: "Medium",
    600: "SemiBold",
    700: "Bold",
    800: "ExtraBold",
    900: "Black",
    normal: "Regular",
    bold: "Bold",
    regular: "Regular",
    light: "Light",
    medium: "Medium",
  };

  const weightSuffix = weightMap[weight] || "Regular";
  const italicSuffix = italic ? "Italic" : "";

  // Construct font name like 'Roboto-Bold' or 'Roboto-BoldItalic'
  const separator = italicSuffix ? "" : "-";
  return `${baseName}-${weightSuffix}${italicSuffix}`;
};

/**
 * Alternative: Use CSS font-family names directly for React Web
 * @param {string} baseName - Base font name
 * @param {string} weight - Font weight
 * @param {boolean} italic - Italic style
 * @returns {object} CSS font-family object
 */
export const getFontStyle = (baseName, weight = "regular", italic = false) => {
  const fontFamily = getFontFamily(baseName, weight, italic);

  return {
    fontFamily: `"${fontFamily}", ${baseName}, sans-serif`,
    fontWeight:
      weight === "bold" ? "bold" : weight === "normal" ? "normal" : weight,
    fontStyle: italic ? "italic" : "normal",
  };
};
