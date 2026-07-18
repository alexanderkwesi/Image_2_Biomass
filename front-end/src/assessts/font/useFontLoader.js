// src/assets/fonts/useFontLoader.js
import { useState, useEffect } from "react";
import { loadFonts } from "./fontLoader";

/**
 * Custom hook to load fonts in React components
 * @returns {object} Contains loading state and error if any
 */
export const useFontLoader = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadAppFonts = async () => {
      try {
        await loadFonts();
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadAppFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isLoading, error };
};
