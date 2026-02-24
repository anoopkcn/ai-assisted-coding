import { usePluginData } from "@docusaurus/useGlobalData";

interface Model {
  id: string;
  name: string;
  provider: string;
  reasoning: boolean;
  tool_call: boolean;
  cost: { input?: number; output?: number };
  limit: { context?: number; output?: number };
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
  const { models } = usePluginData("model-pricing") as { models: Model[] };

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
          <tr key={m.id}>
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
