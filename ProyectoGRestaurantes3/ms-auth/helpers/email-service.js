import { config } from '../configs/config.js';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendBrevoEmail = async ({ to, subject, html }) => {
  if (!process.env.BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not configured');
  }

  const response = await fetch(BREVO_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: {
        name: 'ProyectoGRestaurantes3',
        email: process.env.BREVO_SENDER_EMAIL || 'onboarding@resend.dev',
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }

  return response.json();
};

export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-email?token=${verificationToken}`;

    await sendBrevoEmail({
      to: email,
      subject: 'Verify your email address',
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
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const frontendUrl = config.app.frontendUrl || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    await sendBrevoEmail({
      to: email,
      subject: 'Reset your password',
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
    });
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  try {
    await sendBrevoEmail({
      to: email,
      subject: 'Welcome to AuthDotnet!',
      html: `
        <h2>Welcome to AuthDotnet, ${name}!</h2>
        <p>Your account has been successfully verified and activated.</p>
        <p>You can now enjoy all the features of our platform.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Thank you for joining us!</p>
      `,
    });
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

export const sendPasswordChangedEmail = async (email, name) => {
  try {
    await sendBrevoEmail({
      to: email,
      subject: 'Password Changed Successfully',
      html: `
        <h2>Password Changed</h2>
        <p>Hello ${name},</p>
        <p>Your password has been successfully updated.</p>
        <p>If you didn't make this change, please contact our support team immediately.</p>
        <p>This is an automated email, please do not reply to this message.</p>
      `,
    });
  } catch (error) {
    console.error('Error sending password changed email:', error);
    throw error;
  }
};