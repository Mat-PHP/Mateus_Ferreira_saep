import { useEffect, useState } from "react";
import { fetchProducts, fetchStockMovements } from "../api";

interface DashboardPageProps {
  token: string;
  username: string;
}

const getLastSevenLabels = () => {
  const labels = [];
  const now = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const day = new Date(now);
    day.setDate(now.getDate() - i);
    labels.push(day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }));
  }
  return labels;
};

export default function DashboardPage({ token, username }: DashboardPageProps) {
  const [productCount, setProductCount] = useState(0);
  const [movementCount, setMovementCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [movementSeries, setMovementSeries] = useState<number[]>(Array(7).fill(0));
  const [stockSeries, setStockSeries] = useState<number[]>([]);
  const [stockLabels, setStockLabels] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timer: number;

    async function refreshSummary() {
      setLoading(true);
      const products = await fetchProducts(token);
      const movements = await fetchStockMovements(token);
      const productList = Array.isArray(products) ? products : [];
      const movementList = Array.isArray(movements) ? movements : [];

      setProductCount(productList.length);
      setMovementCount(movementList.length);
      setLowStockCount(productList.filter((product) => product.quantity <= 3).length);
      setTotalValue(
        productList.reduce((sum, product) => sum + Number(product.price || 0) * Number(product.quantity || 0), 0),
      );

      const lastSeven = getLastSevenLabels();
      const movementCounts = Array(7).fill(0);
      const now = new Date();

      movementList.forEach((movement) => {
        if (!movement.timestamp) return;
        const date = new Date(movement.timestamp);
        const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diff >= 0 && diff < 7) {
          movementCounts[6 - diff] += 1;
        }
      });

      setMovementSeries(movementCounts);
      setStockLabels(lastSeven);
      setStockSeries(productList.slice(0, 5).map((product) => product.quantity));
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    }

    refreshSummary();
    timer = window.setInterval(refreshSummary, 8000);

    return () => window.clearInterval(timer);
  }, [token]);

  const maxMovement = Math.max(...movementSeries, 1);
  const maxStock = Math.max(...stockSeries, 1);

  return (
    <div className="page-grid">
      <section className="panel welcome-card">
        <div>
          <h1 className="section-title">Painel Principal</h1>
          <p>Seja bem-vindo, Mateus Ferreira Salustiano. O controle de almoxarifado está disponível abaixo.</p>
        </div>
        <div className="status-line">
          <span>{loading ? "Atualizando..." : `Última atualização: ${lastUpdated}`}</span>
          <span>Atualização a cada 8s</span>
        </div>
      </section>

      <div className="stats-grid">
        <article className="stat-card">
          <span className="stat-label">Produtos cadastrados</span>
          <strong>{productCount}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Movimentações</span>
          <strong>{movementCount}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Produtos com estoque baixo</span>
          <strong>{lowStockCount}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Valor total em estoque</span>
          <strong>R$ {totalValue.toFixed(2)}</strong>
        </article>
      </div>

      <section className="panel chart-card">
        <div className="chart-header">
          <h2>Movimentações dos últimos 7 dias</h2>
          <span>Contagem diária de entradas e saídas</span>
        </div>
        <div className="chart-area">
          {movementSeries.map((value, index) => (
            <div key={index} className="chart-bar-column">
              <div className="chart-bar" style={{ height: `${(value / maxMovement) * 100}%` }}>
                <span>{value}</span>
              </div>
              <span className="chart-label">{stockLabels[index]}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="panel chart-card">
        <div className="chart-header">
          <h2>Top 5 produtos por quantidade</h2>
          <span>Produtos com maior estoque atual</span>
        </div>
        <div className="mini-chart-area">
          {stockSeries.map((value, index) => (
            <div key={index} className="mini-chart-row">
              <span>Prod {index + 1}</span>
              <div className="mini-chart-bar" style={{ width: `${(value / maxStock) * 100}%` }}>
                <strong>{value}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
