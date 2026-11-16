export const SITE_NAME = "HPE Brazil — High Performance English";
export const SITE_SHORT_NAME = "HPE Brazil";
export const SITE_DESCRIPTION =
  "Treinamento personalizado em Business English para executivos, empreendedores e profissionais que precisam apresentar, negociar, vender e liderar em inglês.";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.hpebrazil.com.br").replace(/\/$/, "");

const WHATSAPP_NUMBER = "5582999214182";

export const INSTAGRAM_URL = "https://www.instagram.com/peterfocke/";

export function whatsappLink(message?: string) {
  const base = `https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}`;
  return message ? `${base}&text=${encodeURIComponent(message)}` : base;
}

export const CONTACT_MESSAGES = {
  needsAnalysis:
    "Olá, Peter! Gostaria de agendar uma análise de necessidades para um treinamento de Business English.",
  general: "Olá, Peter! Gostaria de conversar sobre o treinamento de Business English do HPE.",
  company:
    "Olá, Peter! Gostaria de conversar sobre um programa de Business English para a minha empresa.",
  support: "Olá! Sou aluno do curso digital HPE e preciso de ajuda com a área do aluno.",
  program: (program: string) =>
    `Olá, Peter! Tenho interesse no programa "${program}" do HPE e gostaria de mais informações.`,
};
