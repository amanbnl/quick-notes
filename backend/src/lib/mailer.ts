import * as SibApiV3Sdk from '@getbrevo/brevo';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

const getBrevoApi = () => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is missing in .env");

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, apiKey);
  return apiInstance;
};

export const sendWelcomeEmail = async (email: string, name: string, activationLink: string) => {
  try {
    const templatePath = path.resolve(__dirname, '../templates/welcomeEmail.hbs');

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found at: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const htmlToSend = template({
      name: name,
      activation_link: activationLink,
    });
    await sendEmail("Welcome to iNotes - Activate your account!", htmlToSend, email, name)
    return
  } catch (error: any) {
    throw error;
  }
};

export const sendForgotPasswordEmail = async (email: string, name: string, reset_link: string) => {
  try {
    const templatePath = path.resolve(__dirname, '../templates/resetPassword.hbs');

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found at: ${templatePath}`);
    }

    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const htmlToSend = template({
      name,
      reset_link
    });
    await sendEmail("Forgot your password", htmlToSend, email, name)

  } catch (error) {
    throw error
  }
}

export const sendEmail = async (subject: string, htmlContent: string, toEmail: string, toName?: string) => {
  try {
    const apiInstance = getBrevoApi();

    // Ensure you are using the correct Class from the SDK
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    // Sender info from Environment variables
    sendSmtpEmail.sender = {
      name: process.env.SENDER_NAME || "iNotes",
      email: process.env.SENDER_EMAIL || "amandeep.singh@truinc.com"
    };

    // Corrected the 'to' array syntax and added optional name fallback
    sendSmtpEmail.to = [{
      email: toEmail,
      name: toName || toEmail.split('@')[0]
    }];

    // 'await' requires the function to be marked 'async'
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return result;
  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw error;
  }
};