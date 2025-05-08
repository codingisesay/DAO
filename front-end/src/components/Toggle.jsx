
import { useEffect, useState } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === "dark" ? "light" : "dark"));
    };

    return (
        // <button
        //    className=" theme-toggle-icon"

        // >
        <i onClick={toggleTheme} className={theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars-fill'}></i>
        // </button>
    );
}
