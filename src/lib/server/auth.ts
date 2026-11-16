import "server-only";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

export type AuthenticatedUser = {
  uid: string;
  email: string;
  name: string;
};

function getBearerToken(request: Request) {
  const authHeader = request.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return "";
  }
  return authHeader.slice("Bearer ".length).trim();
}

/** Valida o ID token do Firebase enviado no header Authorization. */
export async function getAuthenticatedUser(request: Request): Promise<AuthenticatedUser | null> {
  const token = getBearerToken(request);
  if (!token) {
    return null;
  }

  try {
    const { auth } = getFirebaseAdmin();
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: (decoded.email ?? "").toLowerCase(),
      name: typeof decoded.name === "string" ? decoded.name : "",
    };
  } catch {
    return null;
  }
}
