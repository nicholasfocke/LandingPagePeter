import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main style={{ maxWidth: 800, margin: "48px auto", padding: "0 20px" }}>
      <h1>Pagamento confirmado com sucesso!</h1>
      <p>
        Recebemos sua compra. Em instantes você receberá um e-mail com o link para
        criar sua senha e acessar a área do aluno.
      </p>
      <p>
        Após criar sua senha, faça login em <Link href="/login">/login</Link>.
      </p>
    </main>
  );
}
