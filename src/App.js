import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Toaster } from "react-hot-toast";
import Menu from "./pages/Menu";
import User from "./pages/User";
import Admin from "./pages/Admin";
import StickyFooter from "./components/Footer";
import Header from "./components/Header";
import { useGetCurrentUser } from "./hooks/userQuery";
import Error from "./components/Error";

const theme = createTheme({
  typography: {
    fontFamily: "Noto Sans KR",
  },
});

function App() {
  const { isFetching } = useGetCurrentUser();

  if (isFetching) return <></>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Router>
        <main className="main">
          <Routes>
            <Route path="/" element={<Navigate to="/users/login" replace />} />
            <Route path="/users/:type" element={<User />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/menus/:mainCategory/:detailCategory/:tableNumber" element={<Menu />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </main>
      </Router>
      <StickyFooter />
      <Toaster position="bottom-center" reverseOrder={false} />
    </ThemeProvider>
  );
}

export default App;
