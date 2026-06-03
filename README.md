# 🚀 Mateus Ferreira - SAEP Project

Este é um projeto full-stack desenvolvido para a avaliação do SAEP. A aplicação consiste em um ecossistema completo contendo um front-end moderno em TypeScript e um back-end robusto em Python.


## 💻 Como Executar o Projeto

Certifique-se de ter o **Node.js** e o **Python** instalados em sua máquina antes de iniciar.

### 🔌 1. Inicializando o Back-end (Django)

1. Abra o terminal e navegue até a pasta do back-end:
   ```powershell
   cd backend
   ```

2. Crie o ambiente virtual (Venv):
   ```powershell
   python -m venv env
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
   > O servidor backend estará rodando em: `http://127.0.0`

---

### 🎨 2. Inicializando o Front-end (Vite + TS)

Abra uma **nova janela de terminal** na raiz do projeto e siga os passos abaixo:

1. Instale os pacotes e dependências do Node:
   ```powershell
   npm install
   ```

2. Inicie o servidor de desenvolvimento do Vite:
   ```powershell
   npm run dev
   ```


