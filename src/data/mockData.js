// Initial Mock Team Members (Sales & Contact Representatives)
export const initialTeamMembers = [
  {
    id: 'rep-1',
    name: 'Sarah Jenkins',
    role: 'Senior Enterprise Account Executive',
    email: 'sarah.jenkins@nexuscrm.io',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    specialties: ['Enterprise Software', 'SaaS', 'LinkedIn Leads'],
    status: 'Available',
    statusColor: '#10b981', // green
    activeLeads: 5,
    avgResponseTime: '11 mins',
    quotaAttainment: '118%',
  },
  {
    id: 'rep-2',
    name: 'Marcus Vance',
    role: 'Inbound Growth & Solutions Specialist',
    email: 'marcus.vance@nexuscrm.io',
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    specialties: ['Website Inbound', 'Product Demos', 'Google Search'],
    status: 'Available',
    statusColor: '#10b981',
    activeLeads: 3,
    avgResponseTime: '8 mins',
    quotaAttainment: '104%',
  },
  {
    id: 'rep-3',
    name: 'Priya Sharma',
    role: 'Partnerships & SMB Lead Consultant',
    email: 'priya.sharma@nexuscrm.io',
    phone: '+44 20 7946 0912',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    specialties: ['Referrals', 'Strategic Partnerships', 'Instagram / Social'],
    status: 'In Call',
    statusColor: '#f59e0b', // amber
    activeLeads: 6,
    avgResponseTime: '15 mins',
    quotaAttainment: '95%',
  },
  {
    id: 'rep-4',
    name: 'Alex Rivera',
    role: 'Technical Solutions Architect & Lead Rep',
    email: 'alex.rivera@nexuscrm.io',
    phone: '+1 (555) 345-9876',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    specialties: ['API & Custom Integrations', 'High-Touch Enterprise'],
    status: 'Available',
    statusColor: '#10b981',
    activeLeads: 4,
    avgResponseTime: '14 mins',
    quotaAttainment: '112%',
  },
  {
    id: 'rep-5',
    name: 'Elena Rostova',
    role: 'Client Success & Outreach Coordinator',
    email: 'elena.rostova@nexuscrm.io',
    phone: '+49 30 901820',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    specialties: ['Events & Conferences', 'Europe Accounts', 'Twitter/X'],
    status: 'Busy',
    statusColor: '#ef4444', // red
    activeLeads: 7,
    avgResponseTime: '22 mins',
    quotaAttainment: '98%',
  }
];

// Acquisition Platforms metadata
export const acquisitionPlatforms = [
  {
    id: 'website',
    name: 'Company Website',
    icon: 'Globe',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    color: '#818cf8',
    description: 'Direct contact form or demo landing page',
    category: 'Inbound'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'Linkedin',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    color: '#60a5fa',
    description: 'InMail message, LinkedIn Ad, or Profile outreach',
    category: 'Social / B2B'
  },
  {
    id: 'google',
    name: 'Google Ads / Search',
    icon: 'Search',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    color: '#34d399',
    description: 'Organic search query or PPC campaign ad',
    category: 'Search Engine'
  },
  {
    id: 'instagram',
    name: 'Instagram / Meta',
    icon: 'Instagram',
    badgeColor: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    color: '#f472b6',
    description: 'DM inquiry, Instagram sponsored story or reel',
    category: 'Social'
  },
  {
    id: 'referral',
    name: 'Client / Partner Referral',
    icon: 'Users',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    color: '#fbbf24',
    description: 'Recommended by an existing customer or alliance',
    category: 'Word of Mouth'
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: 'Twitter',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    color: '#38bdf8',
    description: 'Post mention, direct thread, or promoted post',
    category: 'Social'
  },
  {
    id: 'event',
    name: 'Trade Show / Conference',
    icon: 'Calendar',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    color: '#c084fc',
    description: 'Met at Tech Summit, booth scan or networking meetup',
    category: 'Events'
  },
  {
    id: 'email_campaign',
    name: 'Email Outreach / Newsletter',
    icon: 'Mail',
    badgeColor: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    color: '#2dd4bf',
    description: 'Replied to product newsletter or cold sequence',
    category: 'Outbound'
  }
];

// Initial preloaded leads for CRM realism
export const initialLeads = [
  {
    id: 'lead-101',
    fullName: 'Jonathan Reed',
    email: 'j.reed@vertexdynamics.com',
    phone: '+1 (415) 890-1234',
    company: 'Vertex Dynamics',
    jobTitle: 'VP of Engineering',
    country: 'United States',
    platform: 'linkedin',
    platformCampaign: 'Q4 Enterprise Cloud Modernization Ad',
    inquiryType: 'Enterprise Software',
    budget: '$50k - $100k',
    priority: 'Urgent',
    summary: 'Evaluating replacement for our legacy CRM. Need custom bi-directional Salesforce & HubSpot data sync, multi-region role-based permissions, and SOC-2 Type II compliance. Requesting immediate architecture review.',
    assignedToId: 'rep-1',
    assignedToName: 'Sarah Jenkins',
    status: 'Contacted',
    createdAt: '2026-11-02T09:15:00Z',
    preferredContact: 'Video Meeting',
    notes: [
      { id: 'n1', author: 'Sarah Jenkins', time: '10:00 AM', text: 'Sent intro email with our technical security whitepaper. Scheduled initial discovery call for tomorrow at 2 PM EST.' }
    ]
  },
  {
    id: 'lead-102',
    fullName: 'Sophia Chen',
    email: 'sophia@luminahealth.io',
    phone: '+1 (206) 774-8832',
    company: 'Lumina Health Labs',
    jobTitle: 'Head of Operations',
    country: 'United States',
    platform: 'google',
    platformCampaign: 'Google Search Keyword: "HIPAA compliant CRM"',
    inquiryType: 'Product Demo & Pricing',
    budget: '$20k - $50k',
    priority: 'High',
    summary: 'Looking to streamline our patient intake triage and assign clinical outreach specialists in real time. We saw your live demo video on Google and want to discuss annual team licensing.',
    assignedToId: 'rep-2',
    assignedToName: 'Marcus Vance',
    status: 'In Progress',
    createdAt: '2026-11-02T10:45:00Z',
    preferredContact: 'Phone Call',
    notes: [
      { id: 'n2', author: 'Marcus Vance', time: '11:15 AM', text: 'Conducted 15-min qualification call. Sophia is the primary decision maker. Preparing custom proposal for 45 seats.' }
    ]
  },
  {
    id: 'lead-103',
    fullName: 'Mateo Morales',
    email: 'mmorales@iberotech.es',
    phone: '+34 91 123 4567',
    company: 'IberoTech Solutions',
    jobTitle: 'Chief Commercial Officer',
    country: 'Spain',
    platform: 'referral',
    platformCampaign: 'Referred by Javier at CloudSphere',
    inquiryType: 'Partnership / Reseller',
    budget: '$50k+',
    priority: 'High',
    summary: 'Javier recommended your platform for European mid-market distribution. We have an established portfolio of 120+ B2B clients looking for an integrated client intake and lead routing portal.',
    assignedToId: 'rep-3',
    assignedToName: 'Priya Sharma',
    status: 'New',
    createdAt: '2026-11-02T11:30:00Z',
    preferredContact: 'Email',
    notes: []
  },
  {
    id: 'lead-104',
    fullName: 'Amara Okafor',
    email: 'a.okafor@stridefintech.co',
    phone: '+44 20 7946 0881',
    company: 'Stride FinTech',
    jobTitle: 'Product Operations Director',
    country: 'United Kingdom',
    platform: 'website',
    platformCampaign: 'Main Website Homepage Contact Form',
    inquiryType: 'Technical Consultation',
    budget: '$20k - $50k',
    priority: 'Medium',
    summary: 'We need automated assignment rules based on incoming lead credit thresholds. Our sales reps currently manually triage spreadsheets, causing 48-hour delays. We want webhook trigger automation.',
    assignedToId: 'rep-4',
    assignedToName: 'Alex Rivera',
    status: 'New',
    createdAt: '2026-11-02T12:10:00Z',
    preferredContact: 'WhatsApp',
    notes: []
  }
];

// Sample prefill templates for fast 1-click user testing
export const samplePresets = [
  {
    label: 'High-Value Enterprise Lead',
    data: {
      fullName: 'David K. Sterling',
      email: 'd.sterling@auroraglobal.com',
      phone: '+1 (650) 441-9920',
      company: 'Aurora Global Systems',
      jobTitle: 'Chief Revenue Officer',
      country: 'United States',
      platform: 'linkedin',
      platformCampaign: 'LinkedIn Sponsored InMail - Enterprise Expansion',
      inquiryType: 'Enterprise Software',
      budget: '$100k+',
      priority: 'Urgent',
      summary: 'Our global sales team (250+ reps across US, EMEA, APAC) needs an unified lead intake system that instantly captures platform source attribution, generates summaries, and assigns the best rep within 60 seconds.',
      preferredContact: 'Video Meeting',
      bestTime: 'Morning (9am - 12pm)',
      targetRepId: 'rep-1'
    }
  },
  {
    label: 'Inbound Growth Lead',
    data: {
      fullName: 'Emily Thorne',
      email: 'emily@thornecreative.co',
      phone: '+1 (312) 555-0199',
      company: 'Thorne Creative Studios',
      jobTitle: 'Managing Partner',
      country: 'United States',
      platform: 'instagram',
      platformCampaign: 'Instagram Ad Campaign #CreativeGrowth26',
      inquiryType: 'Product Demo & Pricing',
      budget: '$5k - $20k',
      priority: 'High',
      summary: 'We run high volume design client campaigns across social platforms. We need a frontend where prospective clients submit their brand details and creative brief summary, automatically routing to our creative directors.',
      preferredContact: 'WhatsApp',
      bestTime: 'Afternoon (1pm - 5pm)',
      targetRepId: 'rep-3'
    }
  },
  {
    label: 'Technical Integration Lead',
    data: {
      fullName: 'Liam Becker',
      email: 'lbecker@synthetix.de',
      phone: '+49 89 2444 391',
      company: 'Synthetix AI GmbH',
      jobTitle: 'Lead AI Engineer',
      country: 'Germany',
      platform: 'google',
      platformCampaign: 'Google Search: "Automated Lead Routing API"',
      inquiryType: 'Technical Consultation',
      budget: '$20k - $50k',
      priority: 'Urgent',
      summary: 'Seeking front-end webhook and REST API capabilities to ingest lead platform parameters, summarize inquiry context using LLM, and trigger automatic round-robin assignment to technical advisors.',
      preferredContact: 'Email',
      bestTime: 'Anytime',
      targetRepId: 'rep-4'
    }
  }
];
