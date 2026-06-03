import { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProductsPage from "./pages/ProductsPage";
import StockPage from "./pages/StockPage";
import NavBar from "./components/NavBar";

type PageKey = "dashboard" | "products" | "stock" | "login" | "register" | "forgot";

function App() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [page, setPage] = useState<PageKey>("login");

  useEffect(() => {
    const storedToken = localStorage.getItem("saep_token");
    const storedUser = localStorage.getItem("saep_user");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUsername(storedUser);
      setPage("dashboard");
    }
  }, []);

  useEffect(() => {
    if (!token && page === "dashboard") {
      setPage("login");
    }
  }, [token, page]);

  const handleLogin = (tokenValue: string, userName: string) => {
    localStorage.setItem("saep_token", tokenValue);
    localStorage.setItem("saep_user", userName);
    setToken(tokenValue);
    setUsername(userName);
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("saep_token");
    localStorage.removeItem("saep_user");
    setToken("");
    setUsername("");
    setPage("login");
  };

  if (!token) {
    if (page === "register") {
      return <RegisterPage onRegister={handleLogin} onBack={() => setPage("login")} />;
    }
    if (page === "forgot") {
      return <ForgotPasswordPage onBack={() => setPage("login")} />;
    }
    return <LoginPage onLogin={handleLogin} onRegister={() => setPage("register")} onForgot={() => setPage("forgot")} />;
  }

  return (
    <div className="app-shell">
      <NavBar username={username} activePage={page} onNavigate={setPage} onLogout={handleLogout} />
      <main className="page-container">
        {page === "dashboard" && <DashboardPage token={token} username={username} />}
        {page === "products" && <ProductsPage token={token} onBack={() => setPage("dashboard")} />}
        {page === "stock" && <StockPage token={token} onBack={() => setPage("dashboard")} />}
      </main>
    </div>
  );
}

export default App;
