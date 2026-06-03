import { FormEvent, useEffect, useState } from "react";
import { fetchProducts, fetchStockMovements, submitStockMovement } from "../api";

interface Product {
  id: number;
  name: string;
  quantity: number;
}

interface StockPageProps {
  token: string;
  onBack: () => void;
}

export default function StockPage({ token, onBack }: StockPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | "">("");
  const [movementType, setMovementType] = useState("IN");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    const fetched = await fetchProducts(token);
    if (Array.isArray(fetched)) {
      setProducts(fetched.sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  const loadHistory = async () => {
    const fetched = await fetchStockMovements(token);
    if (Array.isArray(fetched)) {
      setHistory(fetched);
    }
  };

  useEffect(() => {
    loadProducts();
    loadHistory();
  }, [token]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!selectedProduct) {
      setError("Selecione um produto para movimentar.");
      return;
    }
    if (quantity <= 0) {
      setError("Quantidade deve ser maior que zero.");
      return;
    }

    const response = await submitStockMovement(token, {
      product: selectedProduct,
      movement_type: movementType,
      quantity,
      note,
    });

    if (response.detail) {
      setError(response.detail);
      return;
    }

    setMessage("Movimentação registrada com sucesso.");
    setNote("");
    setQuantity(1);
    await loadProducts();
    await loadHistory();
  };

  const selected = products.find((item) => item.id === selectedProduct);

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="section-title">Gestão de Estoque</h1>
            <p>Registre entradas e saídas com histórico instantâneo.</p>
          </div>
          <button className="secondary" onClick={onBack}>Voltar</button>
        </div>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSubmit} className="form-row">
          <label>
            Produto
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(Number(e.target.value) || "")}>
              <option value="">Selecione</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tipo de movimentação
            <select value={movementType} onChange={(e) => setMovementType(e.target.value)}>
              <option value="IN">Entrada</option>
              <option value="OUT">Saída</option>
            </select>
          </label>
          <label>
            Quantidade
            <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </label>
          <label>
            Observações
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nota opcional" />
          </label>
          <div className="actions action-wrap">
            <button type="submit" className="primary">Registrar movimentação</button>
          </div>
        </form>
      </section>

      {selected && (
        <section className="panel stock-summary">
          <h2>Produto selecionado</h2>
          <p><strong>Nome:</strong> {selected.name}</p>
          <p><strong>Estoque atual:</strong> {selected.quantity}</p>
        </section>
      )}

      <section className="panel">
        <h2>Histórico de movimentações</h2>
        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Nota</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id}>
                <td>{item.product_name}</td>
                <td>{item.movement_type === "IN" ? "Entrada" : "Saída"}</td>
                <td>{item.quantity}</td>
                <td>{item.note || "-"}</td>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
