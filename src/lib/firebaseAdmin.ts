/* eslint-disable @typescript-eslint/no-explicit-any */
let cachedAdmin: any = null;

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

function runtimeRequire(moduleName: string) {
  // Evita inclusão acidental de SDK Admin no client bundle.
  const req = eval("require");
  return req(moduleName);
}

export function getFirebaseAdmin() {
  if (cachedAdmin) {
    return cachedAdmin;
  }

  const adminAppModule = runtimeRequire("firebase-admin/app");
  const adminAuthModule = runtimeRequire("firebase-admin/auth");
  const adminFirestoreModule = runtimeRequire("firebase-admin/firestore");

  const { getApps, cert, initializeApp } = adminAppModule;
  const { getAuth } = adminAuthModule;
  const { getFirestore, FieldValue } = adminFirestoreModule;

  const firebaseAdminJson = getFirebaseAdminJson();
  const app = getApps().length
    ? getApps()[0]
    : initializeApp({
        credential: cert(firebaseAdminJson),
      });

  cachedAdmin = {
    auth: getAuth(app),
    db: getFirestore(app),
    FieldValue,
  };

  return cachedAdmin;
}
