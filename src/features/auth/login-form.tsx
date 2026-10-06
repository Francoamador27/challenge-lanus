"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordField } from "@/components/ui/password-field";
import { TextField } from "@/components/ui/text-field";
import { INITIAL_LOGIN_STATE, type LoginState } from "@/shared/auth";

export type LoginFormProps = {
  action: (state: LoginState, formData: FormData) => Promise<LoginState>;
  next?: string;
};

/** Email and password form bound to the login server action. */
export function LoginForm({ action, next }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL_LOGIN_STATE);
  return (
    <form action={formAction} noValidate className="flex flex-1 flex-col">
      {next && <input type="hidden" name="next" value={next} />}
      <div className="flex flex-col gap-5">
        <TextField
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Ingresá tu email"
          defaultValue={state.email}
          error={state.fieldErrors?.email}
          required
        />
        <PasswordField
          label="Contraseña"
          name="password"
          autoComplete="current-password"
          placeholder="Ingresá tu contraseña"
          error={state.fieldErrors?.password}
          required
        />
        <Checkbox name="remember" label="Recordarme" defaultChecked={state.remember} />
      </div>
      <div className="mt-auto flex flex-col gap-4 pt-10">
        {state.formError && (
          <p role="alert" className="rounded-input bg-danger-soft px-4 py-3 text-sm text-danger">
            {state.formError}
          </p>
        )}
        <Button type="submit" size="lg" fullWidth loading={pending}>
          {pending ? "Ingresando…" : "Ingresar"}
        </Button>
      </div>
    </form>
  );
}
