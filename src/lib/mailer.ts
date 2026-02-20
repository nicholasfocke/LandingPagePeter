import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  throw new Error("EMAIL_USER/EMAIL_PASS não configuradas.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

type AccessEmailInput = {
  to: string;
  name: string;
  setPasswordUrl: string;
  loginUrl: string;
};


type PasswordResetEmailInput = {
  to: string;
  name: string;
  resetPasswordUrl: string;
};

export async function sendPasswordResetEmail({
  to,
  name,
  resetPasswordUrl,
}: PasswordResetEmailInput) {
  await transporter.sendMail({
    from: `High Performance English <${emailUser}>`,
    to,
    subject: "Redefinir senha - High Performance English",
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
        <h2>Redefinição de senha</h2>
        <p>Olá, ${name}!</p>
        <p>Recebemos uma solicitação para alterar sua senha de acesso à área do aluno.</p>
        <p>
          <a href="${resetPasswordUrl}" style="display:inline-block;padding:10px 16px;background:#1f3c88;color:#fff;text-decoration:none;border-radius:8px;">
            Definir nova senha
          </a>
        </p>
        <p>Se você não solicitou essa alteração, ignore este e-mail.</p>
      </div>
    `,
  });
}

export async function sendCourseAccessEmail({
  to,
  name,
  setPasswordUrl,
  loginUrl,
}: AccessEmailInput) {
  await transporter.sendMail({
    from: `High Performance English <${emailUser}>`,
    to,
    subject: "Compra confirmada - Acesso ao curso",
    html: `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.5;">
        <h2>Pagamento confirmado 🎉</h2>
        <p>Olá, ${name}!</p>
        <p>Sua compra foi confirmada com sucesso. Agora, defina sua senha para acessar o curso.</p>
        <p>
          <a href="${setPasswordUrl}" style="display:inline-block;padding:10px 16px;background:#1f3c88;color:#fff;text-decoration:none;border-radius:8px;">
            Criar senha
          </a>
        </p>
        <p>Após criar sua senha, faça login por aqui: <a href="${loginUrl}">${loginUrl}</a></p>
        <p>Se você não solicitou esta compra, ignore este e-mail.</p>
      </div>
    `,
  });
}
