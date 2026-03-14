import { Resend } from "resend";

// Lazy singleton — instantiated on first call, not at module load (avoids build-time errors)
let _resend: Resend | null = null;
const getResend = () => {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
};

export const sendConfirmationEmail = async ({
  to,
  confirmationUrl,
  name,
}: {
  to: string;
  confirmationUrl: string;
  name?: string;
}) => {
  const { data, error } = await getResend().emails.send({
    from: "Mike <hello@mikeprompt.com>",
    to,
    subject: "Witaj w MikePrompt! Potwierdź email 🧡",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: 'DM Sans', Arial, sans-serif; background: #FFF8F0; margin: 0; padding: 40px 20px;">
        <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">

          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; width: 56px; height: 56px; background: linear-gradient(135deg, #FF8A65, #FF6E40); border-radius: 16px; line-height: 56px; font-size: 28px; color: white; font-weight: 700; margin-bottom: 16px;">M</div>
            <div style="font-size: 22px; font-weight: 700; color: #2D2A26;">
              mike<span style="color: #FF6E40;">prompt</span>
            </div>
          </div>

          <h1 style="font-size: 24px; font-weight: 700; color: #2D2A26; margin: 0 0 12px; text-align: center;">
            ${name ? `Cześć ${name}! 👋` : "Witaj w MikePrompt! 👋"}
          </h1>

          <p style="font-size: 15px; color: #6B6560; line-height: 1.7; margin: 0 0 24px; text-align: center;">
            Super że jesteś! Kliknij poniżej aby potwierdzić email<br>i zacząć wypolerować swoje pierwsze prompty.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${confirmationUrl}"
                style="display: inline-block; background: linear-gradient(135deg, #FF6E40, #FF8A65); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 700; box-shadow: 0 4px 16px rgba(255,110,64,0.35);">
              Potwierdź email →
            </a>
          </div>

          <div style="background: #FFF8F0; border-radius: 12px; padding: 16px 20px; margin: 24px 0;">
            <p style="font-size: 13px; color: #A09890; margin: 0; line-height: 1.6;">
              🔒 <strong>Twoje prompty są bezpieczne.</strong> Nie przechowujemy treści bez Twojej zgody. Działa z ChatGPT, Claude, Gemini i każdym AI.
            </p>
          </div>

          <p style="font-size: 12px; color: #C0B8B0; text-align: center; margin: 24px 0 0; line-height: 1.6;">
            Jeśli nie zakładałeś konta w MikePrompt — zignoruj ten email.<br>
            Made with 🧡 in Warsaw, Poland
          </p>
        </div>
      </body>
      </html>
    `,
  });

  if (error) {
    console.error("[email] Resend error:", error);
    return { success: false, error };
  }

  console.log("[email] Sent confirmation to:", to, "id:", data?.id);
  return { success: true, data };
};

export const sendPasswordResetEmail = async ({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}) => {
  const { data, error } = await getResend().emails.send({
    from: "Mike <hello@mikeprompt.com>",
    to,
    subject: "Reset hasła — MikePrompt",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif; background: #FFF8F0; margin: 0; padding: 40px 20px;">
        <div style="max-width: 520px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 22px; font-weight: 700; color: #2D2A26;">mike<span style="color: #FF6E40;">prompt</span></span>
          </div>
          <h1 style="font-size: 22px; color: #2D2A26; text-align: center; margin-bottom: 12px;">Reset hasła</h1>
          <p style="color: #6B6560; text-align: center; line-height: 1.7; margin-bottom: 32px;">
            Ktoś (miejmy nadzieję że Ty 😊) poprosił o reset hasła dla tego konta.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #FF6E40, #FF8A65); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-size: 15px; font-weight: 700;">
              Ustaw nowe hasło →
            </a>
          </div>
          <p style="font-size: 12px; color: #C0B8B0; text-align: center; margin-top: 24px;">
            Jeśli to nie Ty — zignoruj tego emaila. Hasło pozostaje bez zmian.<br>
            Link wygasa za 1 godzinę.
          </p>
        </div>
      </body>
      </html>
    `,
  });

  if (error) console.error("[email] Reset email error:", error);
  return { success: !error, data, error };
};
