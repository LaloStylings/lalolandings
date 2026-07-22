// Quote builder handler for Lalo Stylings.
// Receives the full 4-step brief in a single POST (occasion, looking for,
// vision, contact), validates name + email server-side, then delivers a
// formatted, readable brief by email through Resend (HTTP API, no SDK).
//
// Required environment variables:
//   RESEND_API_KEY      Resend API key
//   CONTACT_EMAIL_TO    destination inbox(es); comma-separated for multiple
//                       recipients (do NOT hardcode)
// Optional:
//   CONTACT_EMAIL_FROM  verified sender (defaults to the verified lalostylings.com
//                       domain sender below)

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

// Escape user-supplied text before it goes into HTML, so a field containing tags
// (or quotes, in an href) can't break the layout or inject markup.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Brand-styled HTML email. Table-based layout with inline styles only (Outlook
// ignores <style> and doesn't do flexbox/grid), system sans-serif, no webfonts or
// remote images. Empty fields (e.g. optional Phone) are skipped entirely.
function buildEmailHtml(data) {
  const clean = (name) =>
    typeof data[name] === "string" ? data[name].trim() : "";

  const nameEsc = escapeHtml(clean("name"));
  const emailEsc = escapeHtml(clean("email"));

  const FIELDS = [
    { key: "occasion", label: "Occasion" },
    { key: "lookingFor", label: "Looking for" },
    { key: "vision", label: "Vision", multiline: true },
    { key: "name", label: "Name" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Phone", type: "tel" },
  ];

  const cells = [];
  for (const f of FIELDS) {
    const raw = clean(f.key);
    if (!raw) continue; // skip empty rows (e.g. Phone when not provided)
    let value;
    if (f.type === "email") {
      value = `<a href="mailto:${escapeHtml(
        raw
      )}" style="color:#10271E;text-decoration:underline;">${escapeHtml(
        raw
      )}</a>`;
    } else if (f.type === "tel") {
      const tel = raw.replace(/[^\d+]/g, "");
      value = `<a href="tel:${escapeHtml(
        tel
      )}" style="color:#10271E;text-decoration:underline;">${escapeHtml(
        raw
      )}</a>`;
    } else if (f.multiline) {
      value = escapeHtml(raw).replace(/\r?\n/g, "<br>");
    } else {
      value = escapeHtml(raw);
    }
    cells.push({ label: f.label, value });
  }

  const rows = cells
    .map((c, i) => {
      const border =
        i < cells.length - 1 ? "border-bottom:1px solid #EAE4D9;" : "";
      return `<tr><td style="padding:14px 0;${border}"><div style="color:#A39E92;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;">${c.label}</div><div style="margin-top:5px;color:#2A2A28;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;">${c.value}</div></td></tr>`;
    })
    .join("");

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;padding:0;background:#FAF7F2;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FAF7F2;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:#FAF7F2;">
<tr><td style="background:#10271E;padding:24px;text-align:center;"><span style="color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;letter-spacing:0.28em;">LALO STYLINGS</span></td></tr>
<tr><td style="padding:32px 28px 8px;"><div style="color:#10271E;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;">New design request</div><div style="margin-top:6px;color:#10271E;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;">${nameEsc}</div></td></tr>
<tr><td style="padding:8px 28px 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table></td></tr>
<tr><td style="padding:24px 28px 32px;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="background:#10271E;border-radius:6px;"><a href="mailto:${emailEsc}" style="display:inline-block;padding:14px 30px;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;text-decoration:none;">Reply to ${nameEsc}</a></td></tr></table></td></tr>
<tr><td style="padding:0 28px 28px;text-align:center;"><div style="color:#A39E92;font-family:Arial,Helvetica,sans-serif;font-size:12px;">Sent from mkt.lalostylings.com</div></td></tr>
</table></td></tr></table>
</body></html>`;
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
  // CONTACT_EMAIL_TO is a comma-separated list. Split, trim, drop empties.
  // A single address without commas yields a one-element array, which is fine.
  const to = (process.env.CONTACT_EMAIL_TO || "")
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);
  const from =
    process.env.CONTACT_EMAIL_FROM ||
    "Lalo Stylings <noreply@lalostylings.com>";

  if (!apiKey || to.length === 0) {
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
        html: buildEmailHtml(data),
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
