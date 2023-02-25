import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Hardle from "./classes/Hardle";

const hardle = new Hardle();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App hardle={hardle} />);
