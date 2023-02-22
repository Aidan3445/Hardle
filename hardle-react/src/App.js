import "./App.css";

import Navbar from "./components/Navbar";
import Guesses from "./components/Guesses";
import Keyboard from "./components/Keyboard";

function App() {
  return (
    <div className="app">
      <Navbar />
      <Guesses />
      <Keyboard />
    </div>
  );
}

export default App;
