import { serviceMenu } from './service-menu'

export function enrich(pages) {
  const services = pages.services
  services.image = 'live-team.jpg'
  services.intro = 'Plan a campaign, build the website it needs and handle the calls and messages it brings in. Choose a service below or talk to us about connecting them.'
  services.sections = serviceMenu.map(({ id, title, items }) => ({
    id, heading: title, text: services.sections.find(section => section.id === id).text,
    links: items.map(([label, slug]) => [label, '/services/' + slug + '/']),
  }))

  Object.assign(pages['services/real-estate-marketing'], {
    image: 'live-real-estate.webp',
    kicker: 'For builders, developers and property teams',
    sections: [
      { heading: 'Before launch', text: 'Start with a site visit and a project brief. Identify the buyer, the location’s strongest selling points and the questions your sales team hears most often.', image: 'estate.jpg', points: ['Project positioning and launch plan', 'Photography, walkthroughs and short-form video', 'Landing page with lead capture'] },
      { heading: 'During the campaign', text: 'Use different creative for people discovering the project and those already comparing options. Send enquiries to a shared queue with the campaign source and the property they asked about.', image: 'property.webp', points: ['Meta and Google Ads', 'Reels, project updates and retargeting', 'Lead source and campaign reporting'] },
      { heading: 'From enquiry to site visit', text: 'A quick response matters when buyers are comparing projects. Give your sales team clear call routing, WhatsApp confirmations and visit reminders.', steps: ['New enquiry', 'Sales callback', 'Visit booked', 'Follow-up'], links: [['WhatsApp Business API', '/services/whatsapp-business-api/'], ['Explore project examples', '/portfolio/']] },
    ],
    faq: [
      ['What do you need before a project launch?', 'A project brief, approved assets, a launch date and a point of contact for approvals. We use those to plan the first campaign and agree what to track.'],
      ['Can you work with our existing sales team?', 'Yes. Start by mapping who handles incoming enquiries, how they book visits and where follow-up currently happens.'],
    ],
  })

  const social = pages['services/social-media-marketing-jaipur']
  Object.assign(social, {
    title: 'Social media marketing in Jaipur.', image: 'live-social.webp',
    intro: 'Movictel plans organic content and paid campaigns for businesses in Jaipur. We help you choose the platforms, create the work and track the enquiries it brings.',
    platforms: [
      ['Instagram','instagram','Plan reels, carousels and paid promotions around products, services or project launches.'],
      ['Facebook','facebook','Reach local audiences, run lead campaigns and test different offers.'],
      ['YouTube','youtube','Develop video topics, walkthroughs and ads around what customers want to see.'],
      ['LinkedIn','linkedin','Build a useful presence for founders, service firms and B2B teams.'],
      ['X','x','Plan timely updates and give customers a place to follow conversations.'],
      ['Pinterest','pinterest','Make visual content easier to discover through curated pins.'],
    ],
    sections: [
      { heading: 'Build a content calendar your team can use', text: 'Agree on the topics, formats and approval process before production. A real estate calendar might combine walkthroughs, location explainers, buyer questions and launch announcements.', image: 'design.jpg', points: ['Content planning and production', 'Publishing and community management', 'Paid campaign creative'] },
      { heading: 'Review reach, response and enquiries', text: 'Separate discovery metrics from actions that matter to the business. Use campaign results to refine the next round of content rather than reporting reach in isolation.', image: 'seo.jpg' },
    ],
    faq: [['Can you handle both posts and paid ads?', 'Yes. Content and media buying can be planned together so ads, landing pages and sales follow-up use the same offer.']],
  })

  const communications = {
    ivr: {
      intro: 'Create a phone menu for incoming sales and support calls. Route enquiries by keypad choice, time of day or team availability.',
      scenario: { title: 'Try a property enquiry call', lead: 'Incoming call · Movictel demo', actions: [
        ['Press 1 · New projects', 'Your call is being routed to the sales team.'],
        ['Press 2 · Existing bookings', 'Your call is being routed to customer support.'],
        ['After office hours', 'The line plays a recorded message with the next available callback window.'],
      ] },
      add: { heading: 'Decide where every option goes', text: 'Write the welcome greeting, map the menu and agree what happens when a team is busy or closed.', points: ['Regional language or bilingual greetings', 'Business hours and holiday routing', 'Missed-call follow-up and review'] },
    },
    rcs: {
      intro: 'Send branded business messages with images and tappable actions. Use them for project updates, appointments and service notifications.',
      scenario: { title: 'Try a rich project update', lead: 'New homes are available to visit this weekend.', actions: [
        ['View project', 'The customer opens the project page with current availability.'],
        ['Request a visit', 'The customer opens a short form to choose a preferred day.'],
        ['Ask a question', 'The customer starts a conversation about the project.'],
      ] },
      add: { heading: 'Plan the fallback and measure response', text: 'Design an SMS version for recipients without RCS support. Review deliveries and actions before expanding the campaign.', points: ['Branded sender setup', 'Image cards and suggested actions', 'Audience permission and SMS fallback'] },
    },
    'whatsapp-business-api': {
      intro: 'Handle new enquiries, appointment reminders and customer updates through WhatsApp Business API, with a clear handoff to your team.',
      scenario: { title: 'Try a site visit conversation', lead: 'Hi! I’m interested in visiting the project.', actions: [
        ['Share visit timings', 'Visits are available Saturday and Sunday. Which day works for you?'],
        ['Confirm Saturday', 'Your visit request is in. The sales team will confirm your time.'],
        ['Talk to the team', 'A sales adviser can help with availability and directions.'],
      ] },
      add: { heading: 'Plan how customers enter the conversation', text: 'Decide where customers start a chat, how you’ll record their permission for business-initiated messages and who handles replies that need a person.', points: ['Shared inbox and reply ownership', 'Templates for reminders and confirmations', 'A handoff path for exceptions'] },
    },
  }
  for (const [key, { intro, scenario, add }] of Object.entries(communications)) {
    const page = pages['services/' + key]
    Object.assign(page, { intro, scenario })
    page.sections.push(add)
    page.faq = [['How do we get started?', 'Bring a sample of the messages or calls you handle today. We can use it to agree on the first workflow, what your team needs to provide and how to run a pilot.']]
  }

  const additional = [
    ['seo', 'SEO for local businesses', 'seo.jpg', 'Improve how customers find your services on Google with technical SEO, clearer website pages and an accurate Google Business Profile.', 'What the audit covers', 'We check how Google discovers your priority pages, how well those pages answer relevant searches and whether your local business details are accurate.', ['Crawling, indexing and internal links', 'Service pages and search intent', 'Google Business Profile review']],
    ['ppc-advertising', 'Google and Meta Ads', 'seo.jpg', 'Plan, launch and improve paid campaigns around enquiries, appointments or sales.', 'Set up a campaign you can measure', 'Define the audience, budget, conversion action and destination page. Review enquiry quality alongside campaign cost.', ['Search campaigns', 'Paid social', 'Conversion tracking']],
    ['branding', 'Branding for growing businesses', 'design.jpg', 'Build a consistent identity across your website, sales materials and campaigns.', 'Create a practical brand kit', 'Develop a clear positioning statement, visual direction and examples for the materials your team uses every week.', ['Brand positioning', 'Visual identity', 'Campaign templates']],
    ['content-writing', 'Content writing for websites and campaigns', 'design.jpg', 'Explain what you offer in the language your customers use.', 'Start with the questions customers ask', 'Use interviews and sales questions to outline service pages, campaign copy and follow-up messages.', ['Service pages', 'Landing page copy', 'Campaign messaging']],
    ['voice-sms', 'Voice SMS for reminders and updates', 'sms.jpg', 'Send recorded messages for announcements, appointment reminders and useful service updates.', 'Record a short, clear message', 'Keep the script to one purpose, choose the audience and schedule the call for a useful time.', ['Recorded announcements', 'Reminder calls', 'Campaign review']],
    ['mobile-app-development', 'Mobile app development', 'web.jpg', 'Build apps around the tasks customers and teams need to complete on the move.', 'Agree what belongs in the first release', 'Define who will use the app, which tasks matter most and what devices and systems the first version must support.', ['User journeys and interface design', 'Device testing and release planning', 'Data and integration requirements']],
    ['graphic-design', 'Graphic design for campaigns', 'design.jpg', 'Create campaign visuals that stay consistent across social, landing pages and sales material.', 'Design a system for the campaign', 'Start with the core visual, then adapt it to the different formats the campaign needs.', ['Social creative', 'Ad formats', 'Brand collateral']],
    ['landing-page-design', 'Landing pages for campaigns', 'estate.jpg', 'Give each campaign a page focused on one offer and one next step.', 'Match the page to the ad', 'Clarify the offer above the fold, answer objections and make the enquiry or visit form easy to complete.', ['Offer and page copy', 'Mobile forms', 'Conversion measurement']],
  ]
  for (const [slug, title, image, intro, heading, text, points] of additional) {
    pages['services/' + slug] = { title, image, intro, label: 'Services', sections: [{ heading, text, points }] }
  }
  pages['services/seo'].faq = [
    ['Can SEO guarantee a first-page ranking?', 'No. Search positions can change and Google decides which pages to show. We prioritise issues we can address and report how visibility and enquiries change over time.'],
    ['Will we need new website pages?', 'Sometimes. We first look for an existing page that can answer the relevant search. A new page makes sense when it covers a distinct service and provides useful information customers cannot find elsewhere on the site.'],
  ]
  pages['services/bulk-sms'].sections.push({ heading: 'What to send', text: 'Use SMS for time-sensitive notices that can fit in a short message.', points: ['Appointment confirmations', 'Service notices', 'Offers for opted-in customers'] })
  pages['services/web-development'].sections.push({ heading: 'What the build includes', text: 'Map the navigation, build pages around the goal and prepare the site for updates after launch.', image: 'design.jpg', points: ['Responsive design', 'Content structure', 'Enquiry and booking forms'] })
  pages['services/seo-branding'].sections[0].links = [['Explore SEO', '/services/seo/'], ['Explore branding', '/services/branding/']]
  pages['services/seo'].sections[0].links = [['Explore combined SEO and branding', '/services/seo-branding/']]
  pages['services/branding'].sections[0].links = [['Explore combined SEO and branding', '/services/seo-branding/']]

  Object.assign(pages.about, {
    image: 'live-team.jpg', intro: 'Movictel is a Jaipur team working across SEO, paid campaigns, branding, web development and cloud communications.',
    sections: [
      { heading: 'Rahul Sharma', text: 'Founder and CEO of Movictel. Rahul has more than ten years of experience helping brands build their presence online.', image: 'live-founder.webp', imageAlt: 'Rahul Sharma, founder of Movictel' },
    ],
    clients: true,
  })
  pages.portfolio.intro = 'Browse campaign concepts and the businesses Movictel features in its client portfolio.'
  pages.portfolio.image = 'live-real-estate.webp'
  pages.portfolio.clients = true
  pages['portfolio/residential-campaign'].sections.push({ heading: 'What to measure', text: 'Track campaign sources, qualified enquiries and confirmed visits. Review each step to find where the buyer journey needs improvement.' })
  Object.assign(pages.contact, {
    title: 'Let’s talk about your project.',
    intro: 'Talk with our Jaipur team about your next campaign, website or customer communications workflow.',
    image: 'contact-workspace.webp',
    imageAlt: 'Camera, laptop and notebook on a creative workspace desk',
    form: true,
    sections: [
      { id: 'office', heading: 'Jaipur office', text: 'Office 21, near C M Gora Hospital, 200 Ft. Bypass, Jaipur, Rajasthan 302021.', image: 'contact-jaipur.webp', points: ['Monday to Saturday, 9:30 a.m. to 6:30 p.m.'] },
      { id: 'careers', heading: 'Careers at Movictel', text: 'Interested in working with us? Tell us about your experience and share a few examples of your work.', points: ['Graphic design', 'Sales', 'Digital marketing'] },
    ],
  })

  const articles = [
    ['property-launch-checklist', 'Before launch day: a checklist for property teams', 'live-real-estate.webp', 'Prepare the campaign and the enquiry process before you begin buying traffic.', [
      ['Start with the property facts', 'Collect the approved project details, location information, floor plans, walkthroughs and photography. Match the campaign offer to what your sales team can confirm.'],
      ['Build and check the enquiry path', 'Open your ads and landing page on a phone. Submit the form as a buyer and confirm that your team receives the enquiry with the correct project and campaign source.'],
      ['Plan the first response', 'Decide who calls, how they record the outcome and how a buyer can request a visit. Review visit bookings alongside lead volume.'],
    ]],
    ['whatsapp-follow-up', 'Plan your WhatsApp follow-up', 'wa.jpg', 'A short guide to useful replies, templates and human handoffs.', [
      ['Map the common requests', 'List questions your team can answer immediately and questions that require a person. Use opted-in customer messages to guide the first workflow.'],
      ['Write the handoff', 'Tell the customer what happens next and make sure the team can see the context they already shared.'],
    ]],
    ['social-content-for-property', 'What to post before a property launch', 'live-social.webp', 'Make the location, project and viewing process easy to understand.', [
      ['Build three kinds of content', 'Show the location, explain the offer and answer the questions buyers raise most often. Give each format a clear next action.'],
      ['Keep claims consistent', 'Use the same approved property details across posts, ads and landing pages. Update outdated information before promoting it again.'],
    ]],
  ]
  articles.push(
    ['rcs-message-checklist', 'Write an RCS update customers can act on', 'service-rcs.webp', 'A simple checklist for message design, one clear action and an SMS fallback.', [
      ['Choose the reason for the message', 'Start with a situation the customer recognizes, such as an appointment they booked or an update they asked to receive. Put the date, time or location near the start so the recipient can scan it quickly.'],
      ['Give the message one main action', 'Make the button describe what happens next. A reminder might offer directions as the main action and rescheduling as a secondary option. Open both from a phone before approving the send.'],
      ['Write the fallback at the same time', 'Keep the essential details in the SMS version. Use a short link only when the destination provides something useful. Test delivery and response paths before expanding the audience.'],
    ]],
    ['property-lead-follow-up', 'What happens after a property enquiry?', 'story-visit.webp', 'Set up a simple handoff so the sales team knows who to call and what the buyer asked for.', [
      ['Capture enough context', 'Keep the enquiry form short. Record the project, campaign source and any preferred date separately so the sales team can open the conversation with context.'],
      ['Set an owner for the first reply', 'Agree on a callback owner and a backup. When you confirm a visit, share the location, time and a way to reschedule.'],
      ['Review the stages separately', 'Look at enquiries, confirmed visits and attendance. A campaign may bring clicks without bringing the right buyers, or deliver qualified enquiries that need a faster follow-up.'],
    ]],
    ['landing-page-checklist', 'Check your landing page before buying traffic', 'service-landing.webp', 'Check the page, form and follow-up from a phone before sending paid traffic.', [
      ['Open it from the ad', 'Check that the headline, project details and promised offer match what you saw in the ad. Keep the main action visible without hiding important information.'],
      ['Submit the enquiry yourself', 'Try the form on a phone and confirm the success message is clear. Check that the right person receives the enquiry with the correct source and project.'],
      ['Check what happens next', 'Test the callback or message that follows the enquiry. If staff need to confirm the appointment, make that clear in the confirmation copy.'],
    ]],
  )
  const categories = ['Real estate', 'Business messaging', 'Social media', 'Business messaging', 'Real estate', 'Digital campaigns']
  const covers = ['journal-planning-desk.webp', 'wa.jpg', 'service-graphic.webp', 'sms.jpg', 'service-voice.webp', 'service-website.webp']
  pages.blog.title = 'Field notes from Movictel'
  pages.blog.articles = articles.map(([slug, title, image, intro], index) => ({
    slug, title, image: covers[index] || image, intro, topic: categories[index], cutout: [2, 4, 5].includes(index),
  }))
  pages.blog.sections = []
  const takeaways = {
    'property-launch-checklist': ['Verify phone numbers, prices and visit details against approved material.', 'Submit a test enquiry from each paid channel and check where it lands.', 'Assign a callback owner for weekends and busy launch days.'],
    'whatsapp-follow-up': ['First reply: confirm which project the buyer asked about.', 'Visit confirmation: include the date, time and directions.', 'Team handoff: share the conversation context with the adviser.'],
    'social-content-for-property': ['Walkthrough reel: show the entrance, a key room and the view.', 'Location carousel: cover access, nearby services and the route to the site.', 'Buyer FAQ: answer one common question and offer a clear next step.'],
    'rcs-message-checklist': ['Keep appointment details visible without opening the image.', 'Test the action and fallback from a phone.', 'Review completed actions alongside message delivery.'],
    'property-lead-follow-up': ['Record the project and enquiry source.', 'Assign the first callback and log its outcome.', 'Confirm the visit and record whether the buyer attended.'],
    'landing-page-checklist': ['Try the page with a slower connection.', 'Check that every required field has a clear label.', 'Verify the thank-you message, source tracking and sales notification.'],
  }
  for (const [index, [slug, title, image, intro, sections]] of articles.entries()) {
    const summary = pages.blog.articles[index]
    pages['blog/' + slug] = { title, image: summary.image, intro, label: summary.topic, sections: [...sections.map(([heading, text]) => ({ heading, text })), { heading: 'Checklist', points: takeaways[slug], text: '' }] }
  }
}
