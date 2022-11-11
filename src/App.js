import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./pages/Menu/menu";

function App() {
  return (
    <div>
      <Router>
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/menus" replace />} />
            <Route path="/menus" element={<Menu />} />
            <Route path="*" element={<Navigate to="/menus" replace />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
