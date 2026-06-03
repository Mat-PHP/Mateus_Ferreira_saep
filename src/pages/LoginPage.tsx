import { FormEvent, useState } from "react";
import { login } from "../api";

interface LoginPageProps {
  onLogin: (token: string, username: string) => void;
  onRegister: () => void;
  onForgot: () => void;
}

export default function LoginPage({ onLogin, onRegister, onForgot }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    const response = await login(username, password);
    setLoading(false);

    if (response.token) {
      onLogin(response.token, response.username);
      setMessage("Login realizado com sucesso.");
      return;
    }
    setError(response.detail || "Falha na autenticação. Verifique login e senha.");
  };

  return (
    <div className="login-card panel">
      <h1 className="section-title">SAEP</h1>
      <p>Seja bem-vindo, Mateus Ferreira Salustiano.</p>
      <p>Use seu usuário e senha para acessar o painel de estoque.</p>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-row">
        <label>
          Usuário
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Seu usuário"
            required
          />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Sua senha"
            required
          />
        </label>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
      <div className="actions login-actions">
        <button type="button" className="secondary" onClick={onForgot}>
          Esqueci minha senha
        </button>
        <button type="button" className="secondary" onClick={onRegister}>
          Criar conta
        </button>
      </div>
    </div>
  );
}
