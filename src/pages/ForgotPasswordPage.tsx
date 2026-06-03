import { FormEvent, useState } from "react";
import { requestPasswordReset } from "../api";

interface ForgotPasswordPageProps {
  onBack: () => void;
}

export default function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const response = await requestPasswordReset(email);
    setLoading(false);

    if (response.detail) {
      setMessage(response.detail);
      return;
    }

    setError(response.error || "Erro ao solicitar redefinição de senha.");
  };

  return (
    <div className="login-card panel">
      <h1 className="section-title">Recuperar senha</h1>
      <p>Informe o e-mail cadastrado para receber a senha temporária.</p>
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}
      <form onSubmit={handleSubmit} className="form-row">
        <label>
          E-mail
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Seu e-mail cadastrado"
            required
          />
        </label>
        <div className="actions action-wrap">
          <button type="submit" className="primary" disabled={loading}>
            {loading ? "Enviando..." : "Enviar instruções"}
          </button>
          <button type="button" className="secondary" onClick={onBack}>
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
}
