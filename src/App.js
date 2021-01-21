import logo from "./logo.svg";
import "./App.css";
import ReactTable from "./reactTable/react-table";
import { Spinner } from "react-bootstrap";
import Spinner1 from "./spinner/spinner";
import AutoSuggestion from "./auto-suggestion/autoSuggestion";
import Editor from "./editor/Editor";
import MentionExample from "./editor/Editor";

function App() {
  return (
    <div className="App">
      <MentionExample />
      {/* <AutoSuggestion /> */}
      {/* <ReactTable /> */}
      {/* <Spinner animation="grow" /> */}
      <Spinner1 color="#be97e8" />
    </div>
  );
}

export default App;
