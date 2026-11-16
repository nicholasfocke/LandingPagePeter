"use client";

import { useState, type InputHTMLAttributes, type KeyboardEvent } from "react";
import Icon from "@/components/ui/Icon";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
};

/** Campo de senha com exibir/ocultar e aviso de Caps Lock. */
export default function PasswordInput({ id, className = "", onKeyUp, ...rest }: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  function handleKey(event: KeyboardEvent<HTMLInputElement>) {
    setIsCapsLockOn(event.getModifierState?.("CapsLock") ?? false);
    onKeyUp?.(event);
  }

  return (
    <>
      <div className="field__control">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          className={`input input--with-action ${className}`}
          onKeyUp={handleKey}
          onKeyDown={(event) => setIsCapsLockOn(event.getModifierState?.("CapsLock") ?? false)}
          {...rest}
        />
        <button
          type="button"
          className="input-action"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={isVisible}
          aria-controls={id}
        >
          <Icon name={isVisible ? "eyeOff" : "eye"} size={20} />
        </button>
      </div>
      {isCapsLockOn ? (
        <span className="field__hint field__hint--warning" role="status">
          <Icon name="info" size={14} /> Caps Lock está ativado.
        </span>
      ) : null}
    </>
  );
}
