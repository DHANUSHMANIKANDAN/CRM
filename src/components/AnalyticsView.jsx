import { lazy, Suspense } from "react";
import { ChartNoAxesColumn, Target, UserRoundCheck, Users } from "lucide-react";
import { acquisitionPlatforms } from "../data/mockData";
import { LEAD_STATUSES } from "../data/leadDomain";
import "./AnalyticsView.css";

const LeadFunnel = lazy(() => import("./LeadFunnel"));

export default function AnalyticsView({ leads, teamMembers }) {
  const totalLeads = leads.length;
  const assignedLeads = leads.filter((lead) => lead.assignedToId).length;
  const qualifiedLeads = leads.filter((lead) => lead.status === "Qualified").length;
  const closedLeads = leads.filter((lead) => lead.status === "Closed").length;
  const conversionRate = totalLeads
    ? Math.round(((qualifiedLeads + closedLeads) / totalLeads) * 100)
    : 0;

  const sourceCounts = acquisitionPlatforms.map((platform) => ({
    ...platform,
    count: leads.filter((lead) => lead.platform === platform.id).length,
  }));
  const maxSourceCount = Math.max(1, ...sourceCounts.map((source) => source.count));
  const statusCounts = LEAD_STATUSES.map((status) => ({
    status,
    count: leads.filter((lead) => lead.status === status).length,
  }));

  const memberCounts = teamMembers.map((member) => ({
    ...member,
    leadCount: leads.filter((lead) => lead.assignedToId === member.id).length,
  }));

  return (
    <div className="team-view-layout">
      <div className="team-view-header">
        <div>
          <h2 className="view-section-title">
            <ChartNoAxesColumn size={20} style={{ color: "#c70005" }} />
            Analytics &amp; Attribution
          </h2>
          <p className="view-section-subtitle">
            Lead volume, lifecycle progress, and acquisition performance
          </p>
        </div>
      </div>

      <div className="analytics-overview-grid">
        <div className="stat-metric-card">
          <span className="stat-metric-label">Total Leads</span>
          <strong className="stat-metric-val">{totalLeads}</strong>
        </div>
        <div className="stat-metric-card">
          <span className="stat-metric-label">Assigned Leads</span>
          <strong className="stat-metric-val">{assignedLeads}</strong>
        </div>
        <div className="stat-metric-card">
          <span className="stat-metric-label">Qualified Leads</span>
          <strong className="stat-metric-val">{qualifiedLeads}</strong>
        </div>
        <div className="stat-metric-card">
          <span className="stat-metric-label">Qualified / Closed Rate</span>
          <strong className="stat-metric-val">{conversionRate}%</strong>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="channel-breakdown-card analytics-funnel-card">
            Loading funnel chart…
          </div>
        }
      >
        <LeadFunnel leads={leads} />
      </Suspense>

      <div className="analytics-overview-grid">
        <section className="channel-breakdown-card">
          <h3 className="view-section-title" style={{ fontSize: "1rem" }}>
            <Target size={17} style={{ color: "#c70005" }} />
            Lead Status
          </h3>
          <div className="channel-bars-list">
            {statusCounts.map(({ status, count }) => (
              <div className="channel-bar-item" key={status}>
                <div className="channel-bar-info">
                  <span>{status}</span>
                  <span>{count}</span>
                </div>
                <div
                  className="channel-track"
                  role="progressbar"
                  aria-label={`${status} leads`}
                  aria-valuemin={0}
                  aria-valuemax={totalLeads}
                  aria-valuenow={count}
                >
                  <div
                    className="channel-progress"
                    style={{
                      width: `${totalLeads ? (count / totalLeads) * 100 : 0}%`,
                      background: "#c70005",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="channel-breakdown-card">
          <h3 className="view-section-title" style={{ fontSize: "1rem" }}>
            <Users size={17} style={{ color: "#c70005" }} />
            Leads by Source
          </h3>
          <div className="channel-bars-list">
            {sourceCounts.map((source) => (
              <div className="channel-bar-item" key={source.id}>
                <div className="channel-bar-info">
                  <span>{source.name}</span>
                  <span>{source.count}</span>
                </div>
                <div className="channel-track">
                  <div
                    className="channel-progress"
                    style={{
                      width: `${(source.count / maxSourceCount) * 100}%`,
                      background: "var(--color-crm-red)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="channel-breakdown-card">
        <h3 className="view-section-title" style={{ fontSize: "1rem" }}>
          <UserRoundCheck size={17} style={{ color: "#c70005" }} />
          Team Workload
        </h3>
        <div className="channel-bars-list">
          {memberCounts.map((member) => (
            <div className="channel-bar-item" key={member.id}>
              <div className="channel-bar-info">
                <span>{member.name}</span>
                <span>{member.leadCount} leads</span>
              </div>
              <div className="channel-track">
                <div
                  className="channel-progress"
                  style={{
                    width: `${totalLeads ? (member.leadCount / totalLeads) * 100 : 0}%`,
                    background: "var(--color-crm-muted)",
                  }}
                />
              </div>
            </div>
          ))}
          {memberCounts.length === 0 && (
            <p className="view-section-subtitle">No team members available.</p>
          )}
        </div>
      </section>
    </div>
  );
}
