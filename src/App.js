import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Menu from "./pages/Menu/menu";

function App() {
  return (
    <div>
      <Router>
        {/* <Header /> */}
        <main className="main">
          <Routes>
            {/* <Route path="/" exact element={<Home />} /> */}
            <Route path="/menus" element={<Menu />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </Router>
    </div>
  );
}

export default App;
