"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { TextField, type TextFieldProps } from "./text-field";

/** Password input with a show/hide toggle. */
export function PasswordField(props: Omit<TextFieldProps, "type" | "trailing">) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      {...props}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label="Mostrar contraseña"
          aria-pressed={visible}
          className="grid size-11 shrink-0 place-items-center rounded-full text-subtle hover:text-ink"
        >
          {visible ? (
            <EyeOff aria-hidden className="size-5" />
          ) : (
            <Eye aria-hidden className="size-5" />
          )}
        </button>
      }
    />
  );
}
