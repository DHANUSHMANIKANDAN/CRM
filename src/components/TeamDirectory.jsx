import { Users, Mail, Phone, Eye, Gauge } from "lucide-react";
import { getStatusClass } from "../data/leadDomain";
import "./TeamDirectory.css";

const WORKLOAD_LIMIT = 8;

const getWorkloadTone = (count) => {
  if (count >= WORKLOAD_LIMIT)
    return { label: "At capacity", color: "#c70005" };
  if (count >= WORKLOAD_LIMIT - 2) return { label: "Heavy", color: "#3d4a5c" };
  return { label: "Healthy", color: "#3d4a5c" };
};

export default function TeamDirectory({
  leads,
  teamMembers,
  onReassignLead,
  onViewLead,
}) {
  const unassignedLeads = leads.filter((lead) => !lead.assignedToId);

  return (
    <div className="team-view-layout">
      <div className="team-view-header">
        <div>
          <h2 className="view-section-title">
            <Users size={20} style={{ color: "#c70005" }} />
            Team Directory &amp; Workload
          </h2>
          <p className="view-section-subtitle">
            {teamMembers.length} specialists • {unassignedLeads.length}{" "}
            unassigned lead
            {unassignedLeads.length === 1 ? "" : "s"} waiting for an owner
          </p>
        </div>
      </div>

      <div className="team-grid-layout">
        {teamMembers.map((member) => {
          const memberLeads = leads.filter(
            (lead) => lead.assignedToId === member.id,
          );
          const tone = getWorkloadTone(memberLeads.length);
          const fillPercent = Math.min(
            100,
            Math.round((memberLeads.length / WORKLOAD_LIMIT) * 100),
          );

          return (
            <div key={member.id} className="team-member-card">
              <div className="member-header-row">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="member-large-avatar"
                />
                <div style={{ minWidth: 0 }}>
                  <div className="rep-name-title">{member.name}</div>
                  <div className="rep-role-title">{member.role}</div>
                  <div className="rep-badges-row">
                    <span
                      className="rep-stat-chip"
                      style={{
                        color: member.statusColor,
                        border: `1px solid ${member.statusColor}55`,
                      }}
                    >
                      ● {member.status}
                    </span>
                    <span className="rep-stat-chip">
                      {member.avgResponseTime} avg reply
                    </span>
                  </div>
                </div>
              </div>

              <div className="member-stats-row">
                <div className="member-stat-box">
                  <div className="val">{memberLeads.length}</div>
                  <div className="label">Active Leads</div>
                </div>
                <div className="member-stat-box">
                  <div className="val">{member.quotaAttainment}</div>
                  <div className="label">Quota</div>
                </div>
                <div className="member-stat-box">
                  <div className="val">
                    {memberLeads.filter((l) => l.status === "Qualified").length}
                  </div>
                  <div className="label">Qualified</div>
                </div>
              </div>

              <div className="workload-meter">
                <div className="workload-meter-label">
                  <span>
                    <Gauge size={13} /> Workload
                  </span>
                  <span style={{ color: tone.color }}>
                    {tone.label} ({memberLeads.length}/{WORKLOAD_LIMIT})
                  </span>
                </div>
                <div className="channel-track">
                  <div
                    className="channel-progress"
                    style={{ width: `${fillPercent}%`, background: tone.color }}
                  />
                </div>
              </div>

              <div className="member-contact-row">
                <a href={`mailto:${member.email}`} className="contact-btn">
                  <Mail size={13} />
                  <span>Email</span>
                </a>
                <a href={`tel:${member.phone}`} className="contact-btn">
                  <Phone size={13} />
                  <span>Call</span>
                </a>
              </div>

              <div className="member-leads-list">
                <div className="member-leads-title">Assigned leads</div>
                {memberLeads.length > 0 ? (
                  memberLeads.slice(0, 4).map((lead) => (
                    <button
                      key={lead.id}
                      type="button"
                      className="member-lead-row"
                      onClick={() => onViewLead(lead)}
                      title={`Open ${lead.fullName}`}
                    >
                      <span className="member-lead-name">{lead.fullName}</span>
                      <span
                        className={`status-pill ${getStatusClass(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                      <Eye size={13} />
                    </button>
                  ))
                ) : (
                  <div className="member-leads-empty">
                    No leads assigned yet.
                  </div>
                )}
                {memberLeads.length > 4 && (
                  <div className="member-leads-empty">
                    +{memberLeads.length - 4} more in the pipeline
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {unassignedLeads.length > 0 && (
        <div className="channel-breakdown-card">
          <h3 className="view-section-title" style={{ fontSize: "1rem" }}>
            Unassigned Leads ({unassignedLeads.length})
          </h3>
          <div className="unassigned-list">
            {unassignedLeads.map((lead) => (
              <div key={lead.id} className="unassigned-row">
                <div style={{ minWidth: 0 }}>
                  <div className="member-lead-name">{lead.fullName}</div>
                  <div className="rep-role-title">
                    {lead.company} • {lead.inquiryType}
                  </div>
                </div>
                <select
                  className="pipeline-filter-select"
                  value=""
                  onChange={(e) => {
                    const rep = teamMembers.find(
                      (r) => r.id === e.target.value,
                    );
                    if (rep) onReassignLead(lead.id, rep);
                  }}
                >
                  <option value="">Assign to…</option>
                  {teamMembers.map((rep) => (
                    <option key={rep.id} value={rep.id}>
                      {rep.name} ({rep.activeLeads} active)
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="table-action-btn"
                  title="View lead details"
                  onClick={() => onViewLead(lead)}
                >
                  <Eye size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
