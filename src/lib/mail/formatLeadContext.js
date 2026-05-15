const SOURCE_LABELS = {
  website: "Website",
  referral: "Referral",
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  walk_in: "Walk-in",
  phone: "Phone",
  email: "Email",
  other: "Other",
};

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal sent",
  negotiation: "Negotiation",
  won: "Won",
  lost: "Lost",
  dropped: "Dropped",
};

export function formatLeadSource(source) {
  if (!source) return "—";
  return SOURCE_LABELS[source] || source;
}

export function formatLeadStatus(status) {
  if (!status) return "—";
  return STATUS_LABELS[status] || status;
}

export function formatMoney(value) {
  if (value == null || value === "") return "—";
  const n = typeof value === "string" ? parseFloat(value) : Number(value);
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatDateISO(value) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTimeISO(value) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
