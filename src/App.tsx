import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import DashBoard from "./pages";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashBoard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
