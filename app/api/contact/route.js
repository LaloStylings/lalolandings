// Quote builder handler for Lalo Stylings.
// Receives the full 4-step brief in a single POST (occasion, looking for,
// vision, contact), validates name + email server-side, then delivers a
// formatted, readable brief by email through Resend (HTTP API, no SDK).
//
// Required environment variables:
//   RESEND_API_KEY      Resend API key
//   CONTACT_EMAIL_TO    destination inbox (do NOT hardcode)
// Optional:
//   CONTACT_EMAIL_FROM  verified sender, e.g. "Lalo Stylings <hello@lalostylings.com>"
//                       (defaults to Resend's onboarding sender for first-run testing)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The emailed brief, in order. Mirrors the 5-step quoteSteps schema; contact
// fields are validated. Keep in sync with app/components/quoteSteps.js.
const BRIEF_FIELDS = [
  { name: "occasion", label: "Occasion" },
  { name: "lookingFor", label: "Looking for" },
  { name: "vision", label: "Vision" },
];

const CONTACT_FIELDS = [
  { name: "name", label: "Name", required: true },
  {
    name: "email",
    label: "Email",
    required: true,
    validate: (v) => (EMAIL_RE.test(v) ? null : "Please enter a valid email."),
  },
  { name: "phone", label: "Phone", required: false },
];

function validate(data) {
  const errors = {};
  for (const field of CONTACT_FIELDS) {
    const value =
      typeof data[field.name] === "string" ? data[field.name].trim() : "";
    if (field.required && !value) {
      errors[field.name] = `${field.label} is required.`;
      continue;
    }
    if (value && field.validate) {
      const msg = field.validate(value);
      if (msg) errors[field.name] = msg;
    }
  }
  return errors;
}

function buildEmail(data) {
  const val = (name) =>
    typeof data[name] === "string" && data[name].trim()
      ? data[name].trim()
      : "Not specified";

  const brief = BRIEF_FIELDS.map((f) => `${f.label}: ${val(f.name)}`).join("\n");
  const contact = CONTACT_FIELDS.map((f) => `${f.label}: ${val(f.name)}`).join(
    "\n"
  );

  return `NEW DESIGN REQUEST\n\n${brief}\n\n${contact}\n`;
}

export async function POST(request) {
  let data;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const errors = validate(data);
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from =
    process.env.CONTACT_EMAIL_FROM || "Lalo Stylings <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.error(
      "[contact] Missing RESEND_API_KEY or CONTACT_EMAIL_TO environment variable."
    );
    return Response.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  const name = data.name.trim();

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: data.email.trim(),
        subject: `New design request: ${name}`,
        text: buildEmail(data),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("[contact] Resend error", res.status, detail);
      return Response.json(
        { error: "Could not send your request. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[contact] Network error", err);
    return Response.json(
      { error: "Could not send your request. Please try again." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
