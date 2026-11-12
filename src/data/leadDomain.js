// Shared lead domain helpers: statuses, activity history, assignment, CSV export.
// Kept free of React so App, the pipeline, the modal and the analytics view
// all agree on the same rules.

export const LEAD_STATUSES = [
  "New",
  "Contacted",
  "In Progress",
  "Qualified",
  "Closed",
];

export const STATUS_CLASS = {
  New: "status-new",
  Contacted: "status-contacted",
  "In Progress": "status-inprogress",
  Qualified: "status-qualified",
  Closed: "status-closed",
};

export const getStatusClass = (status) => STATUS_CLASS[status] || "status-new";

export const PRIORITY_RANK = { Urgent: 0, High: 1, Medium: 2, Low: 3 };

export const getPriorityRank = (priority) =>
  priority in PRIORITY_RANK ? PRIORITY_RANK[priority] : 4;

// Unique-enough id without relying on Date.now() alone (two events in the same
// millisecond used to collide and produce duplicate React keys).
let idCounter = 0;
export const createId = (prefix) => {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
};

export const formatTime = (date = new Date()) =>
  date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const createActivity = (event) => ({
  id: createId("activity"),
  timestamp: new Date().toISOString(),
  ...event,
});

// Older saved leads only had `notes`; derive an activity timeline from them.
export const normalizeLeadHistory = (lead) => {
  if (Array.isArray(lead.activity)) return lead;

  return {
    ...lead,
    activity: (lead.notes || []).map((note) => ({
      id: `activity-${note.id}`,
      type: /lifecycle status/i.test(note.text)
        ? "status"
        : /assigned to|unassigned from/i.test(note.text)
          ? "assignment"
          : "note",
      actor: note.author || "CRM",
      timestamp: note.timestamp || null,
      time: note.time || "",
      text: note.text,
    })),
  };
};

// Append a note to both the notes list and the activity timeline.
export const withNote = (lead, note) => ({
  ...lead,
  activity: [
    {
      id: `activity-${note.id}`,
      type: "note",
      actor: note.author,
      timestamp: note.timestamp || new Date().toISOString(),
      time: note.time,
      text: note.text,
    },
    ...(lead.activity || []),
  ],
  notes: [note, ...(lead.notes || [])],
});

// Move a lead to a new lifecycle status, recording the change.
export const withStatus = (lead, newStatus) => {
  if (lead.status === newStatus) return lead;

  return {
    ...lead,
    status: newStatus,
    activity: [
      createActivity({
        type: "status",
        actor: "CRM Pipeline",
        fromStatus: lead.status,
        toStatus: newStatus,
        text: `Status changed from "${lead.status}" to "${newStatus}".`,
      }),
      ...(lead.activity || []),
    ],
    notes: [
      ...(lead.notes || []),
      {
        id: createId("note"),
        author: "CRM Pipeline Automation",
        time: formatTime(),
        text: `Lifecycle status moved to "${newStatus}".`,
      },
    ],
  };
};

// Assign / reassign / unassign a lead. `rep` is a team member or null.
export const withAssignee = (lead, rep) => {
  const previousRepName = lead.assignedToName || "Unassigned";
  const nextRepName = rep?.name || "Unassigned";

  return {
    ...lead,
    assignedToId: rep?.id || null,
    assignedToName: rep?.name || "Unassigned",
    assignedRepAvatar: rep?.avatar || "",
    assignedRepRole: rep?.role || "",
    activity: [
      createActivity({
        type: "assignment",
        actor: "Assignment Manager",
        fromAssignee: previousRepName,
        toAssignee: nextRepName,
        text: rep
          ? `${lead.assignedToId ? "Reassigned" : "Assigned"} from ${previousRepName} to ${nextRepName}.`
          : `Unassigned from ${previousRepName}.`,
      }),
      ...(lead.activity || []),
    ],
    notes: [
      ...(lead.notes || []),
      {
        id: createId("note"),
        author: "Assignment Manager",
        time: formatTime(),
        text: rep
          ? `Assigned to ${rep.name} (${rep.role}).`
          : `Unassigned from ${previousRepName}.`,
      },
    ],
  };
};

// Keep team workload counters in sync with the leads they own.
export const adjustWorkload = (teamMembers, fromId, toId) =>
  teamMembers.map((member) => {
    if (member.id === fromId) {
      return {
        ...member,
        activeLeads: Math.max(0, (member.activeLeads || 0) - 1),
      };
    }
    if (member.id === toId) {
      return { ...member, activeLeads: (member.activeLeads || 0) + 1 };
    }
    return member;
  });

// Recompute activeLeads from the actual lead list (used after delete / reset).
export const syncWorkload = (teamMembers, leads) => {
  const counts = leads.reduce((acc, lead) => {
    if (lead.assignedToId)
      acc[lead.assignedToId] = (acc[lead.assignedToId] || 0) + 1;
    return acc;
  }, {});

  return teamMembers.map((member) => ({
    ...member,
    activeLeads: counts[member.id] || 0,
  }));
};

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------
const CSV_COLUMNS = [
  ["id", "Lead ID"],
  ["fullName", "Full Name"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["alternateContactName", "Additional Contact Name"],
  ["alternateContactRelationship", "Additional Contact Role / Relationship"],
  ["alternateContactEmail", "Additional Contact Email"],
  ["alternateContactPhone", "Additional Contact Phone"],
  ["alternateContactMethod", "Additional Contact Preferred Method"],
  ["company", "Company"],
  ["jobTitle", "Job Title"],
  ["country", "Country"],
  ["platform", "Platform"],
  ["platformCampaign", "Campaign"],
  ["inquiryType", "Inquiry Type"],
  ["budget", "Budget"],
  ["priority", "Priority"],
  ["status", "Status"],
  ["assignedToName", "Assigned To"],
  ["preferredContact", "Preferred Contact"],
  ["createdAt", "Created At"],
  ["summary", "Summary"],
];

const escapeCsvCell = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export const leadsToCsv = (leads) => {
  const header = CSV_COLUMNS.map(([, label]) => escapeCsvCell(label)).join(",");
  const rows = leads.map((lead) =>
    CSV_COLUMNS.map(([key]) => escapeCsvCell(lead[key])).join(","),
  );
  return [header, ...rows].join("\r\n");
};

export const downloadCsv = (leads, filename = "klarit-leads.csv") => {
  // Prefix the BOM so Excel opens UTF-8 names correctly.
  const blob = new Blob([`\uFEFF${leadsToCsv(leads)}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
