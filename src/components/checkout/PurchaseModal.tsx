"use client";

import { FormEvent, useMemo, useState } from "react";
import { normalizeDigits, validatePurchaseInput } from "@/lib/purchaseValidation";

type PurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function PurchaseModal({ isOpen, onClose }: PurchaseModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isDisabled = useMemo(() => isLoading || !isOpen, [isLoading, isOpen]);

  if (!isOpen) {
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validation = validatePurchaseInput({ name, email, cpf, phone });
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.data),
      });

      const payload = (await response.json()) as { error?: string; url?: string };

      if (!response.ok || !payload.url) {
        setError(payload.error ?? "Não foi possível iniciar o checkout.");
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError("Não foi possível iniciar o checkout.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="checkout-modal-overlay" role="presentation" onClick={onClose}>
      <div className="checkout-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="checkout-modal-close" onClick={onClose}>
          ×
        </button>
        <h2>Quero comprar o curso</h2>
        <p>Preencha seus dados para continuar para o checkout seguro.</p>

        <form className="checkout-modal-form" onSubmit={handleSubmit}>
          <label htmlFor="purchase-name">Nome completo</label>
          <input
            id="purchase-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={isDisabled}
          />

          <label htmlFor="purchase-email">E-mail</label>
          <input
            id="purchase-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isDisabled}
          />

          <label htmlFor="purchase-cpf">CPF</label>
          <input
            id="purchase-cpf"
            value={cpf}
            onChange={(event) => setCpf(normalizeDigits(event.target.value))}
            maxLength={11}
            required
            disabled={isDisabled}
          />

          <label htmlFor="purchase-phone">Telefone</label>
          <input
            id="purchase-phone"
            value={phone}
            onChange={(event) => setPhone(normalizeDigits(event.target.value))}
            maxLength={11}
            required
            disabled={isDisabled}
          />

          <button type="submit" className="primary-button" disabled={isDisabled}>
            {isLoading ? "Redirecionando..." : "Ir para pagamento"}
          </button>
          {error ? <p className="form-error">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}
