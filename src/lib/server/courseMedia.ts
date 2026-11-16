import "server-only";
import { getFirebaseAdmin } from "@/lib/firebaseAdmin";

/**
 * Mídia do curso (server-only). Nunca importe este arquivo em componentes de cliente.
 *
 * `legacyUrl` são as URLs públicas com token de download que ficavam no bundle do
 * navegador. Elas continuam aqui apenas como fallback caso a assinatura de URLs
 * falhe. Depois de confirmar que as URLs assinadas funcionam em produção, revogue os
 * tokens antigos no console do Firebase Storage (cada arquivo › "Access token" ›
 * revogar), pois eles já foram expostos publicamente.
 */
type LessonMediaSource = {
  video: string;
  material: string;
};

const MEDIA: Record<string, LessonMediaSource> = {
  "module-01": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/primeiro%20contato%20em%20ingl%C3%AAs.mp4?alt=media&token=766619f0-f1bf-4682-8e95-e6a23c75a6cf",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/PRIMEIRO%20CONTATO%20EM%20INGL%C3%8AS.pdf?alt=media&token=ef28baba-81e0-464c-927d-6607bc2bb4da",
  },
  "module-02": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/perguntas%20inteligentes.mp4?alt=media&token=43c85598-767a-4cb1-967e-780669dd80bc",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/PERGUNTAS%20INTELIGENTES.pdf?alt=media&token=207d142d-b624-43e1-890c-bd8b012a1e01",
  },
  "module-03": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/an%C3%A1lise%20de%20necessidades.mp4?alt=media&token=3e73e0d9-0261-40bb-99b2-7b4bdffd5a81",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/AN%C3%81LISE%20DE%20NECESSIDADES.pdf?alt=media&token=f2c500ec-098a-403f-b9a4-514e4f68f1a6",
  },
  "module-04": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/vocabul%C3%A1rio%20espec%C3%ADfico.mp4?alt=media&token=22e02c47-eb23-4f95-abd0-c2117492483c",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/VOCABUL%C3%81RIO%20ESPEC%C3%8DFICO.pdf?alt=media&token=e8a06ba4-cd8b-40bd-b751-61c94251e5ab",
  },
  "module-05": {
    // O nome do arquivo no Storage contém "restauranre" (sic). Não renomear sem
    // atualizar o caminho aqui.
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/apresentar%20im%C3%B3veis%20e%20vocabul%C3%A1rio%20no%20restauranre.mp4?alt=media&token=3ac9e9f8-004f-4356-a127-303af09868d3",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/APRESENTAR%20IM%C3%93VEIS%20E%20VOCABUL%C3%81RIO%20NO%20RESTAURANTE.pdf?alt=media&token=c40dc003-eccb-43d8-8816-8dd29f7f3e95",
  },
  "bonus-01": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20primeiro%20contato%20em%20ingl%C3%AAs.mp4?alt=media&token=454f3c7e-3375-4bff-a41c-a3288630733f",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20PRIMEIRO%20CONTATO%20EM%20INGL%C3%8AS.pdf?alt=media&token=4e7c3445-bf8e-47f9-94e0-1c82e86d4974",
  },
  "bonus-02": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20perguntas%20inteligentes.mp4?alt=media&token=074765d0-08dd-458e-90bc-571396bb4dd8",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20PERGUNTAS%20INTELIGENTES.pdf?alt=media&token=767c4ea2-36f4-42a6-817d-bf9b1dae2c85",
  },
  "bonus-03": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20an%C3%A1lise%20de%20necessidades.mp4?alt=media&token=fe5e7ae3-e5e1-473c-8b54-24ea95bac650",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20AN%C3%81LISE%20DE%20NECESSIDADES.pdf?alt=media&token=9cba0794-ec9d-4190-aebb-4e9a45b5f238",
  },
  "bonus-04": {
    // O nome do arquivo no Storage contém "vocabulãrio" (sic).
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20vocabul%C3%A3rio%20espec%C3%ADfico.mp4?alt=media&token=23e96123-3620-4c28-bedb-df5e02d090a8",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20VOCABUL%C3%81RIO%20ESPEC%C3%8DFICO.pdf?alt=media&token=da3dbaee-ee71-40ab-8ed5-ffa64523e7ec",
  },
  "bonus-05": {
    video:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/bonus%20apresentar%20im%C3%B3veis%20e%20vocabul%C3%A1rio%20no%20restaurante.mp4?alt=media&token=df626b86-332a-42ee-ba50-67f42551d859",
    material:
      "https://firebasestorage.googleapis.com/v0/b/hpebrazil-be671.firebasestorage.app/o/BONUS%20-%20APRESENTAR%20IM%C3%93VEIS%20E%20VOCABUL%C3%81RIO%20NO%20RESTAURANTE.pdf?alt=media&token=1cc47b48-33aa-41cd-8f99-dd2e0efd8694",
  },
};

const SIGNED_URL_TTL_MS = 6 * 60 * 60 * 1000;

function parseStorageUrl(url: string) {
  const match = url.match(/\/v0\/b\/([^/]+)\/o\/([^?]+)/);
  if (!match) {
    return null;
  }
  return { bucket: match[1], path: decodeURIComponent(match[2]) };
}

async function signUrl(legacyUrl: string, downloadName?: string) {
  const parsed = parseStorageUrl(legacyUrl);
  if (!parsed) {
    return legacyUrl;
  }

  try {
    const { storage } = getFirebaseAdmin();
    const [signedUrl] = await storage
      .bucket(parsed.bucket)
      .file(parsed.path)
      .getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + SIGNED_URL_TTL_MS,
        ...(downloadName
          ? { responseDisposition: `inline; filename="${downloadName.replace(/"/g, "")}"` }
          : {}),
      });
    return signedUrl;
  } catch (error) {
    console.error("[course-media] Falha ao assinar URL; usando URL legada.", {
      path: parsed.path,
      message: (error as Error)?.message,
    });
    return legacyUrl;
  }
}

export async function getLessonMedia(lessonId: string) {
  const source = MEDIA[lessonId];
  if (!source) {
    return null;
  }

  const [videoUrl, materialUrl] = await Promise.all([
    signUrl(source.video),
    source.material ? signUrl(source.material) : Promise.resolve(""),
  ]);

  return {
    videoUrl,
    materialUrl,
    expiresAt: Date.now() + SIGNED_URL_TTL_MS,
  };
}
