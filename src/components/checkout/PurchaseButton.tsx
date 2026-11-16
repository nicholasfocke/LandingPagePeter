"use client";

import { useCallback, useState, type ReactNode } from "react";
import PurchaseModal from "@/components/checkout/PurchaseModal";

type PurchaseButtonProps = {
  className?: string;
  children: ReactNode;
};

/** Botão que abre o fluxo real de compra (modal → /api/stripe/checkout-session → Stripe). */
export default function PurchaseButton({ className = "btn btn--primary", children }: PurchaseButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <button type="button" className={className} onClick={() => setIsOpen(true)}>
        {children}
      </button>
      <PurchaseModal isOpen={isOpen} onClose={close} />
    </>
  );
}
