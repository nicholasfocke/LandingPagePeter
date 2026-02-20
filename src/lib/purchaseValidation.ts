const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type PurchaseInput = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
};

export function normalizeDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function validatePurchaseInput(input: PurchaseInput) {
  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const cpf = normalizeDigits(input.cpf);
  const phone = normalizeDigits(input.phone);

  if (name.length < 3) {
    return { isValid: false, message: "Informe seu nome completo." } as const;
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, message: "Informe um e-mail válido." } as const;
  }

  if (cpf.length !== 11) {
    return { isValid: false, message: "Informe um CPF com 11 dígitos." } as const;
  }

  if (phone.length < 10 || phone.length > 11) {
    return {
      isValid: false,
      message: "Informe um telefone com DDD (10 ou 11 dígitos).",
    } as const;
  }

  return {
    isValid: true,
    data: {
      name,
      email,
      cpf,
      phone,
    },
  } as const;
}
