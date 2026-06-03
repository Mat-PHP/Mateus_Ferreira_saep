const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000/api";

const headers = (token?: string) => {
  const base: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    base.Authorization = `Token ${token}`;
  }
  return base;
};

export async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ username, password }),
  });
  return response.json();
}

export async function register(username: string, email: string, password: string, confirmPassword: string) {
  const response = await fetch(`${API_URL}/auth/register/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ username, email, password, confirm_password: confirmPassword }),
  });
  return response.json();
}

export async function requestPasswordReset(email: string) {
  const response = await fetch(`${API_URL}/auth/password-reset/`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email }),
  });
  return response.json();
}

export async function fetchProducts(token: string, search = "") {
  const url = new URL(`${API_URL}/products/`);
  if (search) url.searchParams.set("search", search);
  const response = await fetch(url.toString(), {
    headers: headers(token),
  });
  return response.json();
}

export async function createProduct(token: string, data: unknown) {
  const response = await fetch(`${API_URL}/products/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function updateProduct(token: string, id: number, data: unknown) {
  const response = await fetch(`${API_URL}/products/${id}/`, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function deleteProduct(token: string, id: number) {
  const response = await fetch(`${API_URL}/products/${id}/`, {
    method: "DELETE",
    headers: headers(token),
  });
  return response;
}

export async function fetchStockMovements(token: string) {
  const response = await fetch(`${API_URL}/stock-movements/`, {
    headers: headers(token),
  });
  return response.json();
}

export async function submitStockMovement(token: string, data: unknown) {
  const response = await fetch(`${API_URL}/stock-movements/`, {
    method: "POST",
    headers: headers(token),
    body: JSON.stringify(data),
  });
  return response.json();
}
