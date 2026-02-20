# Landing Page Peter

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

> Para o fluxo atual da aplicação, qualquer usuário autenticado no Firebase Authentication pode acessar `/videos`. Não é mais obrigatório documento em `users/{uid}` no Firestore.

## Deploy

No Vercel, configure as mesmas variáveis `NEXT_PUBLIC_FIREBASE_*` em **Project Settings > Environment Variables**.
