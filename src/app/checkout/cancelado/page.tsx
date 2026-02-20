import Link from "next/link";

export default function CheckoutCanceledPage() {
  return (
    <main style={{ maxWidth: 800, margin: "48px auto", padding: "0 20px" }}>
      <h1>Pagamento cancelado</h1>
      <p>Seu pagamento não foi concluído. Se quiser, você pode tentar novamente.</p>
      <p>
        <Link href="/#catalogo">Voltar para a landing page</Link>
      </p>
    </main>
  );
}
