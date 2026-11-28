export const serviceCutouts = {
  ivr: 'service-ivr-cutout.webp',
  'social-media-marketing-jaipur': 'service-social-cutout.webp',
}

const services = [
  { id: 'marketing', label: 'Digital marketing', description: 'Get discovered and give people a reason to enquire.', items: [
    ['Social media marketing', 'Put your offer in front of the right audience.', serviceCutouts['social-media-marketing-jaipur']],
    ['Branding services', 'Build a recognizable identity across channels.', 'service-branding.webp'],
    ['Website & local SEO', 'Help customers find you in search and on maps.', 'service-seo.webp'],
    ['Content writing', 'Explain what you offer in clear, useful copy.', 'service-writing.webp'],
  ]},
  { id: 'promote', label: 'Cloud communications', description: 'Answer enquiries and follow up where customers already are.', items: [
    ['WhatsApp Business API', 'Answer enquiries and automate customer updates.', 'service-whatsapp.webp'],
    ['Bulk SMS', 'Send timely reminders and alerts to opted-in customers.', 'service-sms.webp'],
    ['RCS messaging', 'Send rich messages with images and tappable actions.', 'service-rcs.webp'],
    ['Voice SMS', 'Share a recorded update through a phone call.', 'service-voice.webp'],
  ]},
  { id: 'development', label: 'Web & app development', description: 'Give customers a clear place to browse, book or get in touch.', items: [
    ['Website development', 'Build responsive sites around what customers need to do.', 'service-website.webp'],
    ['Mobile app development', 'Design useful apps for customers on the move.', 'service-app.webp'],
    ['Graphic design', 'Create campaign graphics that carry your brand across channels.', 'service-graphic.webp'],
    ['Landing page design', 'Build focused pages around one offer or action.', 'service-landing.webp'],
  ]},
]

const questions = [
  ['What is bulk SMS marketing and how effective is it?', 'Bulk SMS sends alerts, reminders and offers to customers who have opted in. Results depend on the audience, timing and message relevance.'],
  ['What does a digital marketing agency do?', 'An agency plans and runs campaigns across search, social and other channels to help your business reach customers and generate enquiries.'],
  ['How does SEO help improve website traffic and rankings?', 'SEO helps search engines understand your pages and match them to relevant searches.'],
  ['Which digital marketing services should a small business start with?', 'A clear website and local SEO are useful starting points. Paid campaigns can help when you have a specific goal and budget.'],
  ['How does local SEO help my business get more customers?', 'It helps nearby customers find your business and see details such as your hours, location and contact information.'],
  ['Can social media marketing generate leads and sales?', 'Targeted campaigns can send interested people to an enquiry form, online shop or messaging channel.'],
  ['What is the difference between Google Ads and Meta Ads?', 'Google Search Ads reach customers as they search. Meta Ads reach selected audiences across platforms such as Instagram and Facebook.'],
  ['Can I automate messages for customer follow-ups?', 'WhatsApp Business API and SMS can support opt-in follow-ups, reminders and updates.'],
  ['Do you offer custom website design or templates?', 'Movictel offers website development and landing page design. Contact the team to discuss the right approach for your project.'],
]

const testimonials = [
  ['Movictelâ€™s bulk SMS services completely transformed our customer communication process.', 'Rohit Sharma', 'E-commerce Marketing Head'],
  ['Movictelâ€™s WhatsApp automation services significantly improved how we connect with our customers.', 'Pooja Verma', 'CEO, Healthcare Startup'],
  ['Movictel proved to be the best web development agency in Jaipur for our growing business needs.', 'Ashish Sen', 'Founder, Automobile Company'],
]

const heroServices = ['Digital Marketing', 'Cloud Communications', 'Web & App Development']

const strategySteps = [
  { lead: 'From', title: 'Insights', text: 'We study your audience, market and competitors to see what drives interest and where customers drop off.' },
  { lead: 'To', title: 'Ideas', text: 'We turn what we learn into campaign concepts, clear messaging and pages that give people a reason to act.' },
  { lead: 'To', title: 'Impact', text: 'We launch, track enquiries and refine the campaign based on what brings qualified leads.' },
]

const serviceHighlights = {
  [serviceCutouts['social-media-marketing-jaipur']]: ['Content calendars', 'Reels and paid campaigns'],
  'service-branding.webp': ['Brand positioning', 'Identity and templates'],
  'service-seo.webp': ['Local listings', 'Search and website audit'],
  'service-writing.webp': ['Website copy', 'Campaign messaging'],
  'service-whatsapp.webp': ['Enquiry replies', 'Visit reminders and handoff'],
  'service-sms.webp': ['Appointment reminders', 'Service alerts'],
  'service-rcs.webp': ['Branded message cards', 'Buttons and SMS fallback'],
  'service-voice.webp': ['Recorded announcements', 'Scheduled calls'],
  'service-website.webp': ['Responsive layouts', 'Pages and enquiry forms'],
  'service-app.webp': ['Task flows', 'Mobile interface prototypes'],
  'service-graphic.webp': ['Social and ad artwork', 'Print-ready files'],
  'service-landing.webp': ['Campaign pages', 'Lead capture and tracking'],
}

const testimonialOrder = [
  testimonials[1],
  testimonials[0],
  testimonials[2],
  ['Our callers could choose sales or support from the greeting, and we could send after-hours calls straight to voicemail.', 'IVR setup', 'Sample review'],
  ['We had one page for the campaign with the offer, the location and a short enquiry form.', 'Landing page design', 'Sample review'],
  ['We could update our business hours and contact information in one place before the next local campaign.', 'Local SEO', 'Sample review'],
]

const clientDemos = [
  { id: 'messaging', title: 'Business messaging' },
  { id: 'sms', title: 'SMS campaigns' },
  { id: 'web', title: 'Web development' },
  { id: 'property', title: 'Property marketing' },
]

const clients = [
  ['Jaigyan Realty', 'jaigyan.png'], ['Shri Krishna Group', 'krishna.webp'],
  ['Sheetla Properties', 'sheetla.webp'], ['Suryansh Realty', 'suryansh.webp'],
  ['Vinnora Realty', 'vinnora.webp'], ['Royal Homes', 'royal.webp'],
  ['Times Estate', 'live-times-estate.webp'], ['LCF Estates', 'live-lcf-estates.webp'],
]

const whatsapp = 'https://wa.me/919001955232'
const button = (label, href) => ({ label, href })

export const enquiryContent = {
  heading: 'Tell us about your project.',
  text: 'Share what youâ€™re working on, what you want to achieve and any timing we should know about.',
  demoHeading: 'Request an IVR demo.',
  demoText: 'Choose a preferred date and time in India Standard Time. Our team will confirm availability and share joining details.',
  formHeading: 'Schedule Personalised Demo',
  formText: 'Tell us your requirement in brief and we will set up your 1-on-1 demo.',
  buttonLabel: 'Swipe to send enquiry',
  demoButtonLabel: 'Swipe to send demo request',
  nameLabel: 'Name',
  emailLabel: 'Email',
  phoneLabel: 'Phone number',
  serviceLabel: 'Service type',
  servicePlaceholder: 'Select a service',
  messageLabel: 'Message',
  demoDateLabel: 'Preferred date',
  demoTimeLabel: 'Preferred time (IST)',
  demoFormatLabel: 'Meeting format',
  successText: 'Thanks. Your enquiry has been submitted.',
  demoSuccessText: 'Thanks. Your demo request was received. Our team will contact you to confirm the time.',
  email: 'info@movictel.com',
  phone: '+91 90019 55232',
  briefPoints: ['What youâ€™re working on', 'What you want to achieve', 'Any deadline or useful link'],
}

const servicePages = {
  [serviceCutouts['social-media-marketing-jaipur']]: 'social-media-marketing-jaipur',
  'service-social.webp': 'social-media-marketing-jaipur',
  'service-branding.webp': 'branding',
  'service-seo.webp': 'seo',
  'service-writing.webp': 'content-writing',
  'service-whatsapp.webp': 'whatsapp-business-api',
  'service-sms.webp': 'bulk-sms',
  'service-rcs.webp': 'rcs',
  'service-voice.webp': 'voice-sms',
  'service-website.webp': 'web-development',
  'service-app.webp': 'mobile-app-development',
  'service-graphic.webp': 'graphic-design',
  'service-landing.webp': 'landing-page-design',
}

const demoHref = '/contact/?demo=ivr#contact-enquiry'

function whatsappServiceHref(name) {
  return whatsapp + '?text=' + encodeURIComponent('Hi Movictel, I would like to know more about ' + name + '.')
}

export function updateLegacyHomeNavigation(id, content) {
  if (id === 'ivr' && content.primaryButton.label === 'Book a demo' && content.primaryButton.href === demoHref &&
      content.secondaryButton.label === 'Explore IVR services' && content.secondaryButton.href === '/services/ivr/') {
    return { ...content, primaryButton: content.secondaryButton, secondaryButton: content.primaryButton }
  }
  if (id !== 'services') return content
  const groups = Object.fromEntries(Object.entries(content.groups).map(([key, group]) => [key, {
    ...group, cards: group.cards.map(card => {
      const slug = servicePages[card.image]
      return slug && card.button.label === 'Ask on WhatsApp' && card.button.href === whatsappServiceHref(card.heading)
        ? { ...card, button: button('Explore service', '/services/' + slug + '/') }
        : card
    }),
  }]))
  groups.marketing.cards = groups.marketing.cards.map(card => card.image === 'service-social.webp'
    ? { ...card, image: serviceCutouts['social-media-marketing-jaipur'] } : card)
  const featuredIvr = content.featuredIvr.image === 'service-ivr-feature.webp'
    ? { ...content.featuredIvr, image: serviceCutouts.ivr } : content.featuredIvr
  return { ...content, groups, featuredIvr }
}

export const homeContent = {
  hero: {
    rotateHeadlines: true, rotatingPrefix: 'Leading', rotatingSuffix: 'Company in India',
    rotatingHeadlines: heroServices, poster: 'estate-hero.jpg', buttonPosition: 'start',
    additionalVideos: [{ video: 'client-demo-property.mp4?v=2', poster: 'client-demo-property.jpg?v=2' }],
    primaryButton: button('Book a consultation', '#enquiry'),
    secondaryButton: button('Explore services', '#services'),
    quickLinks: services.map(({ id, label }) => button(label, '#' + id)),
  },
  services: {
    heading: 'Find the right service.',
    text: 'Choose a specific service or bring marketing, messaging and development together.',
    directoryButton: button('Browse Movictelâ€™s service pages', '/services/'),
    featuredIvr: {
      visible: true, heading: 'IVR', text: 'Give callers a professional greeting and route them to the right team.',
      image: serviceCutouts.ivr, imageAlt: 'Customer support specialist handling a call',
      deliverables: ['Custom greetings and voice menus', 'Call routing and after-hours options'],
      button: button('Explore IVR service', '/services/ivr/'),
    },
    groups: Object.fromEntries(services.map(({ id, label, description, items }) => [id, {
      heading: label, text: description,
      cards: items.map(([name, text, image]) => ({
        heading: name, text, image, imageAlt: '', deliverables: serviceHighlights[image],
        button: button('Explore service', '/services/' + servicePages[image] + '/'),
      })),
    }])),
  },
  strategy: { heading: 'Our strategy', steps: strategySteps.map(({ lead, title, text }) => ({ prefix: lead, heading: title, text })) },
  explore: { heading: 'Explore Movictel', media: 'explore-movictel.mp4', poster: 'explore-movictel.webp', imageAlt: '' },
  ivr: {
    heading: 'IVR Service Provider in India', subheading: 'Handle customer calls professionally with an automated IVR system',
    text: 'Interactive Voice Response (IVR) answers incoming calls with a greeting and gives callers clear menu options. Movictel helps you set up prompts and routing so callers can reach sales, support or another team directly.',
    points: ['Automated voice menus to guide incoming callers', 'Call routing to the right department or team', 'Customised welcome greetings and voice prompts', 'Clear after-hours and missed-call options'],
    media: 'service-gallery/hero-ivr.webp', imageAlt: '', buttonPosition: 'start',
    primaryButton: button('Explore IVR services', '/services/ivr/'),
    secondaryButton: button('Book a demo', '/contact/?demo=ivr#contact-enquiry'),
  },
  clients: { heading: 'Businesses we work with', logos: clients.map(([name, image]) => ({ name, image })) },
  reviews: {
    label: 'Client reviews', heading: 'We became part of their success stories',
    text: 'Client feedback and sample reviews for messaging, web development and marketing.',
    reviews: testimonialOrder.map(([text, name, role]) => ({ text, name, role })),
  },
  'client-videos': {
    heading: 'Client videos', text: 'Sample stock footage',
    videos: clientDemos.map(({ id, title }) => ({
      heading: title, media: 'client-demo-' + id + '.mp4?v=2', poster: 'client-demo-' + id + '.jpg?v=2',
    })),
  },
  faq: {
    heading: 'Good questions.', text: 'What to know before choosing your next marketing or messaging service.',
    media: 'web.jpg', imageAlt: 'A laptop and monitor on a development workspace',
    caption: 'Have a question about your project?', button: button('Ask on WhatsApp', whatsapp),
    questions: questions.map(([question, answer]) => ({ question, answer })),
  },
  enquiry: enquiryContent,
  closing: {
    heading: 'Ready to grow your business?',
    text: 'Tell us about your business, goals and current campaigns. Weâ€™ll help you choose where to start, from SEO and paid ads to business messaging.',
    button: button('Get started', '/contact/#contact-enquiry'), buttonPosition: 'end',
  },
}
