"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import Icon from "@/components/ui/Icon";
import { normalizeDigits, validatePurchaseInput } from "@/lib/purchaseValidation";
import { COURSE } from "@/lib/course/catalog";

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
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstFieldRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isLoading) {
        onClose();
      }
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), a[href]'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen, isLoading, onClose]);

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
        setIsLoading(false);
        return;
      }

      window.location.href = payload.url;
    } catch {
      setError("Não foi possível iniciar o checkout.");
      setIsLoading(false);
    }
  }

  const isDisabled = isLoading;

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onClick={() => {
        if (!isLoading) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        className="dialog purchase-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="purchase-title"
        aria-describedby="purchase-description"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="dialog__close"
          onClick={onClose}
          aria-label="Fechar"
          disabled={isLoading}
        >
          <Icon name="close" size={18} />
        </button>

        <p className="eyebrow">{COURSE.eyebrow}</p>
        <h2 id="purchase-title" className="purchase-dialog__title display">
          Comprar o curso
        </h2>
        <p id="purchase-description" className="purchase-dialog__text">
          Preencha seus dados para seguir ao pagamento seguro. Após a confirmação, você recebe
          por e-mail o link para criar sua senha e acessar a área do aluno.
        </p>

        <form className="purchase-dialog__form" onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label className="field__label" htmlFor="purchase-name">
              Nome completo
            </label>
            <input
              ref={firstFieldRef}
              id="purchase-name"
              className="input"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={isDisabled}
            />
          </div>

          <div className="field">
            <label className="field__label" htmlFor="purchase-email">
              E-mail
            </label>
            <input
              id="purchase-email"
              className="input"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={isDisabled}
            />
            <span className="field__hint">Será o seu login na área do aluno.</span>
          </div>

          <div className="purchase-dialog__row">
            <div className="field">
              <label className="field__label" htmlFor="purchase-cpf">
                CPF
              </label>
              <input
                id="purchase-cpf"
                className="input"
                inputMode="numeric"
                placeholder="Somente números"
                value={cpf}
                onChange={(event) => setCpf(normalizeDigits(event.target.value))}
                maxLength={11}
                required
                disabled={isDisabled}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="purchase-phone">
                Telefone com DDD
              </label>
              <input
                id="purchase-phone"
                className="input"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="Somente números"
                value={phone}
                onChange={(event) => setPhone(normalizeDigits(event.target.value))}
                maxLength={11}
                required
                disabled={isDisabled}
              />
            </div>
          </div>

          {error ? (
            <div className="alert alert--error" role="alert">
              <Icon name="alert" size={18} />
              <span>
                {error}
                {error.includes("Faça login") ? (
                  <>
                    {" "}
                    <Link href="/login" className="text-link">
                      Ir para o login
                    </Link>
                  </>
                ) : null}
              </span>
            </div>
          ) : null}

          <button type="submit" className="btn btn--primary btn--lg btn--block" disabled={isDisabled}>
            {isLoading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Redirecionando para o pagamento…
              </>
            ) : (
              <>
                Ir para o pagamento seguro
                <Icon name="arrowRight" size={18} />
              </>
            )}
          </button>

          <p className="purchase-dialog__secure">
            <Icon name="shield" size={16} />
            Pagamento processado pela Stripe. Seus dados de cartão não passam pelo HPE.
          </p>
        </form>
      </div>
    </div>
  );
}
