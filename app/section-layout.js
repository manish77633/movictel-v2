import { enquiryContent, homeContent, serviceCutouts, updateLegacyHomeNavigation } from './home-content'
import { aboutChapters, campaignSteps, contactSteps, launchInputs, propertyChapters, propertyTopics, work } from './template-seeds'
import { serviceBasics } from './service-basics'
import { serviceGuides } from './service-guides'
import { serviceMenu } from './service-menu'
import { servicePhotos } from './service-photos'
import { serviceExamples, workflowDetails } from './service-examples'

const homeNames = {
  hero: 'Hero', services: 'Services', strategy: 'Our strategy', explore: 'Explore Movictel',
  ivr: 'IVR feature', clients: 'Client logos', reviews: 'Reviews', 'client-videos': 'Client videos',
  faq: 'Frequently asked questions', enquiry: 'Enquiry form', closing: 'Closing call to action',
}

const item = (id, name, content) => ({ id, name, content })
const button = (label, href) => ({ label, href })
export const sectionAction = { button: { label: '', href: '' }, buttonPosition: 'start', showAbove: false }


function heroContent(page, overrides = {}) {
  return { heading: page.title, label: page.label, text: page.intro, media: page.image || '', imageAlt: page.imageAlt || '', ...overrides }
}

const mediaCards = cards => cards.map(card => ({ ...card, imageAlt: '' }))
const contactOffice = section => section.id === 'office' || section.heading === 'Jaipur office'
const contactCareers = section => section.id === 'careers' || section.heading === 'Careers at Movictel'

export function editablePageSections(slug, page) {
  if (slug === 'contact') return page.sections.filter(section => !contactOffice(section) && !contactCareers(section))
  if (slug === 'about') return page.sections.filter(section => section.image !== 'live-founder.webp' && !['A team that works across the full journey', 'Explore what we do'].includes(section.heading))
  return page.sections
}

export function pageSectionCatalog(slug, page) {
  if (slug === '') {
    const content = { ...homeContent, hero: { ...heroContent(page), ...homeContent.hero } }
    return Object.entries(homeNames).map(([id, name]) => item(id, name, content[id]))
  }

  if (slug === 'services') return [
    item('hero', 'Hero', heroContent(page, {
      heading: page.title === 'Services that move enquiries forward.' ? 'Good work starts with a clear next step.' : page.title,
      label: 'Movictel services', button: button('Book a consultation', '#enquiry'), buttonPosition: 'start',
    })),
    item('intro', 'Service directory introduction', {
      heading: 'One team for the whole customer journey.',
      text: 'From the first campaign to the follow-up conversation, choose the work that will help your customers take the next step.',
    }),
    ...serviceMenu.map(({ id, title, items }) => item(id, title, {
      label: title,
      heading: { marketing: 'Get discovered and build demand.', promote: 'Keep conversations moving.', development: 'Make the next step easier.' }[id],
      cards: items.map(([heading, service, text]) => ({
        heading, text, image: serviceCutouts[service] || servicePhotos[service]?.hero || 'live-team.jpg', imageAlt: '',
        href: '/services/' + service + '/',
      })),
    })),
    item('enquiry', 'Enquiry form', enquiryContent),
  ]

  if (slug.startsWith('services/')) {
    if (page.serviceCategory) return customServiceCatalog(page)
    const id = slug.slice('services/'.length)
    const basics = serviceBasics[id]
    const guide = serviceGuides[id]
    if (id === 'real-estate-marketing' || (basics && guide && servicePhotos[id])) return serviceCatalog(id, page, basics, guide)
  }

  if (slug === 'blog') {
    const featured = page.articles?.[0]
    return [
      item('hero', 'Blog hero', heroContent(page, {
        media: page.image || featured?.image || '',
        featuredLabel: 'Featured guide', featuredHeading: featured?.title || '',
        featuredButton: button('Read the featured guide', featured ? '/blog/' + featured.slug + '/' : ''),
        browseButton: button('Browse all guides', '#articles'), buttonPosition: 'start',
      })),
      item('articles', 'Guide library', { heading: 'Browse guides', allTopicsLabel: 'All topics' }),
    ]
  }

  if (slug.startsWith('blog/')) return [
    item('hero', 'Article header', heroContent(page, { backButton: button('← All guides', '/blog/') })),
    item('body', 'Article body', { heading: 'In this guide' }),
    item('article-cta', 'Article call to action', { button: button('Talk about your project', '/contact/#contact-enquiry'), buttonPosition: 'start' }),
    item('related', 'Related guides', { heading: 'Keep reading' }),
  ]

  if (slug === 'about') {
    const founder = page.sections.find(section => section.image === 'live-founder.webp')
    return [
      item('hero', 'About film', heroContent(page, {
        heading: page.title === 'Meet Movictel.' ? 'We help real estate projects reach the right buyers.' : page.title,
        label: 'About Movictel', media: 'estate-hero.mp4', poster: 'estate-hero.jpg',
      })),
      item('chapters', 'Campaign stages', { heading: 'From launch to site visit', stages: aboutChapters }),
      item('founder', 'Founder', {
        heading: 'Meet the founder', name: founder?.heading || 'Rahul Sharma', role: 'Founder & CEO, Movictel',
        quote: '“Hi, I am Rahul Sharma, a digital marketer with more than 10 years of experience in lifting and helping brands grow online.”',
        image: '', imageAlt: '',
      }),
      item('journal', 'Blog highlights', {
        heading: 'From the blog', text: 'Practical guides to launching property campaigns, creating content and following up on enquiries.',
        button: button('Browse all guides', '/blog/'),
      }),
      item('clients', 'Client logos', homeContent.clients),
    ]
  }

  if (slug === 'contact') {
    const office = page.sections.find(contactOffice)
    const careers = page.sections.find(contactCareers)
    return [
      item('hero', 'Contact hero', heroContent(page, {
        primaryButton: button('Start your enquiry', '#contact-enquiry'), demoButton: button('Choose a demo time', '#contact-enquiry'),
        officeButton: button('Visit the Jaipur office', '#contact-office'), buttonPosition: 'start',
      })),
      item('enquiry', 'Enquiry and demo form', enquiryContent),
      item('process', 'What happens next', { heading: 'What happens next', steps: contactSteps.map(([heading, text]) => ({ heading, text })) }),
      { ...item('office', 'Jaipur office', {
        heading: office?.heading || 'Jaipur office', text: office?.text || 'Office 21, near C M Gora Hospital, 200 Ft. Bypass, Jaipur, Rajasthan 302021.',
        image: office?.image || 'contact-jaipur.webp', imageAlt: office?.imageAlt || 'Illustrative view of Jaipur’s Pink City',
        points: office?.points?.length ? office.points : ['Monday to Saturday, 9:30 a.m. to 6:30 p.m.'],
        directionsButton: button('Get directions', 'https://maps.app.goo.gl/Uj1wDx8LmmchE3Cg6'),
        phone: '+91 90019 55232', callLabel: 'Call +91 90019 55232',
        showMap: true, mapAddress: 'Movictel, Office 21, Tagore Nagar, 200 Ft Bypass, Jaipur',
      }), visible: office?.visible !== false },
      { ...item('careers', 'Careers', {
        heading: careers?.heading || 'Careers at Movictel', text: careers?.text || '',
        points: careers?.points?.length ? careers.points : ['Graphic design', 'Sales', 'Digital marketing'],
        button: button('Share your portfolio', 'https://wa.me/919001955232?text=' + encodeURIComponent('Hi Movictel, I’d like to share my portfolio for career opportunities.')),
      }), visible: careers?.visible !== false },
    ]
  }

  if (slug === 'portfolio') return [
    item('hero', 'Portfolio hero', heroContent(page, { button: button('Book a consultation', '/contact/#contact-enquiry') })),
    item('work', 'Selected work', {
      heading: 'What we create for campaigns',
      text: 'Project shoots, admissions creative and the follow-up that turns interest into a conversation.',
      button: button('See posts and reels on Instagram', 'https://www.instagram.com/movictel/'),
      cards: mediaCards(work.map(card => ({ cutout: false, ...card }))),
    }),
    item('clients', 'Client logos', homeContent.clients),
  ]
  if (slug.startsWith('portfolio/')) return [
    item('hero', 'Project hero', heroContent(page, { button: button('Book a consultation', '/contact/#contact-enquiry') })),
  ]
  return []
}

function customServiceCatalog(page) {
  const name = page.serviceName || page.title
  const image = page.image || 'live-team.jpg'
  const stages = [
    ['Discovery', 'We review your goals, audience and current setup.'],
    ['Setup', 'We agree on the scope and prepare the work for review.'],
    ['Launch and review', 'We launch the approved work and discuss what to improve next.'],
  ]
  return [
    item('hero', 'Service hero', heroContent(page, {
      primaryButton: button('Book a consultation', '#enquiry'),
      secondaryButton: button('Explore the service', '#property-strategy'), buttonPosition: 'start',
    })),
    item('overview', 'Service overview', {
      heading: 'What you get with ' + name, text: 'A plan based on your goals and a clear scope of work.',
      topics: mediaCards(stages.map(([title, text]) => ({ title, text, image }))),
    }),
    item('example', 'Service example', {
      heading: 'An example project', label: 'Illustrative example',
      text: 'Here is how a typical project could progress from the first conversation to launch.',
      steps: mediaCards(stages.map(([heading, text], index) => ({ heading, text, image, channel: 'Step ' + (index + 1) }))),
    }),
    item('faq', 'Frequently asked questions', {
      heading: 'Frequently asked questions',
      questions: [
        { question: 'What do I need to get started?', answer: 'Share your goals, current setup and any deadlines during the consultation.' },
        { question: 'How long will the project take?', answer: 'We agree on a timeline after reviewing the scope and what is already in place.' },
      ],
    }),
    item('workflow', 'Delivery workflow', {
      heading: 'How we deliver ' + name,
      stages: mediaCards(stages.map(([title, result]) => ({ title, result, name, image, intro: '' }))),
    }),
    item('brief', 'Project brief', {
      heading: 'Plan your project', text: 'Tell us what you want to achieve and when you need to get started.',
      button: button('Discuss your project', '#enquiry'), buttonPosition: 'start', points: launchInputs,
    }),
    item('enquiry', 'Enquiry form', enquiryContent),
  ]
}

function serviceCatalog(id, page, basics, guide) {
  const property = id === 'real-estate-marketing'
  const [name, definition, useCase, deliverables] = basics || []
  const [exampleLabel, exampleTitle, exampleText] = guide?.sample || []
  const photos = servicePhotos[id]
  const [descriptions, examples] = serviceExamples[id] || []
  const topics = property ? propertyTopics : [
    { title: name, text: definition, image: photos.cutouts[0] },
    ...deliverables.map((title, index) => ({ title, text: descriptions[index], image: photos.cutouts[index + 1] })),
  ]
  const steps = property ? campaignSteps : examples.map(([title, text], index) => [title, text, photos.examplePhotos[index], 'Step ' + (index + 1)])
  const chapters = property ? propertyChapters : guide.workflow.map(([title, result], index) => ({
    title, result, name, image: photos.workflowPhotos[index], intro: workflowDetails[id][index],
  }))
  return [
    item('hero', 'Service hero', heroContent(page, {
      media: page.layout ? page.image : property ? page.image === 'live-real-estate.webp' ? 'estate.jpg' : page.image : page.image?.startsWith('/') || page.image?.startsWith('https://') ? page.image : photos.hero,
      primaryButton: button(id === 'ivr' ? 'Book a demo' : 'Book a consultation', id === 'ivr' ? '/contact/?demo=ivr#contact-enquiry' : '#enquiry'),
      secondaryButton: button('Explore the service', '#property-strategy'), buttonPosition: 'start',
    })),
    item('overview', 'Service overview', { heading: property ? 'What goes into a property campaign' : 'What you get with ' + name, text: useCase || '', topics: mediaCards(topics) }),
    item('example', 'Campaign example', {
      heading: exampleTitle || 'From the first ad to a booked site visit', label: exampleLabel || 'Illustrative campaign', text: exampleText || '',
      steps: steps.map(([heading, text, image, channel]) => ({ heading, text, image, imageAlt: '', channel })),
    }),
    ...(page.scenario ? [item('scenario', 'Interactive example', {
      heading: page.scenario.title, label: 'Interactive example', text: page.scenario.lead,
      actions: page.scenario.actions.map(([label, text]) => ({ label, text })),
    })] : []),
    ...(page.faq?.length ? [item('faq', 'Frequently asked questions', { heading: '', questions: page.faq.map(([question, answer]) => ({ question, answer })) })] : []),
    item('workflow', 'Delivery workflow', {
      heading: property ? 'How we run a property campaign' : 'How we deliver ' + name,
      stages: mediaCards(chapters),
    }),
    item('brief', 'Project brief', {
      heading: property ? 'Plan your launch' : 'Plan your project',
      text: property ? 'Bring what you have to the first call so we can discuss your launch and where buyers need a clearer next step.' : 'Bring what you have so we can discuss your goals and agree on the first step.',
      button: button('Discuss your project', '#enquiry'), buttonPosition: 'start', points: guide?.inputs || launchInputs,
    }),
    item('enquiry', 'Enquiry form', enquiryContent),
  ]
}

function fillDefaults(base, saved) {
  if (Array.isArray(base)) return saved && base.length ? saved.map(item => fillDefaults(base[0], item)) : saved ?? base
  if (typeof base !== 'object') return saved ?? base
  return Object.fromEntries(Object.entries(base).map(([key, value]) => [key, fillDefaults(value, saved?.[key])]))
}

export function pageLayout(slug, page) {
  const definitions = pageSectionCatalog(slug, page)
  const saved = new Map((page.layout || []).map(section => [section.id, section]))
  const mapped = new Map(definitions.map(({ id, name, content, visible }) => {
    const entry = saved.get(id)
    const resolved = fillDefaults(content, entry?.content)
    if (slug === 'services' && resolved.cards) {
      resolved.cards = resolved.cards.map(card => {
        if (card.href === '/services/ivr/' && ['service-ivr-feature.webp', servicePhotos.ivr.hero].includes(card.image)) {
          return { ...card, image: serviceCutouts.ivr }
        }
        if (card.href === '/services/social-media-marketing-jaipur/' && card.image === servicePhotos['social-media-marketing-jaipur'].hero) {
          return { ...card, image: serviceCutouts['social-media-marketing-jaipur'] }
        }
        return card
      })
    }
    return [id, {
      id, name, visible: entry?.visible ?? visible ?? true, background: entry?.background || '', backdrop: entry?.backdrop || '',
      action: fillDefaults(sectionAction, entry?.action),
      content: slug === '' ? updateLegacyHomeNavigation(id, resolved) : resolved,
    }]
  }))
  return [...new Set([...saved.keys(), ...mapped.keys()])].flatMap(id => mapped.has(id) ? [mapped.get(id)] : [])
}
