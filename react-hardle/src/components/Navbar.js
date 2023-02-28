import { useState } from "react";
import InfoButton from "../images/i.png";
import InfoPanel from "../images/info.png";

export default function Navbar(props) {
  const { store } = props;
  // const [darkMode, setDarkMode] = useState(true);

  // function toggleDarkMode() {
  //   setDarkMode((prevDarkMode) => !prevDarkMode);
  // }

  const [showInfo, setShowInfo] = useState(false);

  function toggleInfo() {
    setShowInfo((prevShowInfo) => !prevShowInfo);
  }

  return (
    <nav>
      {/* <button className="nav--colormode" onClick={toggleDarkMode}>
        {darkMode ? "Dark Mode" : "Light Mode"}
      </button> */}
      <h1 className="hardle" onClick={() => store.toggleStats()}>HARDLE</h1>
      <img
        className="info--button"
        src={InfoButton}
        alt="infobutton"
        onClick={toggleInfo}
      />

      {showInfo && (
        <img
          className="info--panel"
          src={InfoPanel}
          alt="infopanel"
          onClick={toggleInfo}
        />
      )}
    </nav>
  );
}
