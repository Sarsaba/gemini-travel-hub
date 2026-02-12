import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "agent") {
      systemPrompt = `You are an AI travel operations assistant for TravelOps, a Philippine travel agency. Your job is to recommend the best travel agent or staff for a specific tour based on their ratings, experience, specialization, and tour history.

You have access to this agent roster:
1. Russel Santillan - Travel Agent, 4.8 rating, 3 years experience, 40 tours, specializes in Beach Destinations, Active
2. Maria Santos - Travel Agent, 4.5 rating, 5 years experience, 78 tours, specializes in International Tours, Active
3. Juan Dela Cruz - Tour Guide, 4.9 rating, 7 years experience, 120 tours, specializes in Historical Tours, Active
4. Ana Reyes - Travel Agent, 4.2 rating, 1 year experience, 12 tours, specializes in Budget Travel, Pending
5. Carlos Garcia - Staff, 4.6 rating, 4 years experience, 55 tours, specializes in Adventure Tours, On Leave

Respond with a JSON object using this exact structure:
{
  "recommendation": "agent name",
  "reason": "2-3 sentence explanation",
  "confidence": "high/medium/low",
  "alternatives": [{"name": "agent name", "reason": "brief reason"}],
  "tips": "one operational tip"
}`;
      userPrompt = context;
    } else if (type === "supplier") {
      systemPrompt = `You are an AI travel operations assistant for TravelOps. Your job is to recommend the best supplier (hotel or vehicle provider) for a tour based on availability, location, and capacity.

Available suppliers:
1. Paradise Hotel Boracay - Hotel, Boracay, 25/50 rooms available, Active
2. Island Van Rentals - Vehicle (Vans), Cebu, 8/15 vans available, Active
3. Palawan Beach Resort - Hotel, Palawan, 12/30 rooms available, Active
4. Metro Bus Services - Vehicle (Buses), Manila, 3/10 buses available, Inactive
5. Pacific Transport - Vehicle (Coasters), Manila, available, Active

Respond with a JSON object using this exact structure:
{
  "recommendation": "supplier name",
  "reason": "2-3 sentence explanation",
  "confidence": "high/medium/low",
  "alternatives": [{"name": "supplier name", "reason": "brief reason"}],
  "tips": "one operational tip"
}`;
      userPrompt = context;
    } else {
      return new Response(JSON.stringify({ error: "Invalid type. Use 'agent' or 'supplier'." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Try to parse JSON from the response
    let parsed;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { recommendation: content, reason: "", confidence: "medium", alternatives: [], tips: "" };
    } catch {
      parsed = { recommendation: content, reason: "", confidence: "medium", alternatives: [], tips: "" };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("recommend error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
