import { notFound } from 'next/navigation'
import { buildMetadata, homeDefaults } from './page-metadata'
import Home from './home'
import { ProjectEnquiry } from './project-enquiry'
import { hasContentStorage, publicEnquiryServices, publishedCustomServices, readPage, readPublicHeader, readSetting } from './store'
import { hasAdminSession } from './admin/auth'
import { pageLayout } from './section-layout'
import { ManagedSections } from './managed-sections'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ searchParams }) {
  const preview = (await searchParams).preview === 'draft'
  const page = readPage('', preview && await hasAdminSession())
  if (!page) return {}
  const google = readSetting('site')?.googleVerification
  return { ...buildMetadata('', page, preview), ...(google && { verification: { google } }) }
}

export default async function Page({ searchParams }) {
  const draft = (await searchParams).preview === 'draft' && await hasAdminSession()
  const page = readPage('', draft)
  if (!page) notFound()
  const layout = pageLayout('', page)
  const services = publishedCustomServices()
  return <Home layout={layout} page={page} defaultTitle={homeDefaults.title} header={readPublicHeader(services)} footer={readSetting('footer')}
    sections={<ManagedSections sections={page.sections}/>} enquiry={<ProjectEnquiry options={publicEnquiryServices(services)}
      content={layout.find(section => section.id === 'enquiry').content} draft={draft} viaWhatsApp={!hasContentStorage()}/>}/>
}
