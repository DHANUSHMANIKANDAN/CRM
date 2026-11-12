import {
  Layers,
  UserCheck,
  Sparkles,
  FileText,
  Kanban,
  Download,
  Users,
  ChartNoAxesColumn,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header({
  isAdmin,
  totalLeads,
  onQuickPreset,
  onExportCsv,
}) {
  return (
    <header className="crm-header">
      <div className="header-top-row">
        {/* Brand */}
        <div className="brand-section">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-crm-red text-crm-black shadow-lg shadow-crm-red/30">
            <Layers size={22} />
          </div>
          <div className="brand-title-wrap">
            <h1>
              Klarit labs CRM
              <span className="brand-version-badge">Lead Routing Hub</span>
            </h1>
            <p className="brand-subtitle">
              {isAdmin
                ? "Review incoming leads, manage their status, and assign an owner"
                : "Tell us about your project and our team will be in touch"}
            </p>
          </div>
        </div>

        {/* Header Live Metrics & Quick Action */}
        {isAdmin && (
          <div className="header-metrics">
            <div
              className="metric-pill"
              title="Total captured leads in pipeline"
            >
              <UserCheck className="metric-icon" />
              <span className="metric-label">Pipeline:</span>
              <span className="metric-val">{totalLeads} Leads</span>
            </div>

            <button
              type="button"
              className="demo-preset-btn"
              onClick={onQuickPreset}
              title="Auto-fill with sample high-intent client data"
            >
              <Sparkles size={14} />
              <span>Pre-fill Sample Lead</span>
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      {isAdmin && (
        <nav className="header-nav-tabs" aria-label="CRM Navigation">
          <NavLink
            to="/admin/intake"
            end
            className={({ isActive }) =>
              `nav-tab-btn ${isActive ? "active" : ""}`
            }
          >
            <FileText size={16} />
            <span>Client Intake Form</span>
          </NavLink>

          <NavLink
            to="/admin/pipeline"
            className={({ isActive }) =>
              `nav-tab-btn ${isActive ? "active" : ""}`
            }
          >
            <Kanban size={16} />
            <span>Admin Pipeline</span>
            <span className="nav-tab-badge">{totalLeads}</span>
          </NavLink>

          <NavLink
            to="/admin/team"
            className={({ isActive }) =>
              `nav-tab-btn ${isActive ? "active" : ""}`
            }
          >
            <Users size={16} />
            <span>Team</span>
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `nav-tab-btn ${isActive ? "active" : ""}`
            }
          >
            <ChartNoAxesColumn size={16} />
            <span>Analytics</span>
          </NavLink>

          <button
            type="button"
            onClick={onExportCsv}
            title="Download the lead pipeline as a CSV file"
            className="nav-tab-btn export-nav-btn"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </nav>
      )}
    </header>
  );
}
