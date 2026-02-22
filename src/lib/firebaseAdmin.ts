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

function getServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Variáveis do Firebase Admin não configuradas corretamente: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL ou FIREBASE_PRIVATE_KEY."
    );
  }

  return {
    projectId,
    clientEmail,
    privateKey,
  };
}

function getOrCreateAdminApp() {
  const apps = getApps();

  if (apps.length > 0) {
    return apps[0] as App;
  }

  return initializeApp({
    credential: cert(getServiceAccount()),
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