import { enrich } from './editorial-content'

const service = (title, intro, image, sections) => ({ title, intro, image, label: 'Services', sections })

export const pages = {
  services: {
    title: 'Services that move enquiries forward.', label: 'Services',
    intro: 'Build demand, answer customers and give them a clear next step.', image: 'seo.jpg',
    sections: [
      { id: 'marketing', heading: 'Digital marketing', text: 'Plan the campaign, create the content and measure which enquiries it brings.', links: [
        ['Real estate marketing', '/services/real-estate-marketing/'],
        ['Social media marketing', '/services/social-media-marketing-jaipur/'],
        ['SEO and branding', '/services/seo-branding/'],
      ] },
      { id: 'promote', heading: 'Cloud communications', text: 'Help customers reach your team and follow up on the channels they use.', links: [
        ['IVR', '/services/ivr/'], ['RCS messaging', '/services/rcs/'],
        ['WhatsApp Business API', '/services/whatsapp-business-api/'], ['Bulk and voice SMS', '/services/bulk-sms/'],
      ] },
      { id: 'development', heading: 'Web and app development', text: 'Give campaigns and conversations a destination built around the next action.', links: [['Web and app development', '/services/web-development/']] },
    ],
  },
  'services/real-estate-marketing': service('From property search to site visit.', 'Launch residential and commercial projects with campaign creative, landing pages and coordinated lead follow-up.', 'estate-hero.jpg', [
    { heading: 'Prepare the launch', text: 'Define the buyer, project positioning and campaign offer. Build the property landing page before paid traffic starts.', image: 'estate.jpg' },
    { heading: 'Turn interest into enquiries', text: 'Use project films, social campaigns and clear enquiry forms. Track which campaigns lead to conversations and site visit requests.', image: 'property.webp' },
    { heading: 'Follow up and book a visit', text: 'Route new enquiries to the team, confirm appointment details on WhatsApp and monitor how many enquiries progress to a visit.', links: [['Explore projects', '/portfolio/']] },
  ]),
  'services/social-media-marketing-jaipur': service('Social media marketing in Jaipur.', 'Make your brand easier to find with content, paid campaigns and regular reporting.', 'social.jpg', [
    { heading: 'Choose the right platforms', text: 'Plan formats for Instagram, Facebook, YouTube, LinkedIn, X and Pinterest around where your audience spends time.' },
    { heading: 'Create a campaign people can act on', text: 'Produce reels, posts and ad creative. Give each campaign a clear path to a landing page, WhatsApp conversation or enquiry form.', image: 'design.jpg' },
    { heading: 'Measure what drives enquiries', text: 'Review creative performance, campaign spend and enquiry quality before deciding what to improve.' },
  ]),
  'services/ivr': service('Route every call to the right team.', 'Give callers a clear menu and help sales and support teams pick up the right conversations.', 'web.jpg', [
    { heading: 'Map your call flow', text: 'Choose the greeting, keypad options, team destinations and what happens when no one is available.', steps: ['Incoming call', 'Choose a department', 'Reach the right team'] },
    { heading: 'Plan for missed calls', text: 'Set business hours and agree how the team should follow up when a caller cannot connect.' },
  ]),
  'services/rcs': service('Make business messages easier to act on.', 'Send branded updates with images and actions such as booking a visit or opening a confirmation page.', 'sms.jpg', [
    { heading: 'Design the message around the next step', text: 'Combine a short update, relevant image and clear action. Plan an SMS fallback for recipients without RCS support.', steps: ['Project update', 'View property details', 'Request a visit'] },
    { heading: 'Set up a pilot', text: 'Choose an opt-in audience, confirm message requirements and review delivery and responses before expanding.' },
  ]),
  'services/whatsapp-business-api': service('Keep customer conversations moving.', 'Use WhatsApp Business API for enquiries, reminders and follow-up, with a clear handoff to your team.', 'wa.jpg', [
    { heading: 'Start with the conversations you already handle', text: 'Identify the most common questions and automate straightforward replies. Send complex requests to a team member.', steps: ['Customer enquiry', 'Quick reply or template', 'Team handoff'] },
    { heading: 'Follow up with permission', text: 'Plan how customers opt in, which approved templates you need and when reminders are useful.' },
  ]),
  'services/seo-branding': service('Get found. Build recognition.', 'Connect search visibility with a consistent brand and useful content.', 'seo.jpg', [
    { heading: 'Make local discovery easier', text: 'Improve service pages and local listings around the questions customers ask.' },
    { heading: 'Build a recognizable identity', text: 'Define how your brand looks and sounds across campaigns, websites and social media.' },
  ]),
  'services/bulk-sms': service('Send timely updates at scale.', 'Deliver reminders, alerts and recorded updates to customers who have opted in.', 'sms.jpg', [
    { heading: 'Plan the audience and message', text: 'Choose the right contact group, write the update and agree when to send it.' },
  ]),
  'services/web-development': service('Build a clearer path to action.', 'Create responsive websites, mobile apps and focused landing pages for customer journeys.', 'web.jpg', [
    { heading: 'Design around customer goals', text: 'Work out what customers need to browse, book or enquire, then build around that flow.' },
  ]),
  portfolio: { title: 'Explore our work.', label: 'Projects', intro: 'See how campaign creative and follow-up fit together.', image: 'estate.jpg', sections: [
    { heading: 'Residential campaign concept', text: 'A property marketing example that combines project visuals, enquiry capture and visit follow-up.', image: 'property.webp', links: [['View campaign concept', '/portfolio/residential-campaign/']] },
  ] },
  'portfolio/residential-campaign': { title: 'Residential campaign concept.', label: 'Projects', intro: 'An illustrative property marketing project from discovery to enquiry.', image: 'property.webp', sections: [
    { heading: 'Campaign approach', text: 'Use project photography and a focused landing page to explain the offer and capture interest.' },
    { heading: 'Site visit follow-up', text: 'Send confirmation and reminders after a buyer requests a visit.' },
  ] },
  about: { title: 'Meet Movictel.', label: 'About', intro: 'A Jaipur team working across digital campaigns, business messaging and development.', image: 'design.jpg', sections: [
    { heading: 'How we work', text: 'Start with the customer journey, choose a measurable next step and build the campaign or tool around it.' },
    { heading: 'Selected work', text: 'Explore how we bring that approach to property campaigns.', links: [['See projects', '/portfolio/']] },
  ] },
  contact: { title: 'Let’s work together.', label: 'Contact', intro: 'Tell us about your project, campaign or customer communication needs.', sections: [
    { heading: 'Speak to Movictel', text: 'Call +91 90019 55232 or send us a message on WhatsApp.', links: [['Book a consultation', '/book-a-consultation/']] },
    { heading: 'Careers', text: 'Get in touch to share your work and ask about opportunities at Movictel.' },
  ] },
  'book-a-consultation': { title: 'Book a consultation.', label: 'Contact', intro: 'Tell us what you’re working on and where you want to start.', form: true, sections: [] },
  blog: { title: 'Movictel insights.', label: 'Blog', intro: 'Practical ideas for property campaigns, social content and customer communications.', sections: [
    { heading: 'Plan a property launch', text: 'Start with positioning, a landing page and a clear follow-up flow.', links: [['See the real estate playbook', '/services/real-estate-marketing/']] },
    { heading: 'Plan your WhatsApp follow-up', text: 'Map your replies and team handoff around the questions customers actually ask.', links: [['See WhatsApp Business API', '/services/whatsapp-business-api/']] },
  ] },
}

enrich(pages)
