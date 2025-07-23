////////////////copilot

import React, { useEffect } from "react";
import "./Google_Translater.css";

function Google_Translater() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,es,fr,de,it,pt,ru,zh-CN,ja,ko,ar,hi",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    if (!document.querySelector('script[src*="translate.google.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  return (
    <div className="google-translate-container">
      <div id="google_translate_element"></div>hi
    </div>
  );
}

export default Google_Translater;






















////////////////////////deepseek
// import React, { useEffect } from "react";
// import "./Google_Translater.css";

// function Google_Translater() {
//   useEffect(() => {
//  const initializeGoogleTranslate = () => {
//   if (window.google && window.google.translate) {
//     // First remove any existing instance
//     const oldDiv = document.getElementById('google_translate_element');
//     if (oldDiv) oldDiv.innerHTML = '';
    
//     // Create new instance
//     new window.google.translate.TranslateElement(
//       {
//         pageLanguage: "en",
//         includedLanguages: "en,es,fr,de,it,pt,ru,zh-CN,ja,ko,ar,hi",
//         layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
//         autoDisplay: false,
//       },
//       "google_translate_element"
//     );
    
//     // Force refresh
//     setTimeout(() => {
//       const select = document.querySelector('.goog-te-combo');
//       if (select) {
//         select.style.display = 'none';
//         select.offsetHeight; // Trigger reflow
//         select.style.display = 'block';
//       }
//     }, 500);
//   }
// };

//     // Check if already initialized
//     if (window.google && window.google.translate) {
//       initializeGoogleTranslate();
//       return;
//     }

//     // Set up callback
//     window.googleTranslateElementInit = initializeGoogleTranslate;

//     // Load script if not already loaded
//     if (!document.querySelector('script[src*="translate.google.com"]')) {
//       const script = document.createElement('script');
//       script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//       script.async = true;
//       document.body.appendChild(script);
//     }

//     return () => {
//       // Clean up any existing Google Translate elements
//       const frames = document.querySelectorAll('.goog-te-menu-frame,.goog-te-banner-frame');
//       frames.forEach(frame => frame.remove());
      
//       // Remove our callback if it exists
//       if (window.googleTranslateElementInit === initializeGoogleTranslate) {
//         delete window.googleTranslateElementInit;
//       }
//     };
//   }, []);

//   return (
//     <div className="google-translate-container">
//       <div id="google_translate_element"></div>
//     </div>
//   );
// }

// export default Google_Translater;





















///////////////////////shreays code 
// import React from "react";
// import { useEffect } from "react";
// import globeLogo from "./glob.png";
// import "./Google_Translater.css";

// function Google_Translater() {
//   useEffect(() => {
//     const addScript = document.createElement("script");
//     if (
//       !document.querySelector(
//         '[src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"]'
//       )
//     ) {
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

// export default Google_Translater;
