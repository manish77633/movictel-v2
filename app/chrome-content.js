import { homeContent } from './home-content'
import { serviceMenu } from './service-menu'

const navigation = [['Blog', '/blog/'], ['About', '/about/'], ['Contact', '/contact/']]

export const chromeDefaults = {
  header: {
    logo: 'logo-color.png', alt: 'Movictel', links: navigation, homepageLabel: 'Home', servicesLabel: 'Services',
    showServices: true, showCta: true, cta: ['Book a consultation', '/contact/#contact-enquiry'],
    servicesButton: { label: 'Explore all services', href: '/services/' },
    serviceGroups: serviceMenu.map(group => ({
      heading: group.title,
      links: group.items.map(([label, slug, text]) => ({ label, text, href: '/services/' + slug + '/' })),
    })),
  },
  footer: {
    logo: 'logo.webp', alt: 'Movictel', copyright: '© ' + new Date().getFullYear() + ' Movictel. All rights reserved.',
    brandText: 'Movictel is a digital marketing agency in Jaipur offering internet marketing and cloud communication services.',
    columns: [{ title: 'Navigate', links: [['Home', '/'], ['Services', '/services/'], ...navigation] }, {
      title: 'Services', links: [['Social Media Marketing', '#marketing'], ['SEO & Local SEO', '#marketing'], ['WhatsApp Business API', '#promote'], ['Bulk SMS & RCS', '#promote'], ['Website & App Development', '#development'], ['Graphic Design & Landing Pages', '#development']],
    }],
    socials: [['Instagram', 'https://www.instagram.com/movictel'], ['LinkedIn', 'https://www.linkedin.com/company/movictel/'], ['Facebook', 'https://www.facebook.com/Movictel/']],
    contact: {
      heading: 'Visit & contact',
      text: 'Office 21, Tagore Nagar, Satya Colony, near Gopi Tower, C. M. Gora Hospital, 200 Ft Bypass, Ajmer Road, Jaipur, Rajasthan 302021',
      phone: '+91 90019 55232', whatsapp: { label: 'WhatsApp us', href: 'https://wa.me/919001955232' },
    },
    backToTop: 'Back to top', showClosing: true, closing: homeContent.closing,
  },
}

export function completeChrome(kind, config) {
  const defaults = chromeDefaults[kind]
  return {
    ...defaults, ...config,
    ...(kind === 'footer' && {
      contact: { ...defaults.contact, ...config?.contact },
      closing: { ...defaults.closing, ...config?.closing },
    }),
  }
}
