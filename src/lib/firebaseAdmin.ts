import "server-only";
import type { App } from "firebase-admin/app";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

type FirebaseAdminInstance = {
  auth: ReturnType<typeof getAuth>;
  db: ReturnType<typeof getFirestore>;
  FieldValue: typeof FieldValue;
};

let cachedAdmin: FirebaseAdminInstance | null = null;

function getFirebaseAdminJson() {
  const raw = process.env.FIREBASE_ADMIN_JSON;
  if (!raw) {
    throw new Error("FIREBASE_ADMIN_JSON não configurada.");
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("FIREBASE_ADMIN_JSON inválida.");
  }
}

function getOrCreateAdminApp() {
  const apps = getApps();
  if (apps.length > 0) {
    return apps[0] as App;
  }

  return initializeApp({
    credential: cert(getFirebaseAdminJson()),
  });
}

export function getFirebaseAdmin() {
  if (cachedAdmin) {
    return cachedAdmin;
  }

  const app = getOrCreateAdminApp();

  cachedAdmin = {
    auth: getAuth(app),
    db: getFirestore(app),
    FieldValue,
  };

  return cachedAdmin;
}
