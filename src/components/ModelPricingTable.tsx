import { useState, useEffect } from "react";

const API_URL = "https://models.dev/api.json";

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

interface Model {
  id: string;
  name: string;
  provider: string;
  reasoning?: boolean;
  tool_call?: boolean;
  release_date?: string;
  cost?: { input?: number; output?: number };
  limit?: { context?: number; output?: number };
}

function formatTokens(n?: number): string {
  if (!n) return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return `${(n / 1000).toFixed(0)}K`;
}

function formatPrice(price?: number): string {
  if (price == null) return "—";
  return `$${price.toFixed(2)}`;
}

export default function ModelPricingTable() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        const result: Model[] = [];
        for (const [provider, info] of Object.entries<any>(data)) {
          const providerModels = info.models || {};
          for (const [id, model] of Object.entries<any>(providerModels)) {
            if (MODEL_SET.has(id)) {
              result.push({ ...model, id, provider });
            }
          }
        }
        const seen = new Set<string>();
        const deduped = result.filter((m) => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
        deduped.sort(
          (a, b) => MODEL_ORDER.indexOf(a.id) - MODEL_ORDER.indexOf(b.id)
        );
        setModels(deduped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading model data...</p>;
  if (error) return <p>Failed to load model data: {error}</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Model</th>
          <th>Context</th>
          <th>Max Output</th>
          <th>Input ($/M)</th>
          <th>Output ($/M)</th>
          <th>Reasoning</th>
          <th>Tool Use</th>
        </tr>
      </thead>
      <tbody>
        {models.map((m) => (
          <tr key={`${m.provider}-${m.id}`}>
            <td>{m.name}</td>
            <td>{formatTokens(m.limit?.context)}</td>
            <td>{formatTokens(m.limit?.output)}</td>
            <td>{formatPrice(m.cost?.input)}</td>
            <td>{formatPrice(m.cost?.output)}</td>
            <td>{m.reasoning ? "Yes" : "No"}</td>
            <td>{m.tool_call ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
