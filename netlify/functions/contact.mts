import nodemailer from 'nodemailer'
import type { Config, Context } from '@netlify/functions'

const json = (message: string, status: number) =>
  Response.json({ message }, { status })

const escapeHtml = (value: FormDataEntryValue | null) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST') {
    return json('Method not allowed', 405)
  }

  try {
    const formData = await request.formData()
    const name = formData.get('name')
    const email = String(formData.get('email') ?? '')
    const company = formData.get('company')
    const message = formData.get('message')
    const token = String(formData.get('cf-turnstile-response') ?? '')

    if (!token) {
      return json('Invalid CAPTCHA', 400)
    }

    // Verify Turnstile using Cloudflare endpoint
    const verifyFormData = new FormData()
    verifyFormData.append('secret', String(process.env.TURNSTILE_SECRET_KEY))
    verifyFormData.append('response', token)
    if (context.ip) verifyFormData.append('remoteip', context.ip)

    const verify = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { body: verifyFormData, method: 'POST' },
    )
    const outcome = await verify.json()

    if (!outcome.success) {
      return json('Invalid CAPTCHA', 400)
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: process.env.SMTP_TO_EMAIL,
      replyTo: email,
      subject: `New message from ${email.replace(/[\r\n]/g, '')}`,
      html: `
        <p>Name: ${escapeHtml(name)}</p>
        <p>Email: ${escapeHtml(email)}</p>
        <p>Company: ${escapeHtml(company)}</p>
        <p>Message: ${escapeHtml(message).replace(/\n/g, '<br>')}</p>
      `,
    })

    return json('Email sent successfully', 200)
  } catch (error) {
    console.error('Error sending email:', error)
    return json('Failed to send email', 500)
  }
}

// Keep the same URL the contact form already posts to.
export const config: Config = {
  path: '/api/contact',
}
