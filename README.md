# 1. Instale os pacotes Node (caso ainda não tenha feito)
npm install

# 2. Inicie o servidor do Vite
npm run dev


//Inicializando Back-end

1. Abra o terminal e navegue até a pasta do back-end:
   ```powershell
   cd backend
   ```

2. Crie o ambiente virtual (Venv):
   ```powershell
   python -m venv venv
   ```

3. Ative o ambiente virtual (No Windows/PowerShell):
   ```powershell
   .\venv\Scripts\Activate.ps1
   ```

4. Instale todas as dependências necessárias:
   ```powershell
   pip install -r requirements.txt
   ```

5. Execute as migrações do banco de dados:
   ```powershell
   python manage.py migrate
   ```

6. Inicie o servidor de desenvolvimento:
   ```powershell
   python manage.py runserver
   ```
