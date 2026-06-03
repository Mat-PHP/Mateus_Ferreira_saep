interface NavBarProps {
  username: string;
  activePage: string;
  onNavigate: (page: "dashboard" | "products" | "stock") => void;
  onLogout: () => void;
}

export default function NavBar({ username, activePage, onNavigate, onLogout }: NavBarProps) {
  return (
    <aside className="navbar">
      <div className="title">
        <h1>SAEP</h1>
        <p>Gestão de estoque e movimentações</p>
      </div>
      <div>
        <strong>Usuário:</strong>
        <p>{username}</p>
      </div>
      <nav>
        <button className={activePage === "dashboard" ? "primary" : "secondary"} onClick={() => onNavigate("dashboard")}>Dashboard</button>
        <button className={activePage === "products" ? "primary" : "secondary"} onClick={() => onNavigate("products")}>Cadastro de Produto</button>
        <button className={activePage === "stock" ? "primary" : "secondary"} onClick={() => onNavigate("stock")}>Gestão de Estoque</button>
        <button className="danger" onClick={onLogout}>Logout</button>
      </nav>
    </aside>
  );
}
