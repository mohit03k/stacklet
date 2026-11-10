type Channel = "email" | "phone";

function consoleMode() {
  return process.env.NODE_ENV === "development" && process.env.OTP_DELIVERY === "console";
}

export function otpDeliveryConfigured(channel: Channel) {
  if (consoleMode()) return true;
  if (channel === "email") {
    return Boolean(process.env.BREVO_API_KEY && process.env.OTP_FROM_EMAIL);
  }
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER);
}

export async function sendOtp(channel: Channel, target: string, code: string) {
  if (consoleMode()) { // if dev mode just the log the otp 
    console.log(`[Development OTP] ${channel}: ${code}`);
    return;
  }

  const message = `Your Stacklet verification code is ${code}. It expires in 5 minutes.`;
  let response;
  if (channel === "email") {
    response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": process.env.BREVO_API_KEY! },
      body: JSON.stringify({
        sender: { name: "Stacklet", email: process.env.OTP_FROM_EMAIL },
        to: [{ email: target }], subject: "Verify your Stacklet email", textContent: message,
      }),
      signal: AbortSignal.timeout(15000),
    });
  } else {
    response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
      },
      body: new URLSearchParams({ To: target, From: process.env.TWILIO_FROM_NUMBER!, Body: message }),
      signal: AbortSignal.timeout(15000),
    });
  }
  if (!response.ok) throw new Error("OTP delivery failed");
}
