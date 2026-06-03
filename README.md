# 1. Instale os pacotes Node (caso ainda não tenha feito)
npm install

# 2. Inicie o servidor do Vite
npm run dev


//Inicializando Back-end

# 1. Garanta que está na pasta backend
cd backend

# 2. Crie o ambiente virtual
python -m venv venv

# 3. Ative o ambiente virtual (Como você está no PowerShell do Windows):
.\venv\Scripts\Activate.ps1

# 4. Instale as dependências
pip install -r requirements.txt

# 5. Rode as migrações e inicie o servidor
python manage.py migrate
python manage.py runserver
