import { FormEvent, useState } from "react";
import { register } from "../api";

interface RegisterPageProps {
  onRegister: (token: string, username: string) => void;
  onBack: () => void;
}

export default function RegisterPage({ onRegister, onBack }: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const response = await register(username, email, password, confirmPassword);
    setLoading(false);

    if (response.token) {
      setMessage("Cadastro realizado com sucesso. Entrando...");
      onRegister(response.token, response.username);
      return;
    }

    setError(response.detail || response.error || "Erro ao cadastrar usuário.");
  };

  return (
    <div className="login-card panel">
      <h1 className="section-title">Criar conta</h1>
      <p>Preencha os dados abaixo para cadastrar um novo usuário.</p>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-row">
        <label>
          Usuário
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Nome de usuário" required />
        </label>
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu e-mail" required />
        </label>
        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            required
          />
        </label>
        <label>
          Confirme a senha
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme a senha"
            required
          />
        </label>
        <div className="actions action-wrap">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
          <button type="button" className="secondary" onClick={onBack}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
