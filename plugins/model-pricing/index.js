// Providers to include, and which model families to select per provider (in display order).
// Families are stable (e.g. "claude-opus") while model IDs change with each release.
// Update these if a provider introduces an entirely new family tier.
const PROVIDER_FAMILIES = {
  anthropic: ["claude-opus", "claude-sonnet", "claude-haiku"],
  openai: ["gpt", "gpt-mini", "o-mini"],
  google: ["gemini-pro", "gemini-flash", "gemini-flash-lite"],
};

// Model IDs matching any of these patterns are excluded (previews, aliases, embeddings, etc.)
const EXCLUDE_PATTERNS = [
  /embedding/,
  /tts/,
  /live/,
  /-image/,
  /deep-research/,
  /codex/,
  /preview/,
  /latest$/,
  /-\d{8}$/, // date-suffixed variants like claude-3-5-sonnet-20241022
];

function shouldExclude(id) {
  return EXCLUDE_PATTERNS.some((re) => re.test(id));
}

module.exports = function modelPricingPlugin() {
  return {
    name: "model-pricing",
    async loadContent() {
      const res = await fetch("https://models.dev/api.json");
      const data = await res.json();
      const result = [];

      for (const [providerId, families] of Object.entries(PROVIDER_FAMILIES)) {
        const providerData = data[providerId];
        if (!providerData?.models) continue;

        // Group eligible models by family, keeping only the latest release per family
        const latestByFamily = {};
        for (const [id, model] of Object.entries(providerData.models)) {
          if (shouldExclude(id)) continue;
          if (model.deprecated) continue;
          if (!model.cost?.input && !model.cost?.output) continue;

          const family = model.family;
          const release = model.release_date || "1970-01-01";
          if (!latestByFamily[family] || release > latestByFamily[family].release) {
            latestByFamily[family] = { id, release, model };
          }
        }

        // Pick models in the defined family order
        for (const family of families) {
          const entry = latestByFamily[family];
          if (!entry) continue;
          const { id, model } = entry;
          result.push({
            id,
            name: model.name,
            provider: providerId,
            reasoning: model.reasoning ?? false,
            tool_call: model.tool_call ?? false,
            cost: model.cost || {},
            limit: model.limit || {},
          });
        }
      }

      return { models: result, fetchedAt: new Date().toISOString() };
    },
    async contentLoaded({ content, actions }) {
      const { setGlobalData } = actions;
      setGlobalData(content);
    },
  };
};
