export type DummyContactInsert = {
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  notes: string | null;
  tags: string[];
};

const SAMPLE = [
  {
    name: "Ayesha Khan",
    email: "ayesha.khan@example.com",
    company: "BrightLabs",
    role: "Product Manager",
    tags: ["prospect", "product"],
  },
  {
    name: "Hassan Ali",
    email: "hassan.ali@example.com",
    company: "DevWorks",
    role: "CTO",
    tags: ["vip", "partner"],
  },
  {
    name: "Sara Ahmed",
    email: "sara.ahmed@example.com",
    company: "Nova Consulting",
    role: "Consultant",
    tags: ["customer"],
  },
  {
    name: "Bilal Sheikh",
    email: "bilal.sheikh@example.com",
    company: "FinPeak",
    role: "Founder",
    tags: ["prospect", "finance"],
  },
  {
    name: "Maryam Noor",
    email: "maryam.noor@example.com",
    company: "CloudNine",
    role: "Engineering Lead",
    tags: ["customer", "engineering"],
  },
];

export function makeDummyContacts(userId: string, count = 5): DummyContactInsert[] {
  const out: DummyContactInsert[] = [];

  for (let i = 0; i < Math.max(1, count); i++) {
    const s = SAMPLE[i % SAMPLE.length];

    out.push({
      user_id: userId,
      name: s.name,
      email: s.email,
      phone: null,
      company: s.company,
      role: s.role,
      notes: "Seeded dummy contact",
      tags: s.tags,
    });
  }

  return out;
}
