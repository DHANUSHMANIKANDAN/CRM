import { useState, useEffect, useCallback } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import LeadForm from './components/LeadForm';
import LeadsPipeline from './components/LeadsPipeline';
import LeadDetailsModal from './components/LeadDetailsModal';
import TeamDirectory from './components/TeamDirectory';
import AnalyticsView from './components/AnalyticsView';
import ToastNotification from './components/ToastNotification';
import { initialLeads, initialTeamMembers, samplePresets } from './data/mockData';
import {
  normalizeLeadHistory,
  withStatus,
  withAssignee,
  withNote,
  adjustWorkload,
  syncWorkload,
  downloadCsv
} from './data/leadDomain';

const STORAGE_LEADS_KEY = 'nexus_crm_leads_v1';
const STORAGE_TEAM_KEY = 'nexus_crm_team_v1';

const readStored = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminView =
    location.pathname.startsWith('/admin') ||
    new URLSearchParams(location.search).get('view') === 'admin';

  // Leads state with localStorage persistence
  const [leads, setLeads] = useState(() => (
    readStored(STORAGE_LEADS_KEY, initialLeads).map(normalizeLeadHistory)
  ));

  // Team representatives state
  const [teamMembers, setTeamMembers] = useState(() => (
    readStored(STORAGE_TEAM_KEY, initialTeamMembers)
  ));

  // UI state
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [toast, setToast] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (
      location.pathname === '/' &&
      new URLSearchParams(location.search).get('view') === 'admin'
    ) {
      navigate('/admin/pipeline', { replace: true });
    }
  }, [location.pathname, location.search, navigate]);

  // The modal always renders the live lead, so status / assignment / note
  // changes show up immediately instead of a stale snapshot.
  const selectedLead = selectedLeadId
    ? leads.find(lead => lead.id === selectedLeadId) || null
    : null;

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEADS_KEY, JSON.stringify(leads));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }, [leads]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TEAM_KEY, JSON.stringify(teamMembers));
    } catch (e) {
      console.error('Team storage save error', e);
    }
  }, [teamMembers]);

  // Keep two open tabs (e.g. client form + admin pipeline) in sync.
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_LEADS_KEY && event.newValue) {
        try {
          setLeads(JSON.parse(event.newValue).map(normalizeLeadHistory));
        } catch {
          // ignore malformed payloads from other tabs
        }
      }
      if (event.key === STORAGE_TEAM_KEY && event.newValue) {
        try {
          setTeamMembers(JSON.parse(event.newValue));
        } catch {
          // ignore malformed payloads from other tabs
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Lead Submission & Assignment Flow
  const handleLeadSubmit = (newLead) => {
    setLeads(prev => [newLead, ...prev]);

    setToast({
      title: 'Thank you for reaching out',
      message: 'Your details have been submitted successfully.'
    });
  };

  // Update lead status (New, Contacted, In Progress, Qualified, Closed)
  const handleUpdateStatus = (leadId, newStatus) => {
    const currentLead = leads.find(lead => lead.id === leadId);
    if (!currentLead || currentLead.status === newStatus) return;

    setLeads(prev => prev.map(lead => (
      lead.id === leadId ? withStatus(lead, newStatus) : lead
    )));

    setToast({
      title: 'Lead Status Updated',
      message: `Lead status changed to "${newStatus}".`
    });
  };

  // Reassign Lead to another specialist (or unassign with null)
  const handleReassignLead = (leadId, newRep) => {
    const lead = leads.find(item => item.id === leadId);
    if (!lead || lead.assignedToId === (newRep?.id || null)) return;

    setTeamMembers(prev => adjustWorkload(prev, lead.assignedToId, newRep?.id));
    setLeads(prev => prev.map(item => (
      item.id === leadId ? withAssignee(item, newRep) : item
    )));

    setToast({
      title: newRep ? 'Lead Assigned' : 'Lead Unassigned',
      message: newRep
        ? `Lead successfully assigned to ${newRep.name}.`
        : 'Lead is now unassigned.'
    });
  };

  // Add internal note to lead
  const handleAddNote = (leadId, noteObj) => {
    setLeads(prev => prev.map(lead => (
      lead.id === leadId ? withNote(lead, noteObj) : lead
    )));
  };

  // Delete a lead (with confirmation) and release its workload slot
  const handleDeleteLead = (leadId) => {
    const lead = leads.find(item => item.id === leadId);
    if (!lead) return;
    if (!window.confirm(`Delete the lead for ${lead.fullName}? This cannot be undone.`)) return;

    setLeads(prev => prev.filter(item => item.id !== leadId));
    if (lead.assignedToId) {
      setTeamMembers(prev => adjustWorkload(prev, lead.assignedToId, null));
    }
    if (selectedLeadId === leadId) setSelectedLeadId(null);

    setToast({
      title: 'Lead Deleted',
      message: `${lead.fullName} was removed from the pipeline.`
    });
  };

  // Export the current pipeline to CSV
  const handleExportCsv = () => {
    if (leads.length === 0) {
      setToast({ title: 'Nothing to export', message: 'The pipeline is empty.' });
      return;
    }
    downloadCsv(leads, `klarit-leads-${new Date().toISOString().slice(0, 10)}.csv`);
    setToast({
      title: 'Export Ready',
      message: `${leads.length} lead${leads.length === 1 ? '' : 's'} exported to CSV.`
    });
  };

  // Restore the demo dataset
  const handleResetData = () => {
    if (!window.confirm('Reset all leads and team data back to the demo dataset?')) return;

    const freshLeads = initialLeads.map(normalizeLeadHistory);
    setLeads(freshLeads);
    setTeamMembers(syncWorkload(initialTeamMembers, freshLeads));
    setSelectedLeadId(null);
    setPrefillData(null);
    setFormKey(k => k + 1);

    setToast({
      title: 'Demo Data Restored',
      message: 'Leads and team workload were reset to the sample dataset.'
    });
  };

  // Quick preset trigger from Header
  const handleQuickPreset = () => {
    const randomPreset = samplePresets[Math.floor(Math.random() * samplePresets.length)];
    setPrefillData(randomPreset.data);
    setFormKey(k => k + 1);
    navigate('/admin/intake');
    setToast({
      title: 'Sample Data Loaded',
      message: `Loaded preset: "${randomPreset.label}". Review details and click Submit!`
    });
  };

  const handleViewLead = useCallback((lead) => setSelectedLeadId(lead.id), []);
  const handleCloseModal = useCallback(() => setSelectedLeadId(null), []);
  const handleDismissToast = useCallback(() => setToast(null), []);

  return (
    <div className="crm-app-container">
      {/* Top Header */}
      <Header
        isAdmin={isAdminView}
        totalLeads={leads.length}
        onQuickPreset={isAdminView ? handleQuickPreset : undefined}
        onExportCsv={isAdminView ? handleExportCsv : undefined}
        onResetData={isAdminView ? handleResetData : undefined}
        
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <LeadForm
                key={formKey}
                isAdmin={isAdminView}
                onLeadSubmit={handleLeadSubmit}
                prefillData={prefillData}
              />
            }
          />
          <Route
            path="/admin"
            element={<Navigate to="/admin/pipeline" replace />}
          />
          <Route
            path="/admin/intake"
            element={
              <LeadForm
                key={formKey}
                isAdmin
                onLeadSubmit={handleLeadSubmit}
                prefillData={prefillData}
              />
            }
          />
          <Route
            path="/admin/pipeline"
            element={
              <LeadsPipeline
                leads={leads}
                teamMembers={teamMembers}
                onViewLead={handleViewLead}
                onUpdateStatus={handleUpdateStatus}
                onReassignLead={handleReassignLead}
                onDeleteLead={handleDeleteLead}
                onExportCsv={handleExportCsv}
              />
            }
          />
          <Route
            path="/admin/team"
            element={
              <TeamDirectory
                leads={leads}
                teamMembers={teamMembers}
                onReassignLead={handleReassignLead}
                onViewLead={handleViewLead}
              />
            }
          />
          <Route
            path="/admin/analytics"
            element={<AnalyticsView leads={leads} teamMembers={teamMembers} />}
          />
          <Route
            path="*"
            element={<Navigate to={isAdminView ? '/admin/pipeline' : '/'} replace />}
          />
        </Routes>
      </main>

      {/* Lead Details Modal Drawer */}
      {isAdminView && selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          teamMembers={teamMembers}
          onClose={handleCloseModal}
          onUpdateStatus={handleUpdateStatus}
          onReassignLead={handleReassignLead}
          onAddNote={handleAddNote}
          onDeleteLead={handleDeleteLead}
        />
      )}

      {/* Toast Notification */}
      <ToastNotification
        toast={toast}
        onDismiss={handleDismissToast}
      />
    </div>
  );
}
