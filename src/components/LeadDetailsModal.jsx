import { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Clock, 
  MessageSquare,
  CircleDot,
  ClipboardList,
  FileText,
  UserRound
} from 'lucide-react';
import { acquisitionPlatforms } from '../data/mockData';
import './LeadDetailsModal.css';

export default function LeadDetailsModal({ 
  lead, 
  teamMembers, 
  onClose, 
  onUpdateStatus, 
  onReassignLead, 
  onAddNote 
}) {
  const [newNoteText, setNewNoteText] = useState('');

  if (!lead) return null;

  const assignedRep = teamMembers.find(r => r.id === lead.assignedToId) || {
    id: lead.assignedToId,
    name: lead.assignedToName || 'Unassigned',
    role: lead.assignedRepRole || 'Account Representative',
    avatar: lead.assignedRepAvatar || '',
    email: 'contact@nexuscrm.io',
    phone: '+1 (555) 000-0000',
    status: 'Available'
  };

  const platformMeta = acquisitionPlatforms.find(p => p.id === lead.platform) || {
    name: lead.platform,
    category: 'Inbound Channel',
  };

  const handleNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const timestamp = new Date().toISOString();
    onAddNote(lead.id, {
      id: `note-${Date.now()}`,
      author: assignedRep.name,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp,
      text: newNoteText.trim()
    });

    setNewNoteText('');
  };

  const cleanPhone = lead.phone.replace(/[^0-9+]/g, '');
  const activity = lead.activity || (lead.notes || []).map(note => ({
    id: note.id,
    type: 'note',
    actor: note.author,
    timestamp: note.timestamp,
    time: note.time,
    text: note.text
  }));
  const formatActivityTime = (event) => {
    if (event.timestamp) {
      const date = new Date(event.timestamp);
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    }
    return event.time || 'Time unavailable';
  };
  const getActivityPresentation = (event) => {
    if (event.type === 'status') {
      return { title: 'Status Updated', Icon: CircleDot };
    }
    if (event.type === 'assignment') {
      return { title: 'Assignment Updated', Icon: UserRound };
    }
    if (event.type === 'intake') {
      return { title: 'Lead Created', Icon: ClipboardList };
    }
    return { title: 'Note Added', Icon: FileText };
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className="modal-close-btn" onClick={onClose} title="Close Lead Profile">
          <X size={18} />
        </button>

        {/* Lead Hero Header */}
        <div className="modal-header-hero">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 className="modal-lead-title">{lead.fullName}</h2>
            </div>

            <div className="modal-lead-meta">
              <span><strong>{lead.jobTitle}</strong> at <strong>{lead.company}</strong></span>
              <span>•</span>
              <span>{lead.country}</span>
              <span>•</span>
              <span>Created {new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>

            {/* Quick Contact Triggers */}
            <div className="contact-quick-actions">
              <a 
                href={`mailto:${lead.email}?subject=Follow-up regarding your inquiry on Klarit labs CRM`}
                className="contact-btn"
              >
                <Mail size={14} />
                <span>Email {lead.email}</span>
              </a>

              <a 
                href={`tel:${lead.phone}`}
                className="contact-btn"
              >
                <Phone size={14} />
                <span>Call {lead.phone}</span>
              </a>

              <a 
                href={`https://wa.me/${cleanPhone}`}
                target="_blank"
                rel="noreferrer"
                className="contact-btn"
                style={{ color: '#c70005' }}
              >
                <MessageSquare size={14} />
                <span>WhatsApp Message</span>
              </a>
            </div>
          </div>

          {/* Lead Lifecycle Status Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <span style={{ fontSize: '0.72rem', color: '#f1f3f5', fontWeight: 600 }}>
              Lifecycle Status:
            </span>
            <select
              className={`status-pill ${
                lead.status === 'New' ? 'status-new' :
                lead.status === 'Contacted' ? 'status-contacted' :
                lead.status === 'In Progress' ? 'status-inprogress' :
                lead.status === 'Qualified' ? 'status-qualified' : 'status-closed'
              }`}
              value={lead.status}
              onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
              style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            >
              <option value="New">● New Lead</option>
              <option value="Contacted">● Contacted</option>
              <option value="In Progress">● In Progress</option>
              <option value="Qualified">● Qualified</option>
              <option value="Closed">● Closed</option>
            </select>
          </div>
        </div>

        {/* Lead Summary Callout */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Client Inquiry Summary &amp; Problem Statement
            </span>
            <span style={{ fontSize: '0.75rem', color: '#f1f3f5' }}>
              Preferred Contact: <strong>{lead.preferredContact || 'Video Meeting'}</strong> ({lead.bestTime || 'Anytime'})
            </span>
          </div>

          <div className="modal-summary-box">
            <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '6px' }}>
              Need: {lead.inquiryType} (Budget: {lead.budget} • Priority: {lead.priority})
            </p>
            <p style={{ whiteSpace: 'pre-wrap' }}>
              "{lead.summary}"
            </p>
          </div>
        </div>

        {/* 2-Column Info Grid */}
        <div className="modal-body-grid">
          {(lead.alternateContactName || lead.alternateContactRelationship ||
            lead.alternateContactEmail || lead.alternateContactPhone) && (
            <div className="modal-info-box">
              <div className="modal-info-title">Additional Organization Contact</div>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                {lead.alternateContactName || 'Name not provided'}
              </div>
              {lead.alternateContactRelationship && (
                <div style={{ fontSize: '0.72rem', color: '#f1f3f5', marginTop: '3px' }}>
                  {lead.alternateContactRelationship}
                </div>
              )}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                {lead.alternateContactEmail && (
                  <a
                    href={`mailto:${lead.alternateContactEmail}?subject=Follow-up regarding ${encodeURIComponent(lead.company)}`}
                    className="contact-btn"
                  >
                    <Mail size={14} />
                    <span>{lead.alternateContactEmail}</span>
                  </a>
                )}
                {lead.alternateContactPhone && (
                  <>
                    <a href={`tel:${lead.alternateContactPhone}`} className="contact-btn">
                      <Phone size={14} />
                      <span>Call {lead.alternateContactPhone}</span>
                    </a>
                    {lead.alternateContactMethod === 'WhatsApp' && (
                      <a
                        href={`https://wa.me/${lead.alternateContactPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="contact-btn"
                        style={{ color: '#c70005' }}
                      >
                        <MessageSquare size={14} />
                        <span>WhatsApp Message</span>
                      </a>
                    )}
                  </>
                )}
              </div>
              {lead.alternateContactMethod && (
                <div style={{ fontSize: '0.72rem', color: '#f1f3f5', marginTop: '8px' }}>
                  Preferred contact method: {lead.alternateContactMethod}
                </div>
              )}
            </div>
          )}

          {/* Platform Source Attribution */}
          <div className="modal-info-box">
            <div className="modal-info-title">Platform Reached Us (Source)</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span 
                className="platform-table-badge"
                style={{ 
                  color: 'var(--color-crm-mist)',
                  borderColor: 'rgba(199, 0, 5, 0.35)',
                  background: 'rgba(199, 0, 5, 0.12)'
                }}
              >
                {platformMeta.name}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#f1f3f5' }}>
                ({platformMeta.category})
              </span>
            </div>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', lineHeight: '1.5' }}>
              <strong>Attribution Details:</strong><br />
              {lead.platformCampaign || 'Direct organic arrival'}
            </div>
          </div>

          {/* Assigned Contact Person & Reassignment */}
          <div className="modal-info-box">
            <div className="modal-info-title">Assigned Contact Person</div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              {assignedRep.avatar && (
                <img 
                  src={assignedRep.avatar} 
                  alt={assignedRep.name} 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-main)' }}>
                  {assignedRep.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#f1f3f5' }}>
                  {assignedRep.role}
                </div>
              </div>
            </div>

            {/* Quick Reassign Dropdown */}
            <div style={{ marginTop: '10px' }}>
              <label style={{ fontSize: '0.72rem', color: '#f1f3f5', display: 'block', marginBottom: '4px' }}>
                Reassign to another team specialist:
              </label>
              <select
                className="custom-select no-icon"
                style={{ padding: '6px 10px', fontSize: '0.78rem' }}
                value={lead.assignedToId || ''}
                onChange={(e) => {
                  const targetRep = teamMembers.find(r => r.id === e.target.value);
                  if (targetRep) {
                    onReassignLead(lead.id, targetRep);
                  } else {
                    onReassignLead(lead.id, null);
                  }
                }}
              >
                <option value="">Unassigned</option>
                {teamMembers.map(rep => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name} ({rep.role.split(' ')[0]}) - {rep.activeLeads} active leads
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activity Timeline & Rep Notes */}
        <div>
          <div className="timeline-section-title">
            <Clock size={16} style={{ color: '#c70005' }} />
            <span>Lead History &amp; Follow-Up Notes</span>
          </div>

          {/* Add Note Form */}
          <form onSubmit={handleNoteSubmit} className="add-note-row">
            <input
              type="text"
              className="add-note-input"
              placeholder={`Add a contact note as ${assignedRep.name} (e.g. "Sent pricing proposal", "Scheduled Zoom for Friday")...`}
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
            />
            <button type="submit" className="add-note-btn">
              Add Note
            </button>
          </form>

          {/* Lead activity history */}
          <div className="timeline-items-list">
            {activity.length > 0 ? (
              activity.map((event) => {
                const { title, Icon } = getActivityPresentation(event);
                return (
                  <div key={event.id} className={`timeline-item timeline-event-${event.type || 'note'}`}>
                    <div className="timeline-marker" aria-hidden="true">
                      <Icon size={15} />
                    </div>
                    <div className="timeline-item-card">
                      <div className="timeline-item-meta">
                        <span className="timeline-actor">
                          <strong className="timeline-event-title">{title}</strong>
                          <span className="timeline-event-actor">by {event.actor || 'CRM'}</span>
                        </span>
                        <time>{formatActivityTime(event)}</time>
                      </div>
                      <div className="timeline-event-description">{event.text}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ fontSize: '0.8rem', color: '#f1f3f5', fontStyle: 'italic', padding: '8px 0' }}>
                No history recorded yet. Status changes, reassignments, and follow-up notes will appear here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
