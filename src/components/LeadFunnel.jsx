import {
  Cell,
  Funnel,
  FunnelChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { LEAD_STATUSES } from "../data/leadDomain";
import "./LeadFunnel.css";

const FUNNEL_COLORS = [
  "#8b5cf6",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#f43f5e",
];

// Must match your card's background so the stroke looks like a gap
// between layers. Change this if your card color is different.
const GAP_COLOR = "#171717";

const STAGES = [
  { label: "All Leads", minStatusIndex: 0 },
  { label: "Contacted", minStatusIndex: 1 },
  { label: "In Progress", minStatusIndex: 2 },
  { label: "Qualified", minStatusIndex: 3 },
  { label: "Closed", minStatusIndex: 4 },
];

export default function LeadFunnel({ leads }) {
  const totalLeads = leads.length;
  const statusCounts = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }));

  const countFrom = (minIndex) =>
    statusCounts
      .slice(minIndex)
      .reduce((sum, status) => sum + status.count, 0);

  const funnelStages = STAGES.map((stage, index) => {
    const count = index === 0 ? totalLeads : countFrom(stage.minStatusIndex);
    const previousCount =
      index <= 1 ? totalLeads : countFrom(STAGES[index - 1].minStatusIndex);
    const share = totalLeads ? Math.round((count / totalLeads) * 100) : 0;

    return {
      ...stage,
      count,
      share,
      conversion: previousCount ? Math.round((count / previousCount) * 100) : 0,
      displayLabel: `${stage.label} · ${count} (${share}%)`,
    };
  });

  return (
    <section className="channel-breakdown-card analytics-funnel-card">
      <div className="analytics-funnel-header">
        <div>
          <h3 className="view-section-title" style={{ fontSize: "1rem" }}>
            Lead Conversion Funnel
          </h3>
          <p className="view-section-subtitle">
            Current leads at each lifecycle stage and beyond
          </p>
        </div>
        <span className="analytics-funnel-total">{totalLeads} total leads</span>
      </div>

      {totalLeads > 0 ? (
        <div className="analytics-funnel-chart">
          <div className="funnel-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <FunnelChart margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <Tooltip
                  formatter={(value) => [`${value} leads`, "Count"]}
                  contentStyle={{
                    background: "var(--color-navy)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    color: "#ffffff",
                  }}
                  itemStyle={{ color: "#e2e8f0" }}
                  labelStyle={{ color: "#ffffff", fontWeight: 700 }}
                />
                <Funnel
                  dataKey="count"
                  data={funnelStages}
                  isAnimationActive
                  lastShapeType="rectangle" /* flat bottom instead of a point */
                  stroke={GAP_COLOR} /* gap between layers */
                  strokeWidth={4}
                >
                  {funnelStages.map((stage, index) => (
                    <Cell key={stage.label} fill={FUNNEL_COLORS[index]} />
                  ))}
                  <LabelList
                    position="center" /* label inside each layer */
                    dataKey="displayLabel"
                    fill="#ffffff"
                    stroke="none"
                    fontSize={13}
                    fontWeight={600}
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <p className="analytics-funnel-empty">
          Add leads to see the conversion funnel.
        </p>
      )}

      {/* Optional: bring back the conversion row
      <div className="analytics-funnel-conversions">
        {funnelStages.slice(1).map((stage) => (
          <span key={stage.label}>
            {stage.label}: <strong>{stage.conversion}%</strong> from prior stage
          </span>
        ))}
      </div>
      */}
    </section>
  );
}