export interface SOPTemplate {
  id: string
  name: string
  category: string
  description: string
  content: string
}

export const sopTemplates: SOPTemplate[] = [
  {
    id: 'kitchen-opening',
    name: 'Kitchen Opening Procedures',
    category: 'Kitchen Operations',
    description: 'Daily kitchen opening checklist and setup procedures',
    content: `<h2>Overview</h2>
<p><strong>⏱️ Time Required:</strong> 30 minutes before service</p>
<p>Complete daily kitchen opening procedures to ensure food safety, equipment readiness, and service quality.</p>

<h2>Safety Requirements</h2>
<ul>
<li>Wash hands thoroughly before starting</li>
<li>Wear proper PPE (apron, hair net, closed-toe shoes)</li>
<li>Check that all emergency exits are clear</li>
<li>Ensure fire suppression system is active</li>
</ul>

<h2>Required Equipment</h2>
<ul>
<li>Thermometer (digital, calibrated)</li>
<li>Sanitizer test strips</li>
<li>Temperature log sheets</li>
<li>Cleaning supplies and sanitizers</li>
</ul>

<h2>Procedure Steps</h2>
<ol>
<li><strong>Temperature Checks</strong> - Check all refrigerator and freezer temperatures (refrigerators: 32-40°F, freezers: 0°F or below). Record on temperature log.</li>
<li><strong>Equipment Setup</strong> - Turn on all cooking equipment and allow to reach proper temperatures. Verify hot holding equipment reaches 140°F minimum.</li>
<li><strong>Hand Wash Stations</strong> - Fill all hand wash stations with soap and ensure hot water is available (minimum 100°F).</li>
<li><strong>Sanitizer Setup</strong> - Prepare sanitizer buckets with proper concentration (50-100 ppm chlorine or manufacturer specifications).</li>
<li><strong>Food Inspection</strong> - Check all prepared foods for freshness, proper storage, and labeling. Discard any expired items.</li>
<li><strong>Prep Station Setup</strong> - Stock prep stations with necessary ingredients and ensure proper cold chain maintenance.</li>
<li><strong>Surface Sanitization</strong> - Sanitize all work surfaces, cutting boards, and utensils.</li>
</ol>

<h2>Quality Standards</h2>
<ul>
<li>All equipment must reach proper operating temperatures</li>
<li>Sanitizer concentration must test within proper range</li>
<li>All food items must be properly labeled with dates</li>
<li>Work surfaces must be clean and sanitized</li>
</ul>

<h2>Troubleshooting</h2>
<ul>
<li><strong>Equipment not heating:</strong> Check power connections, call maintenance if needed</li>
<li><strong>Wrong sanitizer concentration:</strong> Adjust chemical mixture and retest</li>
<li><strong>Expired food items:</strong> Remove immediately and document waste</li>
</ul>`
  },
  {
    id: 'food-safety-incident',
    name: 'Food Safety Incident Response',
    category: 'Food Safety',
    description: 'Emergency procedures for handling food safety incidents',
    content: `<h2 style="color: #1f2937; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem 0;">Overview</h2>
<p style="margin: 1rem 0; padding: 0.75rem; background-color: #f3f4f6; border-radius: 0.5rem; border-left: 4px solid #3b82f6;"><strong>⏱️ Time Required:</strong> Immediate action required</p>
<p style="margin: 1rem 0; line-height: 1.6; color: #374151;">Emergency response procedures for food safety incidents including contamination, illness, or equipment failure.</p>

<h2 style="color: #1f2937; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem 0;">Safety Requirements</h2>
<ul style="margin: 1rem 0; padding-left: 1.5rem; line-height: 1.8;">
  <li style="margin: 0.5rem 0; color: #374151;">Immediately isolate affected area</li>
  <li style="margin: 0.5rem 0; color: #374151;">Wear gloves and protective equipment</li>
  <li style="margin: 0.5rem 0; color: #374151;">Do not allow anyone to consume potentially affected food</li>
  <li style="margin: 0.5rem 0; color: #374151;">Document everything with photos if safe to do so</li>
</ul>

<h2 style="color: #1f2937; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem 0;">Procedure Steps</h2>
<ol style="margin: 1rem 0; padding-left: 1.5rem; line-height: 1.8;">
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Immediate Response</strong> - Stop food service immediately if contamination is suspected. Secure the area.</li>
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Isolate Products</strong> - Remove all potentially affected food from service. Label and segregate.</li>
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Notify Management</strong> - Immediately contact the manager on duty and general manager.</li>
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Document Incident</strong> - Record time, date, products affected, potential cause, and actions taken.</li>
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Customer Safety</strong> - If customers have been served, identify and notify them if health risk exists.</li>
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Contact Authorities</strong> - For serious incidents, contact local health department within 24 hours.</li>
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Investigation</strong> - Determine root cause and implement corrective actions.</li>
  <li style="margin: 0.5rem 0; color: #374151;"><strong>Follow-up</strong> - Monitor situation and ensure all safety measures are maintained.</li>
</ol>

<h2 style="color: #1f2937; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem 0;">Resources & Files</h2>
<div style="margin: 1rem 0;">
  <div style="margin: 0.5rem 0; padding: 0.75rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.375rem;">
    <a href="https://docs.google.com/document/d/example-incident-report" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500;">
      📝 Food Safety Incident Report Template
    </a>
  </div>
  <div style="margin: 0.5rem 0; padding: 0.75rem; background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 0.375rem;">
    <a href="https://docs.google.com/document/d/example-health-dept-contacts" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 500;">
      📄 Emergency Contact List (Health Department)
    </a>
  </div>
</div>

<h2 style="color: #1f2937; font-size: 1.5rem; font-weight: 600; margin: 2rem 0 1rem 0;">Quality Standards</h2>
<ul style="margin: 1rem 0; padding-left: 1.5rem; line-height: 1.8;">
  <li style="margin: 0.5rem 0; color: #374151;">All incidents must be documented within 2 hours</li>
  <li style="margin: 0.5rem 0; color: #374151;">Affected products must be clearly labeled "DO NOT USE"</li>
  <li style="margin: 0.5rem 0; color: #374151;">Investigation must identify root cause</li>
  <li style="margin: 0.5rem 0; color: #374151;">Corrective actions must be implemented before resuming service</li>
</ul>`
  },
  {
    id: 'customer-complaint',
    name: 'Customer Complaint Handling',
    category: 'Customer Service',
    description: 'Professional resolution of customer complaints and feedback',
    content: `<h2>Overview</h2>
<p><strong>⏱️ Time Required:</strong> 5-15 minutes per complaint</p>
<p>Professional and empathetic approach to resolving customer complaints while maintaining service quality.</p>

<h2>Procedure Steps</h2>
<ol>
<li><strong>Listen Actively</strong> - Allow customer to fully explain the issue without interruption. Show empathy and understanding.</li>
<li><strong>Apologize Sincerely</strong> - Offer a genuine apology for the inconvenience, regardless of fault.</li>
<li><strong>Assess the Situation</strong> - Determine the nature and severity of the complaint. Identify if it's food quality, service, or facility related.</li>
<li><strong>Offer Solutions</strong> - Present appropriate options: remake item, discount, refund, or alternative compensation.</li>
<li><strong>Take Action</strong> - Implement the agreed solution promptly and professionally.</li>
<li><strong>Follow Up</strong> - Check back with customer to ensure satisfaction with resolution.</li>
<li><strong>Document</strong> - Record complaint details and resolution in complaint log.</li>
<li><strong>Report to Management</strong> - Inform manager of any serious complaints or patterns.</li>
</ol>

<h2>Quality Standards</h2>
<ul>
<li>Acknowledge complaint within 30 seconds</li>
<li>Maintain calm and professional demeanor</li>
<li>Offer fair and reasonable compensation</li>
<li>Follow up to ensure customer satisfaction</li>
</ul>`
  },
  {
    id: 'closing-front-house',
    name: 'Front of House Closing',
    category: 'Front of House',
    description: 'End-of-shift closing procedures for dining area',
    content: `<h2>Overview</h2>
<p><strong>⏱️ Time Required:</strong> 45-60 minutes after last customer</p>
<p>Complete closing procedures for front of house operations to ensure cleanliness, security, and readiness for next service.</p>

<h2>Required Equipment</h2>
<ul>
<li>Cleaning supplies (all-purpose cleaner, glass cleaner, sanitizer)</li>
<li>Vacuum cleaner</li>
<li>Mop and bucket</li>
<li>Cash counting materials</li>
<li>Closing checklist form</li>
</ul>

<h2>Procedure Steps</h2>
<ol>
<li><strong>Customer Area</strong> - Clear and clean all tables, chairs, and booths. Wipe down surfaces with sanitizer.</li>
<li><strong>Floor Care</strong> - Sweep dining area thoroughly, then vacuum carpeted areas. Mop hard surfaces.</li>
<li><strong>Service Stations</strong> - Clean and restock service stations. Empty and sanitize ice bins.</li>
<li><strong>Windows and Mirrors</strong> - Clean all windows, mirrors, and glass surfaces.</li>
<li><strong>Restrooms</strong> - Complete restroom cleaning checklist. Restock supplies.</li>
<li><strong>Cash Handling</strong> - Count cash drawer, complete sales reports, secure cash in safe.</li>
<li><strong>Final Security Check</strong> - Turn off lights, lock doors, set alarm system.</li>
</ol>

<h2>Quality Standards</h2>
<ul>
<li>All surfaces must be clean and sanitized</li>
<li>No debris on floors or furniture</li>
<li>Cash counts must balance</li>
<li>All equipment must be properly secured</li>
</ul>`
  }
]

export function getTemplateByCategory(category: string): SOPTemplate[] {
  return sopTemplates.filter(template => template.category === category)
}

export function getTemplateById(id: string): SOPTemplate | undefined {
  return sopTemplates.find(template => template.id === id)
}