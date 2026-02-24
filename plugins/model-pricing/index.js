const MODEL_ORDER = [
  // Anthropic
  "claude-opus-4-6",
  "claude-sonnet-4-6",
  "claude-haiku-4-5-20251001",
  // OpenAI
  "gpt-4.1",
  "gpt-4.1-mini",
  "o4-mini",
  // Google
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

const MODEL_SET = new Set(MODEL_ORDER);

module.exports = function modelPricingPlugin() {
  return {
    name: "model-pricing",
    async loadContent() {
      const res = await fetch("https://models.dev/api.json");
      const data = await res.json();
      const result = [];
      const seen = new Set();
      for (const [provider, info] of Object.entries(data)) {
        const providerModels = info.models || {};
        for (const [id, model] of Object.entries(providerModels)) {
          if (MODEL_SET.has(id) && !seen.has(id)) {
            seen.add(id);
            result.push({
              id,
              name: model.name,
              provider,
              reasoning: model.reasoning ?? false,
              tool_call: model.tool_call ?? false,
              cost: model.cost || {},
              limit: model.limit || {},
            });
          }
        }
      }
      result.sort(
        (a, b) => MODEL_ORDER.indexOf(a.id) - MODEL_ORDER.indexOf(b.id)
      );
      return result;
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData({ models: content });
    },
  };
};
