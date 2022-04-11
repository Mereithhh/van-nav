import "./App.css";
import Content from "./components/Content";
import DarkSwitch from "./components/DarkSwitch";
function App() {
  return (
    <div className="App">
      <DarkSwitch />
      <div className="main">
        <Content />
      </div>
    </div>
  );
}

export default App;
