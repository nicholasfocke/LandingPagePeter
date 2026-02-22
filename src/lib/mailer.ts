import nodemailer, { type Transporter } from "nodemailer";

type MailerConfig = {
  transporter: Transporter;
  from: string;
};

let cachedMailerConfig: MailerConfig | null = null;

function parseBoolean(value: string | undefined, fallback: boolean) {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function getMailerConfig(): MailerConfig {
  if (cachedMailerConfig) {
    return cachedMailerConfig;
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPortRaw = process.env.SMTP_PORT;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = parseBoolean(process.env.SMTP_SECURE, true);

  const gmailUser = process.env.EMAIL_USER;
  const gmailPass = process.env.EMAIL_PASS;

  const fromName = process.env.SMTP_FROM_NAME ?? "High Performance English";
  const fromEmail = process.env.SMTP_FROM_EMAIL ?? smtpUser ?? gmailUser;

  if (!fromEmail) {
    throw new Error(
      "Configuração de e-mail ausente. Defina SMTP_FROM_EMAIL ou SMTP_USER/EMAIL_USER."
    );
  }

  if (smtpHost && smtpPortRaw && smtpUser && smtpPass) {
    const smtpPort = Number(smtpPortRaw);
    if (Number.isNaN(smtpPort)) {
      throw new Error("SMTP_PORT inválida.");
    }

    cachedMailerConfig = {
      transporter: nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      }),
      from: `${fromName} <${fromEmail}>`,
    };

    return cachedMailerConfig;
  }

  if (gmailUser && gmailPass) {
    cachedMailerConfig = {
      transporter: nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPass,
        },
      }),
      from: `${fromName} <${fromEmail}>`,
    };

    return cachedMailerConfig;
  }

  throw new Error(
    "Nenhuma credencial de e-mail configurada. Defina SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS ou EMAIL_USER/EMAIL_PASS."
  );
}

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
  const { transporter, from } = getMailerConfig();

  await transporter.sendMail({
    from,
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
  const { transporter, from } = getMailerConfig();

  await transporter.sendMail({
    from,
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
