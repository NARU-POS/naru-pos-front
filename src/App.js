import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu/menu";

function App() {
  return (
    <div>
      <Router>
        <main className="main">
          <Routes>
            <Route path="/menus" element={<Menu />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
