Instruções rápidas para enviar os arquivos gerados por e-mail.

1) Defina variáveis de ambiente com sua conta e senha (use App Password no Gmail):

PowerShell (temporário para a sessão):

```powershell
$env:EMAIL_USER = 'seu.email@gmail.com'
$env:EMAIL_PASS = 'SUA_APP_PASSWORD_AQUI'
```

Linux / macOS / CMD (temporário para a sessão):

```bash
export EMAIL_USER='seu.email@gmail.com'
export EMAIL_PASS='SUA_APP_PASSWORD_AQUI'
```

2) Execute o script para enviar para o e-mail do destinatário (exemplo):

```bash
python send_email.py --to MFERR7524@gmail.com
```

Observações:
- Para Gmail, habilite 2FA e crie uma App Password para usar como `EMAIL_PASS`.
- Se preferir usar outro servidor SMTP, defina `SMTP_SERVER` e `SMTP_PORT`.
- O script anexará `ENTREGA_REQUISITOS.docx` e `ENTREGA_REQUISITOS.pdf` por padrão.
