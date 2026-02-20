import { FirebaseError } from "firebase/app";

export function getFirebaseMessage(error: unknown) {
  if (!(error instanceof FirebaseError)) {
    return "Não foi possível concluir a operação agora. Tente novamente.";
  }

  const code = error.code;

  if (
    code === "auth/invalid-login-credentials" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password"
  ) {
    return "E-mail ou senha inválidos.";
  }

  if (code === "auth/invalid-credential") {
    return "Credenciais inválidas. Se acabou de comprar, verifique seu e-mail para criar sua senha antes do primeiro login.";
  }

  if (code === "auth/invalid-api-key") {
    return "Configuração do Firebase inválida. Verifique as variáveis NEXT_PUBLIC_FIREBASE_* no deploy.";
  }

  if (code === "firestore/permission-denied") {
    return "Seu usuário existe, mas não tem permissão para ler o perfil no Firestore. Ajuste as regras da coleção users.";
  }

  return "Não foi possível concluir a operação agora. Tente novamente.";
}
