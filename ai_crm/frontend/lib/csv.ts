type CsvCell = string;

function splitCsvLine(line: string): CsvCell[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (ch === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      continue;
    }

    cur += ch;
  }

  out.push(cur);
  return out.map((c) => c.trim());
}

function escapeCsvCell(value: unknown): string {
  const s = (value ?? "").toString();
  if (s.includes('"') || s.includes(",") || s.includes("\n") || s.includes("\r")) {
    return `"${s.replaceAll('"', '""')}"`;
  }
  return s;
}

export type ContactCsvRow = {
  id?: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  role?: string | null;
  notes?: string | null;
  tags?: string[];
};

export type CsvParseResult = {
  rows: ContactCsvRow[];
  errors: Array<{ line: number; message: string }>;
};

const SUPPORTED_HEADERS = [
  "id",
  "name",
  "email",
  "phone",
  "company",
  "role",
  "notes",
  "tags",
] as const;

type SupportedHeader = (typeof SUPPORTED_HEADERS)[number];

function normalizeHeader(h: string): SupportedHeader | null {
  const key = h.trim().toLowerCase();
  return (SUPPORTED_HEADERS as readonly string[]).includes(key) ? (key as SupportedHeader) : null;
}

export function csvToContacts(csvText: string): CsvParseResult {
  const errors: CsvParseResult["errors"] = [];

  const lines = csvText
    .replaceAll("\r\n", "\n")
    .replaceAll("\r", "\n")
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { rows: [], errors: [{ line: 1, message: "Empty CSV" }] };
  }

  const headerCells = splitCsvLine(lines[0]);
  const headers = headerCells
    .map(normalizeHeader)
    .filter((h): h is SupportedHeader => !!h);

  if (!headers.includes("name")) {
    return {
      rows: [],
      errors: [{ line: 1, message: "Missing required header: name" }],
    };
  }

  const rows: ContactCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cells = splitCsvLine(lines[i]);
    const row: Record<string, string> = {};

    for (let j = 0; j < headerCells.length; j++) {
      const h = normalizeHeader(headerCells[j] ?? "");
      if (!h) continue;
      row[h] = cells[j] ?? "";
    }

    const name = (row.name ?? "").trim();
    if (!name) {
      errors.push({ line: i + 1, message: "Missing name" });
      continue;
    }

    const tagsRaw = (row.tags ?? "").trim();
    const tags = tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    rows.push({
      id: row.id?.trim() || undefined,
      name,
      email: row.email?.trim() || null,
      phone: row.phone?.trim() || null,
      company: row.company?.trim() || null,
      role: row.role?.trim() || null,
      notes: row.notes?.trim() || null,
      tags,
    });
  }

  return { rows, errors };
}

export type ContactExport = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  notes: string | null;
  tags: string[];
};

export function contactsToCsv(contacts: ContactExport[]): string {
  const header = SUPPORTED_HEADERS.join(",");
  const lines = contacts.map((c) => {
    const tags = (c.tags ?? []).join(",");
    return [
      escapeCsvCell(c.id),
      escapeCsvCell(c.name),
      escapeCsvCell(c.email ?? ""),
      escapeCsvCell(c.phone ?? ""),
      escapeCsvCell(c.company ?? ""),
      escapeCsvCell(c.role ?? ""),
      escapeCsvCell(c.notes ?? ""),
      escapeCsvCell(tags),
    ].join(",");
  });

  return [header, ...lines].join("\n") + "\n";
}
