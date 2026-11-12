import { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Briefcase, 
  Globe, 
  Search, 
  Users, 
  Calendar, 
  Send, 
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { LinkedInIcon, InstagramIcon, TwitterIcon } from './BrandIcons';
import { acquisitionPlatforms, samplePresets } from '../data/mockData';
import './LeadForm.css';

export default function LeadForm({ 
  isAdmin,
  onLeadSubmit, 
  prefillData 
}) {
  // Form State
  const [formData, setFormData] = useState(() => {
    const base = {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      alternateContactName: '',
      alternateContactRelationship: '',
      alternateContactEmail: '',
      alternateContactPhone: '',
      alternateContactMethod: 'Phone Call',
      country: 'United States',
      platform: 'website',
      platformCampaign: '',
      inquiryType: 'Enterprise Software',
      budget: '$20k - $50k',
      urgency: 'High',
      preferredContact: 'Video Meeting',
      bestTime: 'Morning (9am - 12pm)',
      summary: '',
    };

    if (prefillData) {
      return {
        ...base,
        fullName: prefillData.fullName || base.fullName,
        email: prefillData.email || base.email,
        phone: prefillData.phone || base.phone,
        company: prefillData.company || base.company,
        jobTitle: prefillData.jobTitle || base.jobTitle,
        alternateContactName: prefillData.alternateContactName || base.alternateContactName,
        alternateContactRelationship: prefillData.alternateContactRelationship || base.alternateContactRelationship,
        alternateContactEmail: prefillData.alternateContactEmail || base.alternateContactEmail,
        alternateContactPhone: prefillData.alternateContactPhone || base.alternateContactPhone,
        alternateContactMethod: prefillData.alternateContactMethod || base.alternateContactMethod,
        country: prefillData.country || base.country,
        platform: prefillData.platform || base.platform,
        platformCampaign: prefillData.platformCampaign || base.platformCampaign,
        inquiryType: prefillData.inquiryType || base.inquiryType,
        budget: prefillData.budget || base.budget,
        urgency: prefillData.priority || 'High',
        summary: prefillData.summary || base.summary,
        preferredContact: prefillData.preferredContact || base.preferredContact,
        bestTime: prefillData.bestTime || base.bestTime
      };
    }
    return base;
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Quick preset apply
  const applyPreset = (preset) => {
    setFormData(prev => ({ ...prev, ...preset.data }));
    setErrors({});
  };

  // Template prompt append for summary
  const appendSummaryTemplate = (templateText) => {
    setFormData(prev => ({
      ...prev,
      summary: prev.summary ? `${prev.summary} ${templateText}` : templateText
    }));
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact phone number is required';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company / Organization name is required';
    }
    if (
      formData.alternateContactEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.alternateContactEmail)
    ) {
      newErrors.alternateContactEmail = 'Please provide a valid email address';
    }
    if (!formData.platform) {
      newErrors.platform = 'Please select the acquisition channel';
    }
    if (!formData.summary.trim() || formData.summary.trim().length < 10) {
      newErrors.summary = 'Please provide a brief inquiry summary (minimum 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    const createdAt = new Date().toISOString();
    const intakeText = `Lead submitted through the client intake form via ${formData.platform}.`;
    const intakeNote = {
      id: `note-${Date.now()}`,
      author: 'Client Intake Form',
      time: new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: createdAt,
      text: intakeText
    };

    const newLeadRecord = {
      id: `lead-${Date.now()}`,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      company: formData.company.trim(),
      jobTitle: formData.jobTitle.trim() || 'Business Representative',
      alternateContactName: formData.alternateContactName.trim(),
      alternateContactRelationship: formData.alternateContactRelationship.trim(),
      alternateContactEmail: formData.alternateContactEmail.trim(),
      alternateContactPhone: formData.alternateContactPhone.trim(),
      alternateContactMethod: formData.alternateContactMethod,
      country: formData.country,
      platform: formData.platform,
      platformCampaign: formData.platformCampaign.trim() || `Inbound via ${formData.platform}`,
      inquiryType: formData.inquiryType,
      budget: formData.budget,
      priority: formData.urgency,
      summary: formData.summary.trim(),
      assignedToId: null,
      assignedToName: 'Unassigned',
      assignedRepAvatar: '',
      assignedRepRole: '',
      status: 'New',
      createdAt,
      preferredContact: formData.preferredContact,
      bestTime: formData.bestTime,
      activity: [{
        id: `activity-${intakeNote.id}`,
        type: 'intake',
        actor: intakeNote.author,
        timestamp: createdAt,
        text: intakeText
      }],
      notes: [intakeNote]
    };

    setTimeout(() => {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#c70005', '#a00605', '#ffffff']
        });
      } catch {
        // ignore if not supported
      }

      onLeadSubmit(newLeadRecord);
      setIsSubmitting(false);

      // Reset form to clean slate
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        alternateContactName: '',
        alternateContactRelationship: '',
        alternateContactEmail: '',
        alternateContactPhone: '',
        alternateContactMethod: 'Phone Call',
        country: 'United States',
        platform: 'website',
        platformCampaign: '',
        inquiryType: 'Enterprise Software',
        budget: '$20k - $50k',
        urgency: 'High',
        preferredContact: 'Video Meeting',
        bestTime: 'Morning (9am - 12pm)',
        summary: '',
      });
    }, 400);
  };

  // Helper icon renderer for platforms
  const renderPlatformIcon = (iconName, color) => {
    switch (iconName) {
      case 'Globe': return <Globe size={18} style={{ color }} />;
      case 'Linkedin': return <LinkedInIcon size={18} color={color} />;
      case 'Search': return <Search size={18} style={{ color }} />;
      case 'Instagram': return <InstagramIcon size={18} color={color} />;
      case 'Users': return <Users size={18} style={{ color }} />;
      case 'Twitter': return <TwitterIcon size={18} color={color} />;
      case 'Calendar': return <Calendar size={18} style={{ color }} />;
      case 'Mail': return <Mail size={18} style={{ color }} />;
      default: return <Globe size={18} style={{ color }} />;
    }
  };

  return (
    <div className="form-view-layout">
      {/* Primary Intake Form Card */}
      <div className="lead-form-card">
        {/* Header with Quick Presets */}
        <div className="form-header-area">
          <div className="form-title-group">
            <h2>
              <Send size={22} style={{ color: '#c70005' }} />
              Customer Details &amp; Lead Intake Form
            </h2>
            <p>
              Share your contact details and tell us how we can help. Our team will follow up with you.
            </p>
          </div>

          {isAdmin && <div className="quick-presets-bar">
            <span style={{ fontSize: '0.74rem', color: '#f1f3f5', fontWeight: 600 }}>
              Quick Presets:  
            </span>
            {samplePresets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                className="preset-chip-btn"
                onClick={() => applyPreset(preset)}
                title={`Populate ${preset.label}`}
              >
                + {preset.label}
              </button>
            ))}
          </div>}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* SECTION 1: User & Contact Details */}
          <div className="form-section-block">
            <div className="section-label-header">
              <div className="section-step-title">
                <span className="step-num">1</span>
                <span>User &amp; Organization Details</span>
              </div>
              <span className="section-helper-text">Primary contact information</span>
            </div>

            <div className="inputs-grid-2col">
              {/* Full Name */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="fullName">
                  <span>Full Name <span className="required-mark">*</span></span>
                </label>
                <div className="input-control-wrapper">
                  <span className="input-icon-prefix"><User size={16} /></span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    className="custom-input"
                    placeholder="e.g. Jonathan Reed"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>
                {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
              </div>

              {/* Email Address */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="email">
                  <span>Business Email <span className="required-mark">*</span></span>
                </label>
                <div className="input-control-wrapper">
                  <span className="input-icon-prefix"><Mail size={16} /></span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="custom-input"
                    placeholder="j.reed@company.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              {/* Phone Number */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="phone">
                  <span>Phone / WhatsApp <span className="required-mark">*</span></span>
                </label>
                <div className="input-control-wrapper">
                  <span className="input-icon-prefix"><Phone size={16} /></span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    className="custom-input"
                    placeholder="+1 (555) 234-5678"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
              </div>

              {/* Company Name */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="company">
                  <span>Company / Organization <span className="required-mark">*</span></span>
                </label>
                <div className="input-control-wrapper">
                  <span className="input-icon-prefix"><Building size={16} /></span>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="custom-input"
                    placeholder="e.g. Vertex Dynamics"
                    value={formData.company}
                    onChange={handleChange}
                  />
                </div>
                {errors.company && <span className="field-error-msg">{errors.company}</span>}
              </div>

              {/* Job Title */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="jobTitle">
                  <span>Job Title / Role</span>
                </label>
                <div className="input-control-wrapper">
                  <span className="input-icon-prefix"><Briefcase size={16} /></span>
                  <input
                    id="jobTitle"
                    name="jobTitle"
                    type="text"
                    className="custom-input"
                    placeholder="e.g. VP of Product Operations"
                    value={formData.jobTitle}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Country / Region */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="country">
                  <span>Location / Country</span>
                </label>
                <div className="input-control-wrapper">
                  <span className="input-icon-prefix"><Globe size={16} /></span>
                  <select
                    id="country"
                    name="country"
                    className="custom-select"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Germany">Germany</option>
                    <option value="India">India</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Spain">Spain</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Other / Global">Other / Global</option>
                  </select>
                </div>
              </div>

            </div>

            <div style={{ marginTop: '20px' }}>
              <div className="section-label-header">
                <div className="section-step-title">
                  <span>Additional Organization Contact</span>
                  <span style={{ fontSize: '0.72rem', color: '#f1f3f5', fontWeight: 500 }}>Optional</span>
                </div>
                <span className="section-helper-text">
                  A colleague we can reach if the primary contact is unavailable.
                </span>
              </div>

              <div className="inputs-grid-2col">
                <div className="input-field-group">
                  <label className="field-label" htmlFor="alternateContactName">
                    <span>Contact Name</span>
                  </label>
                  <div className="input-control-wrapper">
                    <span className="input-icon-prefix"><User size={16} /></span>
                    <input
                      id="alternateContactName"
                      name="alternateContactName"
                      type="text"
                      className="custom-input"
                      placeholder="e.g. Taylor Morgan"
                      value={formData.alternateContactName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label className="field-label" htmlFor="alternateContactRelationship">
                    <span>Role / Relationship to Organization</span>
                  </label>
                  <div className="input-control-wrapper">
                    <span className="input-icon-prefix"><Briefcase size={16} /></span>
                    <input
                      id="alternateContactRelationship"
                      name="alternateContactRelationship"
                      type="text"
                      className="custom-input"
                      placeholder="e.g. Operations Manager"
                      value={formData.alternateContactRelationship}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label className="field-label" htmlFor="alternateContactEmail">
                    <span>Contact Email</span>
                  </label>
                  <div className="input-control-wrapper">
                    <span className="input-icon-prefix"><Mail size={16} /></span>
                    <input
                      id="alternateContactEmail"
                      name="alternateContactEmail"
                      type="email"
                      className="custom-input"
                      placeholder="t.morgan@company.com"
                      value={formData.alternateContactEmail}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.alternateContactEmail && (
                    <span className="field-error-msg">{errors.alternateContactEmail}</span>
                  )}
                </div>

                <div className="input-field-group">
                  <label className="field-label" htmlFor="alternateContactPhone">
                    <span>Contact Phone / WhatsApp</span>
                  </label>
                  <div className="input-control-wrapper">
                    <span className="input-icon-prefix"><Phone size={16} /></span>
                    <input
                      id="alternateContactPhone"
                      name="alternateContactPhone"
                      type="tel"
                      className="custom-input"
                      placeholder="+1 (555) 234-5678"
                      value={formData.alternateContactPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label className="field-label" htmlFor="alternateContactMethod">
                    <span>How Should We Contact Them?</span>
                  </label>
                  <select
                    id="alternateContactMethod"
                    name="alternateContactMethod"
                    className="custom-select no-icon"
                    value={formData.alternateContactMethod}
                    onChange={handleChange}
                  >
                    <option value="Phone Call">Phone Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Platform Reached Us Attribution */}
          <div className="form-section-block">
            <div className="section-label-header">
              <div className="section-step-title">
                <span className="step-num">2</span>
                <span>Platform Reached Us (Acquisition Source)</span>
              </div>
              <span className="section-helper-text">Select channel through which customer initiated contact</span>
            </div>

            {/* Platform Selection Cards Grid */}
            <div className="platform-cards-grid">
              {acquisitionPlatforms.map(platform => {
                const isSelected = formData.platform === platform.id;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    className={`platform-card-btn ${isSelected ? 'selected' : ''}`}
                    style={{
                      borderColor: isSelected ? platform.color : undefined,
                      background: isSelected ? `${platform.color}20` : undefined,
                      boxShadow: isSelected ? `0 0 18px ${platform.color}33` : undefined,
                    }}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, platform: platform.id }));
                      if (errors.platform) setErrors(prev => ({ ...prev, platform: null }));
                    }}
                  >
                    <div 
                      className="platform-icon-circle"
                      style={{ 
                        background: `${platform.color}20`,
                        border: `1px solid ${platform.color}66`
                      }}
                    >
                      {renderPlatformIcon(platform.icon, platform.color)}
                    </div>

                    <div className="platform-meta-wrap">
                      <span className="platform-meta-name">{platform.name}</span>
                      <span className="platform-meta-category">{platform.category}</span>
                    </div>

                    {isSelected && (
                      <div
                        className="platform-selected-check"
                        style={{ background: platform.color }}
                      >
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            {errors.platform && <span className="field-error-msg">{errors.platform}</span>}

            {/* Campaign / Specific Referral Details */}
            <div className="input-field-group" style={{ marginTop: '12px' }}>
              <label className="field-label" htmlFor="platformCampaign">
                <span>Referral Source / Campaign Link / Ad Keyword (Optional)</span>
              </label>
              <input
                id="platformCampaign"
                name="platformCampaign"
                type="text"
                className="custom-input no-icon"
                placeholder="e.g. Q4 LinkedIn InMail Campaign or Referred by John at Acme Corp"
                value={formData.platformCampaign}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* SECTION 3: Summary & Project Scope */}
          <div className="form-section-block">
            <div className="section-label-header">
              <div className="section-step-title">
                <span className="step-num">3</span>
                <span>User Requirements &amp; Inquiry Summary</span>
              </div>
              <span className="section-helper-text">Scope, timeline, and request details</span>
            </div>

            <div className="inputs-grid-2col" style={{ marginBottom: '16px' }}>
              {/* Category */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="inquiryType">
                  <span>Inquiry Type</span>
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  className="custom-select no-icon"
                  value={formData.inquiryType}
                  onChange={handleChange}
                >
                  <option value="Enterprise Software">Enterprise Software / Platform</option>
                  <option value="Product Demo & Pricing">Product Demo &amp; Pricing</option>
                  <option value="Technical Consultation">Technical Consultation &amp; API</option>
                  <option value="Partnership / Reseller">Strategic Partnership / Reseller</option>
                  <option value="Support & Discovery">General Discovery &amp; Support</option>
                </select>
              </div>

              {/* Deal Size / Estimated Budget */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="budget">
                  <span>Estimated Deal / Budget Scope</span>
                </label>
                <select
                  id="budget"
                  name="budget"
                  className="custom-select no-icon"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="$1k - $5k">$1,000 - $5,000 (Starter)</option>
                  <option value="$5k - $20k">$5,000 - $20,000 (Growth)</option>
                  <option value="$20k - $50k">$20,000 - $50,000 (Professional)</option>
                  <option value="$50k - $100k">$50,000 - $100,000 (Enterprise)</option>
                  <option value="$100k+">$100,000+ (High-Touch Strategic)</option>
                </select>
              </div>

              {/* Urgency */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="urgency">
                  <span>Priority &amp; Urgency</span>
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  className="custom-select no-icon"
                  value={formData.urgency}
                  onChange={handleChange}
                >
                  <option value="Urgent">🔥 Urgent (Respond within 24h)</option>
                  <option value="High">⚡ High (1 - 2 business days)</option>
                  <option value="Medium">Standard (Within this week)</option>
                  <option value="Low">Low / Exploratory</option>
                </select>
              </div>

              {/* Preferred Contact Method */}
              <div className="input-field-group">
                <label className="field-label" htmlFor="preferredContact">
                  <span>Preferred Contact Channel</span>
                </label>
                <select
                  id="preferredContact"
                  name="preferredContact"
                  className="custom-select no-icon"
                  value={formData.preferredContact}
                  onChange={handleChange}
                >
                  <option value="Video Meeting">🎥 Zoom / Google Meet Call</option>
                  <option value="Phone Call">📞 Direct Phone Call</option>
                  <option value="WhatsApp">💬 WhatsApp Message</option>
                  <option value="Email">✉️ Detailed Email Summary</option>
                </select>
              </div>
            </div>

            {/* Inquiry Summary Textarea */}
            <div className="input-field-group full-width">
              <label className="field-label" htmlFor="summary">
                <span>Inquiry Summary / Requirements <span className="required-mark">*</span></span>
                <span style={{ fontSize: '0.72rem', color: '#f1f3f5' }}>
                  {formData.summary.length} characters
                </span>
              </label>

              <textarea
                id="summary"
                name="summary"
                className="custom-textarea"
                rows="4"
                placeholder="Describe the user's specific problem statement, key requirements, questions, and desired outcomes..."
                value={formData.summary}
                onChange={handleChange}
              />
              {errors.summary && <span className="field-error-msg">{errors.summary}</span>}

              {/* Clickable prompt suggestions */}
              <div className="summary-prompts-row">
                <span style={{ fontSize: '0.72rem', color: '#f1f3f5' }}>Add template snippet:</span>
                <button
                  type="button"
                  className="prompt-chip"
                  onClick={() => appendSummaryTemplate('Needs custom API integrations with existing database.')}
                >
                  + API Integrations
                </button>
                <button
                  type="button"
                  className="prompt-chip"
                  onClick={() => appendSummaryTemplate('Budget already approved for immediate Q4 deployment.')}
                >
                  + Budget Approved
                </button>
                <button
                  type="button"
                  className="prompt-chip"
                  onClick={() => appendSummaryTemplate('Looking for replacement of legacy Salesforce setup.')}
                >
                  + Salesforce Migration
                </button>
                <button
                  type="button"
                  className="prompt-chip"
                  onClick={() => appendSummaryTemplate('Requesting a tailored pricing quote for 50 team members.')}
                >
                  + 50-Seat Pricing
                </button>
              </div>
            </div>
          </div>

          {/* Form Submit Row */}
          <div className="form-submit-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f3f5', fontSize: '0.8rem' }}>
              <ShieldCheck size={18} style={{ color: '#f1f3f5' }} />
              <span>
                Your information will be used to respond to your inquiry.
              </span>
            </div>

            <button
              type="submit"
              className="submit-lead-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>Submit Inquiry</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
