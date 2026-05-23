import { createClient } from "npm:@insforge/sdk";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json" },
  });
}

async function readJson(req) {
  try {
    return await req.json();
  } catch {
    return null;
  }
}

function buildPrompt({ contact, interactions }) {
  const interactionLines = interactions
    .slice(0, 10)
    .map((i) => {
      const date = i.interaction_date ? new Date(i.interaction_date).toISOString() : "";
      const subject = i.subject ? ` (${i.subject})` : "";
      const content = (i.content ?? "").toString().slice(0, 500);
      return `- ${i.type}${subject} @ ${date}\n  ${content}`;
    })
    .join("\n");

  return [
    "You are an assistant for a personal CRM.",
    "Summarize the relationship with this contact based on the interaction history and suggest next actions.",
    "Return JSON only with this exact shape:",
    '{"summary":"...","next_actions":["..."],"relationship_status":"strong|needs_attention|new|dormant"}',
    "Rules:",
    "- summary: 2-3 sentences.",
    "- next_actions: 3-5 specific actions.",
    "- relationship_status: choose one of the allowed values.",
    "",
    `Contact: ${contact.name}`,
    `Company: ${contact.company ?? ""}`,
    `Role: ${contact.role ?? ""}`,
    `Email: ${contact.email ?? ""}`,
    "",
    `Recent interactions (${interactions.length}):`,
    interactionLines || "(none)",
  ].join("\n");
}

async function callOpenRouter(prompt) {
  const apiKey = Deno.env.get("OPENROUTER_API_KEY");
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in function environment");
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter error: ${res.status} ${body}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("Empty model response");
  }

  return content;
}

function parseModelJson(text) {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model did not return JSON");
    return JSON.parse(match[0]);
  }
}

export default async function (req) {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const authHeader = req.headers.get("Authorization");
  const userToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  const client = createClient({
    baseUrl: Deno.env.get("INSFORGE_BASE_URL"),
    edgeFunctionToken: userToken,
  });

  const { data: userData } = await client.auth.getCurrentUser();
  const userId = userData?.user?.id;

  if (!userId) {
    return json({ error: "Unauthorized" }, 401);
  }

  const body = await readJson(req);
  const contactId = body?.contact_id;

  if (typeof contactId !== "string" || !contactId) {
    return json({ error: "Missing contact_id" }, 400);
  }

  const { data: contact, error: cErr } = await client.database
    .from("contacts")
    .select("id,name,email,company,role")
    .eq("id", contactId)
    .eq("user_id", userId)
    .maybeSingle();

  if (cErr) return json({ error: cErr.message }, 400);
  if (!contact) return json({ error: "Contact not found" }, 404);

  const { data: interactions, error: iErr } = await client.database
    .from("interactions")
    .select("type,subject,content,interaction_date")
    .eq("contact_id", contactId)
    .eq("user_id", userId)
    .order("interaction_date", { ascending: false })
    .limit(25);

  if (iErr) return json({ error: iErr.message }, 400);

  const prompt = buildPrompt({
    contact,
    interactions: interactions ?? [],
  });

  let modelText;
  try {
    modelText = await callOpenRouter(prompt);
  } catch (e) {
    return json({ error: e?.message ?? "AI call failed" }, 500);
  }

  let parsed;
  try {
    parsed = parseModelJson(modelText);
  } catch (e) {
    return json(
      { error: e?.message ?? "Failed to parse AI response", raw: modelText },
      500
    );
  }

  const summary = typeof parsed.summary === "string" ? parsed.summary.trim() : "";
  const nextActions = Array.isArray(parsed.next_actions)
    ? parsed.next_actions.map((x) => String(x)).filter(Boolean).slice(0, 8)
    : [];
  const relationshipStatus = String(parsed.relationship_status ?? "").trim();

  const allowed = new Set(["strong", "needs_attention", "new", "dormant"]);
  if (!summary || !allowed.has(relationshipStatus) || nextActions.length === 0) {
    return json(
      {
        error: "AI response missing required fields",
        parsed,
      },
      500
    );
  }

  const { error: insErr } = await client.database.from("contact_ai_summaries").insert([
    {
      user_id: userId,
      contact_id: contactId,
      summary,
      next_actions: nextActions,
      relationship_status: relationshipStatus,
    },
  ]);

  if (insErr) {
    return json({ error: insErr.message ?? "Failed to save summary" }, 500);
  }

  return json({
    summary,
    next_actions: nextActions,
    relationship_status: relationshipStatus,
  });
};
