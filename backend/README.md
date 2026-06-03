# Django Backend para SAEP

Este backend Django fornece a API esperada pelo frontend:
- POST `/api/auth/login/`
- POST `/api/auth/register/`
- POST `/api/auth/password-reset/`
- GET/POST `/api/products/`
- PUT/DELETE `/api/products/<id>/`
- GET/POST `/api/stock-movements/`

## Requisitos

- Python 3.11+ (ou compatível)
- pip

## Instalação

1. Abra o terminal na pasta do projeto:
   ```bash
   cd c:\Users\mferr\OneDrive\Desktop\SAEP\Mateus_Ferreira_saep\backend
   ```
2. Crie e ative virtualenv:
   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   ```
3. Instale dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Aplique migrações:
   ```bash
   python manage.py migrate
   ```
5. Crie um superusuário:
   ```bash
   python manage.py createsuperuser
   ```
6. Popule o banco de dados com dados de exemplo:
   ```bash
   python populate_db.py
   ```
7. Rode o servidor:
   ```bash
   python manage.py runserver
   ```

## Configuração do frontend

No diretório raiz do frontend, crie um arquivo `.env` com:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

Depois rode:

```bash
npm run dev
```

## Notas

- O backend usa autenticação por token DRF.
- Em `src/api.ts`, o frontend envia o header `Authorization: Token <token>`.
- O backend permite requisições CORS de qualquer origem para desenvolvimento.
