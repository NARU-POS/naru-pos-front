import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import Menu from "./pages/Menu";
import StickyFooter from "./components/Footer";
import Header from "./components/Header";

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans KR",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Router>
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/menus/stake/unused" replace />} />
            <Route path="/menus/:mainCategory/:detailCategory" element={<Menu />} />
            <Route path="*" element={<Navigate to="/menus/stake/unused" replace />} />
          </Routes>
        </main>
      </Router>
      <StickyFooter />
      <Toaster position="bottom-center" reverseOrder={false} />
    </ThemeProvider>
  );
}

export default App;
