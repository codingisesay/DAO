import React, { useEffect } from "react";
import "./Google_Translater.css";

function Google_Translater() {
  useEffect(() => {
    // Check if the script is already loaded
    if (!window.google || !window.google.translate) {
      const scriptId = "google-translate-script";
      
      // Only add the script if it doesn't already exist
      if (!document.getElementById(scriptId)) {
        const addScript = document.createElement("script");
        addScript.id = scriptId;
        addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        addScript.async = true;
        document.body.appendChild(addScript);
      }

      // Initialize the translate element
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
            },
            "google_translate_element"
          );
        }
      };
    } else {
      // If Google Translate is already loaded, initialize directly
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        "google_translate_element"
      );
    }

    // Cleanup function
    return () => {
      // Remove the Google Translate widget when component unmounts
      const googleTranslateElement = document.querySelector(".goog-te-combo");
      if (googleTranslateElement) {
        googleTranslateElement.remove();
      }
    };
  }, []);

  return (
    <div className="google_div">
      <div id="google_translate_element"></div>
    </div>
  );
}

export default Google_Translater;










// import React from "react";
// import { useEffect } from "react";
// import globeLogo from "./globe.png";
// import "./Google_Translater.css";

// function Google_Translater() {
//   useEffect(() => {
//     const addScript = document.createElement("script");
//     if (!document.querySelector('[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]')) {
//       addScript.setAttribute(
//         "src",
//         "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
//       );
//       document.body.appendChild(addScript);
//     }

//     window.googleTranslateElementInit = () => {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: "en",
//           autoDisplay: false,
//         },
//         "google_translate_element"
//       );
//     };
//   }, []);

//   return (
//     <div className="google_div">
//       <div id="google_translate_element"></div>
//     </div>
//   );
// }
  
//   export default Google_Translater;
  