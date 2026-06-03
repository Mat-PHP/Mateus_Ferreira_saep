import { FormEvent, useEffect, useState } from "react";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "../api";

interface ProductsPageProps {
  token: string;
  onBack: () => void;
}

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
};

type ProductForm = {
  name: string;
  description: string;
  price: number;
};

const initialForm: ProductForm = {
  name: "",
  description: "",
  price: 0,
};

export default function ProductsPage({ token, onBack }: ProductsPageProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    const response = await fetchProducts(token, search);
    if (Array.isArray(response)) {
      setProducts(response);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [token]);

  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    await loadProducts();
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!form.name.trim()) {
      setError("O nome do produto é obrigatório.");
      return;
    }

    const body = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
    };

    const response = editingId
      ? await updateProduct(
          token,
          editingId,
          {
            ...body,
            quantity: products.find((item) => item.id === editingId)?.quantity ?? 0,
          },
        )
      : await createProduct(token, body);

    if (response.id) {
      setMessage(editingId ? "Produto atualizado." : "Produto criado.");
      setForm(initialForm);
      setEditingId(null);
      await loadProducts();
      return;
    }

    setError(response.detail || "Erro ao salvar produto.");
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
    });
  };

  // 🛑 VERSÃO CORRIGIDA: EXCLUI O PRODUTO E ZERA O HISTÓRICO SEM ERRO DE TYPESCRIPT
  const handleDelete = async (id: number, name: string) => {
    const confirmar = window.confirm(
      `Tem certeza que deseja excluir o produto "${name}"? Isso vai ZERAR e APAGAR todas as movimentações vinculadas a ele permanentemente!`
    );

    if (!confirmar) return;

    setError(null);
    setMessage(null);
    
    // O Django trata o ON DELETE CASCADE e zera as movimentações por baixo dos panos
    await deleteProduct(token, id);
    
    await loadProducts();
    setMessage("Produto excluído e histórico zerado com sucesso.");
    alert("Produto e histórico de movimentações apagados com sucesso!");
  };

  return (
    <div className="page-grid">
      <section className="panel">
        <div className="actions" style={{ justifyContent: "space-between" }}>
          <div>
            <h1 className="section-title">Cadastro de Produto</h1>
            <p>Gerencie itens, valores e quantidades de estoque.</p>
          </div>
          <button className="secondary" onClick={onBack}>Voltar</button>
        </div>
        {message && <div className="message success">{message}</div>}
        {error && <div className="message error">{error}</div>}

        <form onSubmit={handleSearch} className="actions">
          <input
            placeholder="Buscar produto por nome"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="primary">Buscar</button>
        </form>
      </section>

      <section className="panel">
        <h2>{editingId ? "Editar produto" : "Novo produto"}</h2>
        <form onSubmit={handleSubmit} className="form-row">
          <label>
            Nome
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Descrição
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </label>
          <div className="grid-2">
            <label>
              Preço
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              />
            </label>
            <div className="readonly-field">
              <label>
                Quantidade inicial
                <input type="number" value={0} readOnly />
              </label>
              <small>O estoque começa zerado e é atualizado por movimentações.</small>
            </div>
          </div>
          <div className="actions action-wrap">
            <button type="submit" className="primary">{editingId ? "Salvar" : "Cadastrar"}</button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setForm(initialForm);
                setEditingId(null);
                setError(null);
              }}
            >
              Limpar
            </button>
          </div>
        </form>
      </section>

      <section className="panel">
        <h2>Produtos cadastrados</h2>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>R$ {Number(product.price).toFixed(2)}</td>
                <td>{product.quantity}</td>
                <td className="actions action-row">
                  <button className="secondary" onClick={() => handleEdit(product)}>
                    Editar
                  </button>
                  <button className="danger" onClick={() => handleDelete(product.id, product.name)}>
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
