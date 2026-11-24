import Link from 'next/link'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, ChevronRight, Files, Inbox, LayoutDashboard, Layers3, LogOut } from 'lucide-react'
import { pages } from '../content'
import { db, readPage } from '../store'
import { login, logout } from './actions'
import { hasAdminSession } from './auth'
import { Editor } from './editor'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Content studio', robots: { index: false, follow: false } }

const areas = [
  { id: 'dashboard', title: 'Dashboard', icon: LayoutDashboard },
  { id: 'pages', title: 'Pages', icon: Files, copy: 'Edit your public pages and their search appearance.' },
  { id: 'services', title: 'Services', icon: Layers3, copy: 'Update service content, visuals and calls to action.' },
  { id: 'projects', title: 'Projects', icon: BriefcaseBusiness, copy: 'Manage project stories, photography and videos.' },
  { id: 'enquiries', title: 'Enquiries', icon: Inbox, copy: 'Read submissions from the consultation form.' },
]
const getArea = slug => slug.startsWith('services') ? 'services' : slug.startsWith('portfolio') ? 'projects' : 'pages'
const areaUrl = id => id === 'dashboard' ? '/admin/' : '/admin/?view=' + id

export default async function Admin({ searchParams }) {
  const query = await searchParams
  if (!await hasAdminSession()) return <main className="studio-login">
    <form className="interior-form admin-login" action={login}>
      <img src="/media/logo-color.png" alt="Movictel"/>
      <h1>Sign in to Content Studio</h1>
      {query.login && <p role="alert">Sign in failed. Check your password and server configuration.</p>}
      <label>Admin password<input name="password" type="password" autoComplete="current-password" required/></label>
      <button className="button">Sign in</button>
    </form>
  </main>

  const slug = typeof query.page === 'string' && Object.hasOwn(pages, query.page) ? query.page : null
  const active = areas.find(area => area.id === (slug ? getArea(slug) : query.view)) || areas[0]
  const page = slug ? readPage(slug, true) : null
  const listedPages = Object.keys(pages).filter(key => getArea(key) === active.id)

  return <main className="studio">
    <aside className="studio-sidebar">
      <Link href="/admin/" className="studio-brand"><img src="/media/logo-color.png" alt="Movictel"/><span>Content Studio</span></Link>
      <nav aria-label="Studio navigation">
        {areas.map(({ id, title, icon: Icon }) => <Link key={id} href={areaUrl(id)} aria-current={active.id === id ? 'page' : undefined}>
          <Icon size={19} aria-hidden="true"/>{title}
        </Link>)}
      </nav>
      <div className="studio-sidebar-footer">
        <Link href="/">View website <ArrowUpRight size={16}/></Link>
        <form action={logout}><button><LogOut size={16}/> Sign out</button></form>
      </div>
    </aside>
    <div className="studio-workspace">
      {page && <Link className="studio-back" href={areaUrl(active.id)}>← All {active.title.toLowerCase()}</Link>}
      <header className="studio-heading">
        <div><h1>{page?.title || active.title}</h1><p>{page ? 'Edit page content and media, then preview or publish.' : active.copy || 'Manage Movictel’s website content and enquiries.'}</p></div>
        {page && <div className="admin-controls"><Link href={'/' + slug + '/'}>View published</Link><Link href={'/' + slug + '/?preview=draft'}>Preview draft</Link></div>}
      </header>
      {page ? <PageEditor slug={slug} page={page} query={query}/> : active.id === 'dashboard' ?
        <div className="studio-tiles">{areas.slice(1).map(({ id, title, icon: Icon, copy }) => <Link key={id} className="studio-tile" href={areaUrl(id)}>
          <span className="studio-tile-icon"><Icon size={23}/></span><h2>{title}</h2><p>{copy}</p><span className="studio-open">Open <ArrowRight size={16}/></span>
        </Link>)}</div> : active.id === 'enquiries' ? <Enquiries/> :
        <div className="studio-tiles">{listedPages.map(key => {
          const item = readPage(key, true)
          return <Link key={key} className="studio-page-tile" href={'/admin/?page=' + encodeURIComponent(key)}>
            <div><h2>{item.title}</h2><p>{item.sections.length} sections</p></div><ChevronRight size={18}/>
          </Link>
        })}</div>}
    </div>
  </main>
}

function PageEditor({ slug, page, query }) {
  const assets = readdirSync(join(process.cwd(), 'public', 'media')).filter(name => /\.(jpg|jpeg|png|webp|mp4)$/i.test(name))
  const revisions = db().prepare('SELECT id,created FROM revisions WHERE slug = ? ORDER BY id DESC LIMIT 8').all(slug)
  return <>
    {query.status && <p className="studio-notice" role="status">{query.status === 'published' ? 'Page published.' : 'Draft saved.'}</p>}
    {query.error && <p className="studio-notice" role="alert">{query.error === 'upload' ? 'Choose a supported image or video up to 20 MB.' : 'Check the form fields and try again.'}</p>}
    <Editor key={slug + JSON.stringify(page)} slug={slug} page={page} assets={assets}/>
    <details className="studio-history"><summary>Publish history</summary>
      {revisions.length ? <ul>{revisions.map(item => <li key={item.id}>{item.created} UTC</li>)}</ul> : <p>No publications yet.</p>}
    </details>
  </>
}

function Enquiries() {
  const leads = db().prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 30').all()
  return <div className="studio-enquiries">
    {!leads.length && <p className="studio-notice">No enquiries yet.</p>}
    {leads.map(lead => <article className="studio-page-tile" key={lead.id}><div><h2>{lead.name}</h2><p>{lead.service} · {lead.email}</p>{lead.phone && <p><a href={'tel:' + lead.phone.replace(/[^+\d]/g, '')}>{lead.phone}</a></p>}<p>{lead.message}</p></div></article>)}
  </div>
}
