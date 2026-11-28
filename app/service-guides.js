export const serviceGuides = {
  'real-estate-marketing': {
    sample: ['Example launch brief', 'A residential project needs bookings for its first open weekend.', 'Publish a walkthrough and a location guide, send paid traffic to a visit booking page, and give the sales team a queue with source and preferred visit date. Review confirmed and attended visits separately.'],
    workflow: [['Prepare the offer', 'Agree which approved project details, plans and claims can go into ads.'], ['Open the booking path', 'Check the landing page, enquiry form and first response on a phone.'], ['Review visit quality', 'Compare enquiries, confirmed visits and attendance by source.']],
    inputs: ['Approved brochure and project details', 'Launch dates and media budget', 'Sales contact and current follow-up process'],
  },
  'social-media-marketing-jaipur': {
    sample: ['Example content week', 'One property visit, three reasons to watch.', 'A developer needs a week of Instagram content before opening model-home viewings.'],
    workflow: [['Audit the channels', 'Review existing posts, ad accounts and recent enquiries to identify what customers respond to.'], ['Produce and approve', 'Batch scripts and artwork, agree who approves copy, and schedule posts around campaigns.'], ['Review the response', 'Compare watch time, clicks, messages and qualified leads to choose the next batch.']],
    inputs: ['Social account links', 'Brand guidelines and approved assets', 'Campaign goals and approval owner'],
  },
  ivr: {
    sample: ['Example phone menu', 'A caller asks about a new project after hours.', 'A property sales office receives calls outside its staffed hours and needs a clear path for both new and existing buyers.'],
    workflow: [['Write the menu', 'Keep keypad choices short and use words callers recognize.'], ['Route and test', 'Check sales, support, after-hours and unavailable-agent paths from a separate phone.'], ['Review missed calls', 'Agree who sees missed enquiries and how the team records callbacks.']],
    inputs: ['Business hours and holidays', 'Numbers for each team', 'Greeting languages and escalation contact'],
  },
  rcs: {
    sample: ['Example RCS card', 'Help a buyer respond to a site visit reminder.', 'A buyer has already booked a visit. The team wants the reminder to show the property and make directions easy to find.'],
    workflow: [['Choose the message', 'Choose one useful notification and keep its primary action clear.'], ['Prepare the fallback', 'Test branding, links and fallback copy before sending to opted-in recipients.'], ['Compare actions', 'Review which action customers used and whether they completed it.']],
    inputs: ['Brand identity and sender details', 'Approved message copy and media', 'Opt-in audience and fallback text'],
  },
  'whatsapp-business-api': {
    sample: ['Example visit follow-up', 'A buyer requests directions after making an enquiry.', 'The sales team wants buyers to get location details in the same WhatsApp conversation where they first enquired.'],
    workflow: [['Map real enquiries', 'Start with frequent requests and identify which ones need a person.'], ['Prepare templates and handoff', 'Agree on opt-in, approvals and notification ownership.'], ['Pilot one workflow', 'Test with a small audience and review response time and successful handoffs.']],
    inputs: ['Business account and phone number', 'Typical enquiries and message examples', 'Team members who handle escalations'],
  },
  seo: {
    sample: ['Example local SEO audit', 'Help Jaipur shoppers find a textile shop.', 'Imagine a Jaipur textile shop that appears for its name but gets few search visits from people looking for block-printed fabrics.'],
    workflow: [['Audit the website', 'Check crawlability and indexing, review existing search data and identify the issues affecting priority pages.'], ['Improve pages and local listings', 'Connect each priority search need to a useful page and review Business Profile details for accuracy.'], ['Measure and refine', 'Track organic visibility and enquiries separately, then agree which improvements to make next.']],
    inputs: ['Website and Google Business Profile link', 'Priority services and areas actually served', 'Read access to Search Console and analytics, if available'],
  },
  'ppc-advertising': {
    sample: ['Example campaign split', 'A new development needs demand beyond people already searching for it.', 'A development launch needs both enquiries from active searchers and a way to reach buyers who have yet to hear about the project.'],
    workflow: [['Agree on the outcome', 'Define the conversion and how the sales team qualifies it.'], ['Build and launch', 'Create separate ad groups, assets and destination links.'], ['Adjust with evidence', 'Review search terms, creative response and qualified lead costs.']],
    inputs: ['Target geography and budget', 'Campaign offer and approved claims', 'Ad account and conversion access'],
  },
  branding: {
    sample: ['Example brand rollout', 'A property developer needs the launch brochure, ads and site signage to feel like the same project.', 'The brochure, site signage and ads were produced by different teams. Buyers need to recognize the development across all three.'],
    workflow: [['Understand the brand', 'Compare audience expectations, existing materials and competitors.'], ['Set the system', 'Agree on positioning, typography, color and imagery.'], ['Apply to real formats', 'Check the system on the assets the team needs first.']],
    inputs: ['Existing brand materials', 'Audience and competitor examples', 'Priority formats and deadlines'],
  },
  'content-writing': {
    sample: ['Example page brief', 'A service page gets visits but buyers keep asking what is included.', 'The sales team is spending calls answering the same questions about scope, inclusions and when the work can start.'],
    workflow: [['Gather facts', 'Interview the team and collect approved claims and examples.'], ['Outline the page', 'Use the customer’s questions to order headings and supporting details.'], ['Review and deliver', 'Check tone, accuracy and calls to action with the owner.']],
    inputs: ['Target reader and page goal', 'Sales FAQs and approved references', 'Tone and review requirements'],
  },
  'bulk-sms': {
    sample: ['Example appointment reminder', 'Send the time and location before a booked visit.', 'A sales team wants to remind opted-in buyers about confirmed visits and give anyone whose plans change a way to reschedule.'],
    workflow: [['Define the audience', 'Use the relevant opted-in list and remove outdated records.'], ['Check the template', 'Review sender details, message wording and links before sending.'], ['Review delivery', 'Look at failed deliveries and update contact records as needed.']],
    inputs: ['Message purpose', 'Opted-in recipient list', 'Sender and template details'],
  },
  'voice-sms': {
    sample: ['Example recorded update', 'A sales team needs to remind buyers about a viewing window.', 'A development has a new viewing window to announce to opted-in buyers. The team needs a short call buyers can understand on first listen.'],
    workflow: [['Write a short script', 'Put the reason for the call in the first sentence.'], ['Record and approve', 'Check pronunciation, pace and the callback number.'], ['Schedule and review', 'Send at an appropriate time and review completed calls.']],
    inputs: ['Script and language', 'Audience and send window', 'Callback information'],
  },
  'web-development': {
    sample: ['Example website brief', 'A property team needs enquiries to reach the correct project adviser.', 'A developer lists several properties on one website. Advisers need every new enquiry to identify the development the buyer was viewing.'],
    workflow: [['Map the pages', 'Agree on the navigation, content owners and primary customer tasks.'], ['Build the experience', 'Design responsive layouts and connect forms or booking tools.'], ['Prepare handover', 'Check device layouts, links and what the team will update after launch.']],
    inputs: ['Current domain and site access', 'Page content and photography', 'Forms, integrations and launch requirements'],
  },
  'mobile-app-development': {
    sample: ['Example app flow', 'A field representative needs to record a visit on the move.', 'Field staff currently report visits by phone. The first release gives them one shared record of the visits they’re assigned.'],
    workflow: [['Choose the core task', 'Focus the first release on a small set of frequent actions.'], ['Prototype the flow', 'Try the key screens with the people who will use them.'], ['Plan release and support', 'Define supported devices, updates and who handles operational issues.']],
    inputs: ['User groups and supported devices', 'Core workflow and access needs', 'Existing data and integration details'],
  },
  'graphic-design': {
    sample: ['Example creative pack', 'One project launch needs a consistent set of ad and social formats.', 'The launch team needs one campaign visual that can work as a square post, a vertical story and a wide display ad.'],
    workflow: [['Confirm the placement', 'List sizes, formats, deadlines and where the work will appear.'], ['Design the core artwork', 'Use approved copy and imagery to establish a clear visual order.'], ['Adapt and export', 'Deliver the formats and sizes needed for each placement.']],
    inputs: ['Logo and brand assets', 'Approved copy and photography', 'Placement sizes and deadlines'],
  },
  'landing-page-design': {
    sample: ['Example property landing page', 'A paid campaign invites buyers to book a site visit.', 'The ad promises a site visit. The landing page needs enough property information for interested buyers to decide whether to request one.'],
    workflow: [['Define one conversion', 'Agree which action the page should support and what the follow-up looks like.'], ['Build the page and form', 'Put the offer, proof and next step in a clear order.'], ['Check the full journey', 'Submit the form from an ad link and confirm attribution and the thank-you state.']],
    inputs: ['Traffic source and campaign offer', 'Approved photos and proof', 'Form fields and lead destination'],
  },
  'seo-branding': {
    sample: ['Example positioning brief', 'A local business wants search visitors to recognize the brand and understand its offer.', 'A business uses different service names on Google, its website and its sales materials. Customers should be able to recognize the same offer in each place.'],
    workflow: [['Review current material', 'Check how services are named across the website and profiles.'], ['Unify language and visuals', 'Define the naming, proof and visual direction.'], ['Deploy and measure', 'Update the priority pages and track relevant enquiries.']],
    inputs: ['Existing brand guide and website', 'Target locations and priority services', 'Performance baseline if available'],
  },
}
