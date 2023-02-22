import { useState, useEffect } from "react";
import Info from "./Info";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(true);

  function toggleDarkMode() {
    setDarkMode((prevDarkMode) => !prevDarkMode);
  }

  return (
    <nav>
      <button className="nav--colormode" onClick={toggleDarkMode}>{darkMode ? "Dark Mode" : "Light Mode"}</button>
      <h1 className="nav--hardle">HARDLE</h1>
      <Info />
    </nav>
  );
}
