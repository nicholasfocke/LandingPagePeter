import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import CreatePasswordForm from "@/components/auth/CreatePasswordForm";

export const metadata: Metadata = {
  title: "Criar senha",
  robots: { index: false, follow: false },
};

export default function CreatePasswordPage() {
  return (
    <AuthShell
      asideTitle={
        <>
          Bem-vindo ao <em>HPE.</em>
        </>
      }
      asideItems={[
        "Crie sua senha para liberar a área do aluno.",
        "Entre com o mesmo e-mail usado na compra.",
        "Suas aulas e materiais ficam disponíveis logo em seguida.",
      ]}
    >
      <CreatePasswordForm />
    </AuthShell>
  );
}
