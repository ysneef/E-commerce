const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";

const callGroq = async (messages) => {
  if (!GROQ_API_KEY) {
    console.warn("[GROQ] No API key configured");
    return null;
  }

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Groq API error: ${response.status} - ${error.error?.message || error.message}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("[GROQ] Error calling Groq:", error.message);
    return null;
  }
};

const isGroqAvailable = () => !!GROQ_API_KEY;

export { callGroq, isGroqAvailable };
