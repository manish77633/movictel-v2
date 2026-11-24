import localFont from 'next/font/local'
import './style.css'
import './contact.css'
import './interior.css'
import './property-story.css'

const inter = localFont({
  src: './fonts/inter-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--movictel-inter',
})

export const metadata = {
  title: { default: 'Movictel | Digital Marketing & Cloud Communications in Jaipur', template: '%s | Movictel' },
  description: 'Real estate marketing, social media and business communications from Movictel in Jaipur.',
}

export default function RootLayout({ children }) {
  return <html lang="en" className={inter.variable}><body>{children}</body></html>
}
