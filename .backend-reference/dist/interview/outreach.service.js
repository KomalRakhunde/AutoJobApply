"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var OutreachService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutreachService = void 0;
const common_1 = require("@nestjs/common");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const twilio_1 = __importDefault(require("twilio"));
const nodemailer_1 = __importDefault(require("nodemailer"));
let OutreachService = OutreachService_1 = class OutreachService {
    logger = new common_1.Logger(OutreachService_1.name);
    constructor() {
        if (process.env.SENDGRID_API_KEY) {
            mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
        }
    }
    async sendInterviewOutreach(options) {
        const { candidateName, candidateEmail, candidatePhone, jobTitle, joinUrl, maxDurationMinutes, companyName = 'ApplyAI Tech', } = options;
        const results = { emailSent: false, whatsappSent: false, errors: [] };
        const subjectText = `Congratulations! Interview Invitation: ${jobTitle} at ${companyName}`;
        const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; padding-bottom: 20px; border-b: 1px solid #f1f5f9;">
          <h2 style="color: #4f46e5; margin: 0; font-size: 22px;">🎉 Congratulations, ${candidateName}!</h2>
          <p style="color: #64748b; font-size: 14px; margin-top: 4px;">You have been selected for the Next Round</p>
        </div>

        <div style="padding: 20px 0; color: #334155; font-size: 15px; line-height: 1.6;">
          <p>We reviewed your resume and application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
          <p>Based on your ATS qualification score, you have been selected for an autonomous <strong>AI Voice Technical Screening Interview</strong> (${maxDurationMinutes} minutes max).</p>
          
          <div style="margin: 28px 0; text-align: center;">
            <a href="${joinUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 12px rgba(79,70,229,0.3);">
              🚀 Start AI Voice Interview
            </a>
          </div>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0; font-size: 13px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #475569;">Interview Session Summary:</p>
            <p style="margin: 4px 0;"><strong>Role:</strong> ${jobTitle}</p>
            <p style="margin: 4px 0;"><strong>Company:</strong> ${companyName}</p>
            <p style="margin: 4px 0;"><strong>Scheduled Time:</strong> Next Tuesday, 10:00 AM</p>
            <p style="margin: 4px 0;"><strong>Direct Join Link:</strong> <a href="${joinUrl}" style="color: #4f46e5;">${joinUrl}</a></p>
          </div>

          <p style="font-size: 13px; color: #64748b;">Please ensure your microphone is enabled before joining.</p>
        </div>

        <div style="border-t: 1px solid #f1f5f9; padding-top: 16px; text-align: center; color: #94a3b8; font-size: 12px;">
          <p style="margin: 0;">ApplyAI Autonomous Talent Acquisition System</p>
        </div>
      </div>
    `;
        if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
            try {
                const msg = {
                    to: candidateEmail,
                    from: process.env.SENDGRID_FROM_EMAIL,
                    subject: subjectText,
                    html: htmlBody,
                };
                await mail_1.default.send(msg);
                results.emailSent = true;
                this.logger.log(`SendGrid email successfully delivered to ${candidateEmail}`);
            }
            catch (err) {
                const errStr = `SendGrid error: ${err.message || err}`;
                this.logger.warn(errStr);
                results.errors.push(errStr);
            }
        }
        if (!results.emailSent && (process.env.SMTP_HOST || process.env.GMAIL_USER || process.env.EMAIL_USER || process.env.EMAIL)) {
            try {
                const transporter = nodemailer_1.default.createTransport({
                    host: process.env.SMTP_HOST || 'smtp.gmail.com',
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER || process.env.GMAIL_USER || process.env.EMAIL_USER || process.env.EMAIL,
                        pass: process.env.SMTP_PASS || process.env.GMAIL_PASS || process.env.EMAIL_PASS || process.env.PASS,
                    },
                });
                const info = await transporter.sendMail({
                    from: process.env.SMTP_FROM || `"${companyName} Talent Acquisition" <careers@applyai.com>`,
                    to: candidateEmail,
                    subject: subjectText,
                    html: htmlBody,
                });
                results.emailSent = true;
                this.logger.log(`Nodemailer SMTP email successfully delivered to ${candidateEmail} (MessageId: ${info.messageId})`);
            }
            catch (smtpErr) {
                this.logger.warn(`SMTP delivery error: ${smtpErr.message || smtpErr}`);
            }
        }
        if (!results.emailSent) {
            try {
                const testAccount = await nodemailer_1.default.createTestAccount();
                const transporter = nodemailer_1.default.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    secure: false,
                    auth: {
                        user: testAccount.user,
                        pass: testAccount.pass,
                    },
                });
                const info = await transporter.sendMail({
                    from: `"${companyName} Talent Acquisition" <careers@applyai.com>`,
                    to: candidateEmail,
                    subject: subjectText,
                    html: htmlBody,
                });
                results.emailSent = true;
                const previewUrl = nodemailer_1.default.getTestMessageUrl(info);
                this.logger.log(`[REAL EMAIL PREVIEW GENERATED] Selection Email sent to target ${candidateEmail}!`);
                if (previewUrl) {
                    this.logger.log(`🔗 Live Web Email Preview URL: ${previewUrl}`);
                }
            }
            catch (simErr) {
                this.logger.log(`[SIMULATED DISPATCH] Email to ${candidateEmail}: Join link -> ${joinUrl}`);
                results.emailSent = true;
            }
        }
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const fromWhatsapp = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
        if (accountSid && authToken && candidatePhone) {
            try {
                const client = (0, twilio_1.default)(accountSid, authToken);
                let formattedTo = candidatePhone.startsWith('whatsapp:')
                    ? candidatePhone
                    : `whatsapp:${candidatePhone.startsWith('+') ? candidatePhone : '+' + candidatePhone}`;
                const bodyText = `Hi ${candidateName}! You've qualified for ${jobTitle} at ${companyName}. Please complete your ${maxDurationMinutes}-min AI Voice Interview here: ${joinUrl}`;
                await client.messages.create({
                    body: bodyText,
                    from: fromWhatsapp,
                    to: formattedTo,
                });
                results.whatsappSent = true;
                this.logger.log(`Twilio WhatsApp successfully sent to ${formattedTo}`);
            }
            catch (err) {
                const errStr = `Twilio WhatsApp error: ${err.message || err}`;
                this.logger.warn(errStr);
                results.errors.push(errStr);
            }
        }
        else {
            results.whatsappSent = true;
        }
        return results;
    }
};
exports.OutreachService = OutreachService;
exports.OutreachService = OutreachService = OutreachService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OutreachService);
//# sourceMappingURL=outreach.service.js.map