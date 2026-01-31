import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";

const tenantId = process.env.TENANT_ID!;
const clientId = process.env.APPLICATION_ID!;
const clientSecret = process.env.CLIENT_SECRET_VALUE!;
const sharedMailbox = process.env.SHARED_MAILBOX_ADDRESS || "comm@dgconsult.gr";

// Create credential
const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

// Create Graph client
export const getGraphClient = () => {
    return Client.initWithMiddleware({
        authProvider: {
            getAccessToken: async () => {
                const token = await credential.getToken("https://graph.microsoft.com/.default");
                return token?.token || "";
            },
        },
    });
};

interface EmailOptions {
    to: string;
    subject: string;
    htmlContent: string;
    from?: string;
}

export async function sendEmail({ to, subject, htmlContent, from }: EmailOptions) {
    try {
        const client = getGraphClient();

        const message = {
            message: {
                subject,
                body: {
                    contentType: "HTML",
                    content: htmlContent,
                },
                toRecipients: [
                    {
                        emailAddress: {
                            address: to,
                        },
                    },
                ],
                from: from ? {
                    emailAddress: {
                        address: from,
                    },
                } : undefined,
            },
            saveToSentItems: true,
        };

        // Send email from shared mailbox
        await client
            .api(`/users/${sharedMailbox}/sendMail`)
            .post(message);

        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

// Email templates
export const getCustomerConfirmationEmail = (firstName: string, lastName: string) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; }
        .footer { background: #f9f9f9; padding: 20px 30px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
        .button { display: inline-block; padding: 12px 30px; background: #D32F2F; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
        .contact-info { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 28px;">DGCONSULT</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Business Solutions on Demand</p>
        </div>
        <div class="content">
          <h2 style="color: #D32F2F; margin-top: 0;">Ευχαριστούμε για το ενδιαφέρον σας!</h2>
          <p>Αγαπητέ/ή ${firstName} ${lastName},</p>
          <p>Λάβαμε το μήνυμά σας και σας ευχαριστούμε που επικοινωνήσατε με την DGCONSULT.</p>
          <p>Η ομάδα μας θα επικοινωνήσει μαζί σας εντός <strong>24 ωρών</strong> για να συζητήσουμε τις ανάγκες σας και να σας προτείνουμε την καλύτερη λύση.</p>
          
          <div class="contact-info">
            <h3 style="margin-top: 0; color: #333;">Στοιχεία Επικοινωνίας</h3>
            <p style="margin: 5px 0;"><strong>Διεύθυνση:</strong> Λεωφ. Κηφισού 48, Περιστέρι – 121 33</p>
            <p style="margin: 5px 0;"><strong>Τηλέφωνο:</strong> 210 5711581</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> comm@dgconsult.gr</p>
            <p style="margin: 5px 0;"><strong>Ώρες Λειτουργίας:</strong> Δευτέρα - Παρασκευή, 09:00 - 18:00</p>
          </div>

          <p>Για άμεση επικοινωνία, μπορείτε να μας καλέσετε στο <strong>210 5711581</strong>.</p>
          
          <p style="margin-top: 30px;">Με εκτίμηση,<br><strong>Η Ομάδα της DGCONSULT</strong></p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} DGCONSULT. All rights reserved.</p>
          <p style="margin: 5px 0;">Εξειδικευμένες λύσεις ψηφιακού μετασχηματισμού</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getAdminNotificationEmail = (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
}) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1A1A1A; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; }
        .field { margin: 15px 0; padding: 15px; background: #f9f9f9; border-left: 4px solid #D32F2F; border-radius: 4px; }
        .label { font-weight: bold; color: #D32F2F; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
        .value { color: #333; font-size: 16px; }
        .footer { background: #f9f9f9; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">🔔 Νέα Αίτηση Επικοινωνίας</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.8;">DGCONSULT Contact Form</p>
        </div>
        <div class="content">
          <p style="color: #D32F2F; font-weight: bold; font-size: 18px;">Νέο μήνυμα από την φόρμα επικοινωνίας</p>
          
          <div class="field">
            <div class="label">Όνομα</div>
            <div class="value">${data.firstName} ${data.lastName}</div>
          </div>

          <div class="field">
            <div class="label">Email</div>
            <div class="value"><a href="mailto:${data.email}" style="color: #D32F2F;">${data.email}</a></div>
          </div>

          ${data.phone ? `
          <div class="field">
            <div class="label">Τηλέφωνο</div>
            <div class="value"><a href="tel:${data.phone}" style="color: #D32F2F;">${data.phone}</a></div>
          </div>
          ` : ''}

          ${data.company ? `
          <div class="field">
            <div class="label">Εταιρεία</div>
            <div class="value">${data.company}</div>
          </div>
          ` : ''}

          <div class="field">
            <div class="label">Μήνυμα</div>
            <div class="value" style="white-space: pre-wrap;">${data.message}</div>
          </div>

          <p style="margin-top: 30px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
            <strong>⚡ Δράση Απαιτείται:</strong> Παρακαλώ απαντήστε εντός 24 ωρών.
          </p>
        </div>
        <div class="footer">
          <p style="margin: 5px 0;">Ημερομηνία: ${new Date().toLocaleString('el-GR', { timeZone: 'Europe/Athens' })}</p>
          <p style="margin: 5px 0;">DGCONSULT Contact Management System</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
