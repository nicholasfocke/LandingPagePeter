const DEFAULT_AFTER_LOGIN = "/videos";
const ALLOWED_PREFIXES = ["/videos", "/perfil"];

/**
 * Aceita apenas caminhos internos da área do aluno como destino pós-login,
 * evitando open redirect (`//evil.com`, `https://…`, `/\\evil.com`).
 */
export function getSafeNext(raw: string | null | undefined) {
  if (!raw) {
    return DEFAULT_AFTER_LOGIN;
  }

  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) {
    return DEFAULT_AFTER_LOGIN;
  }

  const path = raw.split(/[?#]/)[0];
  const isAllowed = ALLOWED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
  return isAllowed ? raw : DEFAULT_AFTER_LOGIN;
}

export function loginUrlFor(path: string, error?: "config" | "session") {
  const params = new URLSearchParams({ next: path });
  if (error) {
    params.set("error", error);
  }
  return `/login?${params.toString()}`;
}
