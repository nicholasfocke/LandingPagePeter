# HPE Brazil — High Performance English

Landing institucional (Business English premium), checkout do curso digital (Stripe)
e área do aluno (Firebase Auth + Firestore + Storage).

## Estrutura

| Caminho | O que é |
| --- | --- |
| `src/app/page.tsx` + `src/components/landing/*` | Landing (server components + ilhas client) |
| `src/app/login`, `src/app/criar-senha`, `src/components/auth/*` | Autenticação |
| `src/app/(student)/videos` | Dashboard do aluno |
| `src/app/(student)/videos/aula/[lessonId]` | Player da aula |
| `src/app/(student)/perfil` | Perfil |
| `src/lib/course/catalog.ts` | Catálogo público do curso (**sem URLs de mídia**) |
| `src/lib/server/courseMedia.ts` | URLs dos vídeos/PDFs (server-only, URLs assinadas) |
| `src/lib/server/courseAccess.ts` | Regra de direito de acesso ao curso |
| `src/app/api/course/*` | Perfil + acesso + progresso; mídia da aula |
| `src/app/api/video-progress` | Progresso/anotações por aula (atualização parcial) |

## Acesso ao curso (validado no servidor)

O aluno só recebe as URLs dos vídeos se `GET /api/course/lessons/:id` confirmar:

1. `users/{uid}` com `purchasedCourse: true` (gravado pelo webhook do Stripe),
   **ou** `isActive: true` / `courseAccess: true` (liberação manual); **ou**
2. um documento em `payments` com o mesmo e-mail da conta.

> Alunos cadastrados manualmente sem nenhum desses campos verão "acesso não ativo".
> Para liberar, adicione `courseAccess: true` em `users/{uid}`.
> Emergência: `COURSE_ACCESS_ALLOW_ALL_AUTHENTICATED=true` restaura o comportamento
> antigo (qualquer usuário logado). Use apenas temporariamente.

## Mídia do curso

As URLs são assinadas (v4, 6 h) com a conta de serviço do Firebase Admin. Se a
assinatura falhar, a API usa a URL legada com token (ainda protegida pela regra de
acesso) e registra `[course-media]` nos logs.

**Ação recomendada:** as URLs com token estiveram no bundle público até esta versão.
Depois de confirmar em produção que os vídeos tocam via URL assinada, revogue os
tokens de download antigos no console do Firebase Storage (cada arquivo › Access
token › Revoke).

## Progresso

`users/{uid}/video_progress/{lessonId}` com `watchedSeconds`, `durationSeconds`,
`notes`, `completed`, `completedAt`, `updatedAt`. O player salva a cada 10 s, ao
pausar, ao terminar, ao trocar de aba e ao sair da página.

## Ambiente local

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Configuração Firebase (obrigatória para login)

Crie `.env.local` com as variáveis abaixo (mesmas chaves usadas no Vercel):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

> Se `NEXT_PUBLIC_FIREBASE_API_KEY` estiver inválida, o login sempre vai falhar com `400 INVALID_ARGUMENT: API key not valid`.

## O que precisa existir para o login funcionar

1. Usuário criado em **Authentication** (email/senha).
2. Documento no Firestore em **`users/{uid}`** (mesmo UID do Authentication).
3. Regras do Firestore permitindo que o usuário autenticado leia seu próprio documento.

Exemplo de regras:

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false;
    }
  }
}
```

Exemplo de documento `users/{uid}`:

```json
{
  "email": "aluno@email.com"
}
```


## Configuração de e-mail (obrigatória para recuperação de senha)

No Vercel, configure **uma** das opções abaixo:

### Opção recomendada (SMTP de produção)

```bash
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM_NAME=High Performance English
SMTP_FROM_EMAIL=contato@seudominio.com
```

> Para portas 465, use `SMTP_SECURE=true`. Para 587, use `SMTP_SECURE=false`.

### Opção alternativa (Gmail)

```bash
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-app-password
```

> No Gmail é obrigatório usar **App Password** (senha de app), não a senha normal da conta.

## Deploy

No Vercel, configure as mesmas variáveis `NEXT_PUBLIC_FIREBASE_*` em **Project Settings > Environment Variables**.


## Como testar se o envio de e-mail está funcionando

1. Garanta que estas variáveis estejam configuradas no Vercel (Production):
   - `FIREBASE_ADMIN_JSON`
   - `NEXT_PUBLIC_APP_URL`
   - SMTP (`SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM_EMAIL`) **ou** Gmail (`EMAIL_USER`, `EMAIL_PASS`)

2. Faça um teste direto da API:

```bash
curl -i -X POST https://SEU_DOMINIO/api/auth/forgot-password \
  -H "content-type: application/json" \
  -d '{"email":"seu-email@dominio.com"}'
```

3. Resultado esperado:
   - `200` com `{"ok":true}`
   - e-mail recebido em até alguns minutos

4. Se vier `500`, abra logs do deploy no Vercel e procure por:
   - `[forgot-password] Falha ao enviar e-mail de redefinição`

5. Erros comuns:
   - `FIREBASE_ADMIN_JSON não configurada/inválida`
   - autenticação SMTP inválida (`535`, `EAUTH`)
   - `SMTP_PORT` inválida
   - remetente bloqueado pelo provedor (`from` não autorizado)

6. Diagnóstico de redefinição de senha:
   - A API `/api/auth/set-password` retorna `requestId` em sucesso/erro.
   - Se falhar, copie o `código` exibido na tela e busque no Vercel Logs por `set-password][<requestId>]`.
