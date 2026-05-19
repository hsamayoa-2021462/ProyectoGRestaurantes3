import nodemailer from 'nodemailer';
import { config } from '../configs/config.js';

// Configurar el transportador de email (aligned with .NET SmtpSettings)
const createTransporter = () => {
  if (!config.smtp.username || !config.smtp.password) {
    console.warn(
      'SMTP credentials not configured. Email functionality will not work.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.enableSsl, // true para 465, false para 587
    auth: {
      user: config.smtp.username,
      pass: config.smtp.password,
    },
    // Evitar que las peticiones HTTP queden colgadas si SMTP no responde
    connectionTimeout: 10_000, // 10s
    greetingTimeout: 10_000, // 10s
    socketTimeout: 10_000, // 10s
    tls: {
      rejectUnauthorized: false,
    },
  });
};

const transporter = createTransporter();

export const sendVerificationEmail = async (email, name, verificationToken) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Verify your email address', // Aligned with .NET
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href='${verificationUrl}' style='background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
            Verify Email
        </a>
        <p>If you cannot click the link, copy and paste this URL into your browser:</p>
        <p>${verificationUrl}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Reset your password', // Aligned with .NET
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href='${resetUrl}' style='background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>
            Reset Password
        </a>
        <p>If you cannot click the link, copy and paste this URL into your browser:</p>
        <p>${resetUrl}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Welcome to AuthDotnet!', // Aligned with .NET
      html: `
        <h2>Welcome to AuthDotnet, ${name}!</h2>
        <p>Your account has been successfully verified and activated.</p>
        <p>You can now enjoy all the features of our platform.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Thank you for joining us!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordChangedEmail = async (email, name) => {
  if (!transporter) {
    throw new Error('SMTP transporter not configured');
  }

  try {
    const mailOptions = {
      from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
      to: email,
      subject: 'Password Changed Successfully', // More aligned with .NET style
      html: `
        <h2>Password Changed</h2>
        <p>Hello ${name},</p>
        <p>Your password has been successfully updated.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <p>This is an automated email, please do not reply to this message.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw error;
  }
};

export const sendFacturaEmail = async (pedido) => {
    if (!transporter) {
        throw new Error('SMTP transporter not configured');
    }

    // Obtener datos del usuario desde ms-auth
    let userEmail = null;
    let userName  = 'Cliente';
    try {
        const authUrl = process.env.MS_AUTH_URL || 'http://localhost:3005';
        const resp    = await fetch(`${authUrl}/api/v1/users/${pedido.usuario}`);
        if (resp.ok) {
            const data = await resp.json();
            userEmail  = data?.data?.email || data?.email;
            userName   = data?.data?.name  || data?.name || 'Cliente';
        }
    } catch (e) {
        console.warn('No se pudo obtener datos del usuario para email:', e.message);
    }

    if (!userEmail) {
        throw new Error(`No se encontró email para usuario ${pedido.usuario}`);
    }

    // Construir tabla de items
    const itemsHtml = (pedido.detalles || []).map(d => `
        <tr>
            <td style="padding:10px 16px;border-bottom:1px solid #1e2128;color:#f0ead8;font-size:14px;">
                ${d.plato?.nombre || 'Plato'}
            </td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e2128;color:#9a9385;font-size:14px;text-align:center;">
                x${d.cantidad || 1}
            </td>
            <td style="padding:10px 16px;border-bottom:1px solid #1e2128;color:#e8c96a;font-size:14px;text-align:right;font-family:'Georgia',serif;">
                Q ${Number(d.subtotal || d.precioUnitario * d.cantidad || 0).toFixed(2)}
            </td>
        </tr>
    `).join('');

    const fecha = new Date().toLocaleDateString('es-GT', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"></head>
    <body style="margin:0;padding:0;background:#07080a;font-family:'Helvetica Neue',Arial,sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#0d0f12;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.1);">

            <!-- Header -->
            <div style="background:linear-gradient(135deg,#0d0f12,#12151a);padding:32px;text-align:center;border-bottom:1px solid rgba(201,168,76,.2);">
                <div style="font-size:28px;color:#c9a84c;letter-spacing:4px;font-weight:300;">GASTRO</div>
                <div style="color:#5a554d;font-size:12px;letter-spacing:2px;margin-top:4px;text-transform:uppercase;">Factura de pedido</div>
            </div>

            <!-- Body -->
            <div style="padding:32px;">
                <p style="color:#9a9385;font-size:14px;margin:0 0 4px;">Hola, <strong style="color:#f0ead8;">${userName}</strong></p>
                <p style="color:#9a9385;font-size:14px;margin:0 0 24px;">Tu pedido ha sido entregado exitosamente. Aquí está el resumen de tu compra:</p>

                <!-- Info pedido -->
                <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:16px;margin-bottom:24px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:#5a554d;font-size:12px;">N° Pedido</span>
                        <span style="color:#e8c96a;font-size:12px;font-family:'Georgia',serif;">#${String(pedido._id).slice(-6).toUpperCase()}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:#5a554d;font-size:12px;">Restaurante</span>
                        <span style="color:#f0ead8;font-size:12px;">${pedido.restaurante?.nombre || '—'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:#5a554d;font-size:12px;">Tipo de entrega</span>
                        <span style="color:#f0ead8;font-size:12px;">${pedido.tipoEntrega === 'DOMICILIO' ? '🛵 A domicilio' : '🏪 Para recoger'}</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:#5a554d;font-size:12px;">Fecha</span>
                        <span style="color:#f0ead8;font-size:12px;">${fecha}</span>
                    </div>
                </div>

                <!-- Tabla items -->
                <table style="width:100%;border-collapse:collapse;border:1px solid rgba(255,255,255,.08);border-radius:10px;overflow:hidden;">
                    <thead>
                        <tr style="background:rgba(201,168,76,.08);">
                            <th style="padding:10px 16px;text-align:left;color:#c9a84c;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Plato</th>
                            <th style="padding:10px 16px;text-align:center;color:#c9a84c;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Cant.</th>
                            <th style="padding:10px 16px;text-align:right;color:#c9a84c;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;font-weight:400;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>${itemsHtml}</tbody>
                </table>

                <!-- Total -->
                <div style="margin-top:16px;padding:16px;background:rgba(201,168,76,.08);border:1px solid rgba(201,168,76,.2);border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
                    <span style="color:#9a9385;font-size:14px;">Total pagado</span>
                    <span style="color:#e8c96a;font-size:24px;font-family:'Georgia',serif;font-weight:500;">Q ${Number(pedido.total || 0).toFixed(2)}</span>
                </div>

                <p style="color:#5a554d;font-size:12px;margin-top:24px;text-align:center;">
                    ¡Gracias por tu compra! Esperamos verte pronto.
                </p>
            </div>

            <!-- Footer -->
            <div style="background:rgba(255,255,255,.02);border-top:1px solid rgba(255,255,255,.06);padding:20px;text-align:center;">
                <p style="color:#5a554d;font-size:11px;margin:0;">
                    Este es un correo automático, por favor no respondas a este mensaje.
                </p>
            </div>
        </div>
    </body>
    </html>`;

    const mailOptions = {
        from: `${config.smtp.fromName} <${config.smtp.fromEmail}>`,
        to: userEmail,
        subject: `🧾 Factura de tu pedido #${String(pedido._id).slice(-6).toUpperCase()} — Gastro`,
        html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email de factura enviado a ${userEmail}`);
};