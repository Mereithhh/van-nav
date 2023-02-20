import "./App.css";
import Content from "./components/Content";
import DarkSwitch from "./components/DarkSwitch";
import GithubLink from "./components/GithubLink";
function App() {
  return (
    <div className="App">
      <DarkSwitch />
      <GithubLink />
      <div className="main">
        <Content />
      </div>
    </div>
  );
}

export default App;
