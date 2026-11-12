import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Eye, 
  Globe, 
  Users, 
  Calendar
} from 'lucide-react';
import { LinkedInIcon, InstagramIcon, TwitterIcon } from './BrandIcons';
import { acquisitionPlatforms } from '../data/mockData';
import './LeadsPipeline.css';

export default function LeadsPipeline({ 
  leads, 
  teamMembers, 
  onViewLead, 
  onUpdateStatus
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [repFilter, setRepFilter] = useState('all');

  // Filter logic
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.alternateContactName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.alternateContactEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.alternateContactPhone || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPlatform = platformFilter === 'all' || lead.platform === platformFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesRep = repFilter === 'all' ||
      (repFilter === 'unassigned' ? !lead.assignedToId : lead.assignedToId === repFilter);

    return matchesSearch && matchesPlatform && matchesStatus && matchesRep;
  });

  // Helper icon renderer
  const renderPlatformBadge = (platformId) => {
    const meta = acquisitionPlatforms.find(p => p.id === platformId) || {
      name: platformId,
    };

    let Icon = Globe;
    if (platformId === 'linkedin') Icon = LinkedInIcon;
    else if (platformId === 'instagram') Icon = InstagramIcon;
    else if (platformId === 'referral') Icon = Users;
    else if (platformId === 'twitter') Icon = TwitterIcon;
    else if (platformId === 'event') Icon = Calendar;
    else if (platformId === 'google') Icon = Search;
    else if (platformId === 'email_campaign') Icon = Mail;

    return (
      <span 
        className="platform-table-badge"
        style={{
          background: `rgba(${parseInt(meta.color.slice(1, 3), 16)}, ${parseInt(meta.color.slice(3, 5), 16)}, ${parseInt(meta.color.slice(5, 7), 16)}, 0.12)`,
          borderColor: `rgba(${parseInt(meta.color.slice(1, 3), 16)}, ${parseInt(meta.color.slice(3, 5), 16)}, ${parseInt(meta.color.slice(5, 7), 16)}, 0.4)`,
          color: meta.color,
        }}
      >
        <Icon size={18} />
        <span>{meta.name}</span>
      </span>
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'New': return 'status-new';
      case 'Contacted': return 'status-contacted';
      case 'In Progress': return 'status-inprogress';
      case 'Qualified': return 'status-qualified';
      case 'Closed': return 'status-closed';
      default: return 'status-new';
    }
  };

  const getPriorityBadgeStyle = (priority) => {
    if (priority === 'Urgent') return { background: 'rgba(244, 63, 94, 0.16)', color: '#fda4af', border: '1px solid rgba(244, 63, 94, 0.4)' };
    if (priority === 'High') return { background: 'rgba(245, 158, 11, 0.16)', color: '#fcd34d', border: '1px solid rgba(245, 158, 11, 0.4)' };
    return { background: 'rgba(14, 165, 233, 0.16)', color: '#7dd3fc', border: '1px solid rgba(14, 165, 233, 0.4)' };
  };

  return (
    <div className="pipeline-container">
      {/* Control Bar: Search & Dynamic Filters */}
      <div className="pipeline-control-bar">
        {/* Search */}
        <div className="search-filter-wrap">
          <div className="input-control-wrapper" style={{ width: '100%' }}>
            <span className="input-icon-prefix"><Search size={16} /></span>
            <input
              type="text"
              className="pipeline-search-input"
              placeholder="Search leads by client name, company, email, summary keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="filter-selects-group">
          {/* Platform Filter */}
          <select
            className="pipeline-filter-select"
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
          >
            <option value="all">All Reached Platforms ({leads.length})</option>
            {acquisitionPlatforms.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="pipeline-filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Lead Statuses</option>
            <option value="New">Status: New</option>
            <option value="Contacted">Status: Contacted</option>
            <option value="In Progress">Status: In Progress</option>
            <option value="Qualified">Status: Qualified</option>
            <option value="Closed">Status: Closed</option>
          </select>

          {/* Rep Assignee Filter */}
          <select
            className="pipeline-filter-select"
            value={repFilter}
            onChange={(e) => setRepFilter(e.target.value)}
          >
            <option value="all">All Contact Persons</option>
            <option value="unassigned">Unassigned</option>
            {teamMembers.map(rep => (
              <option key={rep.id} value={rep.id}>Assigned to {rep.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Leads Table Card */}
      <div className="leads-table-card">
        <div className="table-responsive-wrapper">
          <table className="leads-data-table">
            <thead>
              <tr>
                <th>Customer / Organization</th>
                <th>Platform Reached Us</th>
                <th>Inquiry Summary</th>
                <th>Deal &amp; Priority</th>
                <th>Assigned Contact Person</th>
                <th>Contact Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const assignedRep = teamMembers.find(r => r.id === lead.assignedToId) || {
                    name: lead.assignedToName || 'Unassigned',
                    avatar: lead.assignedRepAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
                    role: 'Contact Specialist'
                  };

                  return (
                    <tr key={lead.id}>
                      {/* Name & Company */}
                      <td>
                        <div className="lead-primary-cell">
                          <span className="lead-name-text">
                            {lead.fullName}
                          </span>
                          <span className="lead-company-text">
                            {lead.jobTitle} • {lead.company}
                          </span>
                          <span style={{ fontSize: '0.7rem', color: '#f1f3f5' }}>
                            {lead.country}
                          </span>
                        </div>
                      </td>

                      {/* Source Platform Reached Us */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {renderPlatformBadge(lead.platform)}
                          {lead.platformCampaign && (
                            <span 
                              style={{ 
                                fontSize: '0.7rem', 
                                color: '#f1f3f5', 
                                maxWidth: '160px', 
                                whiteSpace: 'nowrap', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis' 
                              }}
                              title={lead.platformCampaign}
                            >
                              {lead.platformCampaign}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Summary */}
                      <td>
                        <div className="summary-table-snippet" title={lead.summary}>
                          <span style={{ fontWeight: 600, color: 'var(--text-main)', display: 'block', marginBottom: '2px' }}>
                            {lead.inquiryType}
                          </span>
                          {lead.summary}
                        </div>
                      </td>

                      {/* Priority & Budget */}
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                          <span 
                            style={{ 
                              fontSize: '0.7rem', 
                              fontWeight: 700, 
                              padding: '2px 7px', 
                              borderRadius: '999px',
                              ...getPriorityBadgeStyle(lead.priority)
                            }}
                          >
                            {lead.priority}
                          </span>
                          <span className="deal-value">
                            {lead.budget}
                          </span>
                        </div>
                      </td>

                      {/* Assigned Contact Person */}
                      <td>
                        <div className="rep-assignee-badge" title={`Assigned to ${assignedRep.name}`}>
                          <img 
                            src={assignedRep.avatar} 
                            alt={assignedRep.name} 
                            className="rep-mini-avatar"
                          />
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className="rep-assignee-name">{assignedRep.name}</span>
                            <span style={{ fontSize: '0.65rem', color: '#f1f3f5' }}>
                              {assignedRep.role.split(' ')[0]} Specialist
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td>
                        <select
                          className={`status-pill ${getStatusClass(lead.status)}`}
                          value={lead.status}
                          onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                          style={{ border: 'none', outline: 'none' }}
                        >
                          <option value="New">● New</option>
                          <option value="Contacted">● Contacted</option>
                          <option value="In Progress">● In Progress</option>
                          <option value="Qualified">● Qualified</option>
                          <option value="Closed">● Closed</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            type="button"
                            className="table-action-btn"
                            title="View Full Lead Details & Timeline"
                            onClick={() => onViewLead(lead)}
                          >
                            <Eye size={15} />
                          </button>
                          <a
                            href={`mailto:${lead.email}?subject=Follow-up regarding your inquiry on Klarit labs CRM`}
                            className="table-action-btn"
                            title={`Send Email to ${lead.email}`}
                          >
                            <Mail size={15} />
                          </a>
                          <a
                            href={`tel:${lead.phone}`}
                            className="table-action-btn"
                            title={`Call ${lead.phone}`}
                          >
                            <Phone size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '48px 20px', color: '#f1f3f5' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <Filter size={32} style={{ color: '#c70005', opacity: 0.5 }} />
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>No matching leads found</div>
                      <p style={{ fontSize: '0.84rem', maxWidth: '360px' }}>
                        Try clearing your search query or adjusting your channel and status filters.
                      </p>
                      <button
                        type="button"
                        className="preset-chip-btn"
                        style={{ marginTop: '8px' }}
                        onClick={() => {
                          setSearchQuery('');
                          setPlatformFilter('all');
                          setStatusFilter('all');
                          setRepFilter('all');
                        }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
