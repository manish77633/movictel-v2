import Link from 'next/link'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ArrowUpRight, BriefcaseBusiness, Files, Image, Inbox, LayoutDashboard, Layers3, LogOut, PanelBottom, PanelTop, Search, Settings } from 'lucide-react'
import { basePage, db, hasContentStorage, listPageSlugs, readPage, readSetting } from '../store'
import { pagePath } from '../seo'
import { metadataImage } from '../page-metadata'
import { serviceMenu } from '../service-menu'
import { changePageStatus, createPage, login, logout, manageMedia, saveSiteSettings } from './actions'
import { hasAdminSession } from './auth'
import { editablePageSections, pageLayout, pageSectionCatalog } from '../section-layout'
import { completeChrome } from '../chrome-content'
import { ChoiceProvider } from './editor-choices'
import { Editor } from './editor'
import { SeoEditor } from './seo-editor'
import { ChromeEditor } from './chrome-editor'
import { StudioLink } from './studio-navigation'
import { Submit } from './submit'
import './studio.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Content Studio', robots: { index: false, follow: false } }

let staticAssets
function listStaticAssets() {
  if (!staticAssets) staticAssets = readdirSync(join(process.cwd(), 'public', 'media'), { recursive: true })
    .map(name => name.replaceAll('\\', '/')).filter(name => /\.(jpg|jpeg|png|webp|mp4|webm|avif|gif|svg)$/i.test(name)).sort()
  return staticAssets
}

const areas = [
  ['dashboard', 'Dashboard', LayoutDashboard],
  ['pages', 'Pages', Files],
  ['services', 'Services', Layers3],
  ['projects', 'Projects', BriefcaseBusiness],
  ['header', 'Header', PanelTop],
  ['footer', 'Footer', PanelBottom],
  ['media', 'Media', Image],
  ['seo', 'SEO', Search],
  ['settings', 'Settings', Settings],
  ['enquiries', 'Enquiries', Inbox],
]
const routeNames = {
  '': 'Home', about: 'About', blog: 'Blog', contact: 'Contact', portfolio: 'Portfolio', services: 'Services',
  ...Object.fromEntries(serviceMenu.flatMap(group => group.items.map(([name, slug]) => ['services/' + slug, name]))),
}
const pageName = (slug, page) => routeNames[slug] || (basePage(slug) ? slug.split('/').at(-1).replace(/-/g, ' ').replace(/^\w/, letter => letter.toUpperCase()) : page.title)
const groupFor = slug => slug.startsWith('services/') ? 'services' : slug.startsWith('portfolio/') ? 'projects' : 'pages'
const areaUrl = id => id === 'dashboard' ? '/admin/' : '/admin/?view=' + id
const editorUrl = (slug, seo = false) => '/admin/?' + (seo ? 'view=seo&' : '') + 'page=' + encodeURIComponent(slug)

const statuses = { published: 'Changes published.', draft: 'Draft saved.', saved: 'Changes saved.', unpublished: 'Page unpublished.', deleted: 'Page deleted.' }
const errors = { upload: 'Choose a supported image or video up to 20 MB.', slug: 'Choose a unique URL slug with letters, numbers and hyphens.',
  seo: 'Check the metadata fields. Canonical and social image URLs must use HTTPS or a site-relative path.', 'in-use': 'This asset is still used by a page, header or footer.' }

export default async function Admin({ searchParams }) {
  const query = await searchParams
  if (!hasContentStorage()) return <main className="studio-login"><section className="studio-panel"><h1>Persistent storage required</h1><p>Set MOVICTEL_DB_PATH to a SQLite file on a persistent volume to enable Content Studio.</p></section></main>
  if ((process.env.MOVICTEL_ADMIN_PASSWORD?.length || 0) < (process.env.NODE_ENV === 'development' ? 10 : 12) ||
    (process.env.MOVICTEL_ADMIN_SECRET?.length || 0) < 32) {
    return <main className="studio-login"><section className="studio-panel"><h1>Admin setup required</h1><p>Configure MOVICTEL_ADMIN_PASSWORD and MOVICTEL_ADMIN_SECRET on the server.</p></section></main>
  }
  if (!await hasAdminSession()) return <main className="studio-login">
    <form className="interior-form admin-login" action={login}>
      <img src="/media/logo-color.png" alt="Movictel"/>
      <h1>Content Studio</h1>
      {query.login && <p role="alert">Sign in failed. Check your password and server configuration.</p>}
      <label>Admin password<input name="password" type="password" autoComplete="current-password" required/></label>
      <Submit className="button">Sign in</Submit>
    </form>
  </main>

  const slugs = listPageSlugs()
  const slug = typeof query.page === 'string' && slugs.includes(query.page) ? query.page : null
  const page = slug === null ? null : readPage(slug, true)
  const live = page && readPage(slug)
  const seo = query.view === 'seo'
  const active = areas.find(([id]) => id === (seo ? 'seo' : page ? groupFor(slug) : query.view)) || areas[0]
  const [id, title] = active
  const needsLibrary = Boolean(page) || ['header', 'footer', 'media'].includes(id)
  const assets = needsLibrary || id === 'dashboard' ? listStaticAssets() : []
  const media = needsLibrary ? db().prepare('SELECT assets.id, mime, name, alt, created FROM assets LEFT JOIN media_details USING (id) ORDER BY created DESC, assets.id').all() : []
  const records = new Map(db().prepare(`SELECT slug,
    CASE WHEN published = 'null' THEN 0 WHEN published IS NOT NULL THEN 1 ELSE NULL END AS live,
    (draft IS NOT NULL AND draft IS NOT published) AS draft,
    CASE WHEN slug <> '' THEN json_extract(coalesce(draft, published), '$.title') ELSE NULL END AS title,
    (SELECT created FROM revisions WHERE revisions.slug = pages.slug ORDER BY revisions.id DESC LIMIT 1) AS updated
    FROM pages`).all().map(row => [row.slug, row]))
  const names = slugs.map(key => {
    const record = records.get(key)
    return { key, name: pageName(key, { title: record?.title || key }), live: Boolean(record?.live ?? basePage(key)),
      draft: Boolean(record?.draft), updated: record?.updated }
  })
  const library = [
    ...media.map(item => {
      const video = item.mime.startsWith('video/')
      return { name: item.name || item.id, alt: item.alt, value: '/api/media/' + item.id + (video ? '#video' : ''), video }
    }),
    ...assets.map(name => ({ name, value: name, video: /\.(mp4|webm)$/i.test(name) })),
  ]
  const destinations = [
    ...names.map(item => ({ value: pagePath(item.key), label: item.name })),
    ...[['/#services', 'Home services'], ['/#enquiry', 'Home enquiry'], ['/#marketing', 'Home marketing services'],
      ['/#promote', 'Home communications services'], ['/#development', 'Home development services'],
      ['#services', 'Services on this page'], ['#enquiry', 'Enquiry on this page'],
      ['#marketing', 'Marketing on this page'], ['#promote', 'Communications on this page'], ['#development', 'Development on this page'],
      ['#property-strategy', 'Service overview on this page'], ['#contact-enquiry', 'Contact form on this page'], ['#articles', 'Guides on this page'], ['#contact-office', 'Office on this page'], ['/contact/#contact-enquiry', 'Contact enquiry form'],
      ['/contact/?demo=ivr#contact-enquiry', 'IVR demo form']].map(([value, label]) => ({ value, label })),
  ]
  const heading = page ? pageName(slug, page) : title
  const seoHero = seo && page ? pageLayout(slug, page).find(section => section.id === 'hero')?.content : null

  return <main className="studio">
    <aside className="studio-sidebar">
      <Link href="/admin/" className="studio-brand"><img src="/media/logo-color.png" alt="Movictel"/><span>Content Studio</span></Link>
      <nav aria-label="Studio navigation">
        {areas.map(([section, label, Icon]) => <StudioLink key={section} href={areaUrl(section)} eager={section !== 'media' && section !== 'enquiries'} aria-current={id === section ? 'page' : undefined}>
          <Icon size={18} aria-hidden="true"/>{label}
        </StudioLink>)}
      </nav>
      <div className="studio-sidebar-footer"><form action={logout}><button><LogOut size={16}/> Sign out</button></form></div>
    </aside>
    <div className="studio-workspace">
      <div className="studio-topbar">
        <span>{title}{page && ' / ' + heading}</span>
        <Link href="/">View website <ArrowUpRight size={16}/></Link>
      </div>
      <div className="studio-content">
        <header className="studio-heading">
          <div>
            {page && <Link className="studio-back" href={areaUrl(id)}>← {title}</Link>}
            <h1>{heading}</h1>
            {page && <p className="studio-path">{pagePath(slug)}</p>}
          </div>
          {page && <div className="admin-controls">
            <StudioLink href={editorUrl(slug, !seo)} eager>{seo ? 'Edit content' : 'Edit SEO'}</StudioLink>
            {live && <Link href={pagePath(slug)} target="_blank">View published <ArrowUpRight size={15}/></Link>}
            <Link href={pagePath(slug) + '?preview=draft'} target="_blank">Preview draft <ArrowUpRight size={15}/></Link>
          </div>}
        </header>
        {Object.hasOwn(statuses, query.status) && <p className="studio-notice" role="status">{statuses[query.status]}</p>}
        {query.error && <p className="studio-notice" role="alert">{Object.hasOwn(errors, query.error) ? errors[query.error] : 'Check the form fields and try again.'}</p>}
        {page ? seo ? <ChoiceProvider library={library} destinations={destinations}>
          <SeoEditor key={slug} slug={slug} page={page} live={Boolean(live)}
            heading={seoHero?.heading} defaultImage={slug ? metadataImage(page, seoHero) : undefined}/>
          </ChoiceProvider>
          : <PageEditor slug={slug} page={page} live={live} library={library} destinations={destinations}/>
          : id === 'dashboard' ? <Dashboard entries={names} mediaCount={db().prepare('SELECT COUNT(*) AS count FROM assets').get().count + assets.length}/>
          : id === 'enquiries' ? <Enquiries/>
          : id === 'header' || id === 'footer' ? <ChoiceProvider library={library} destinations={destinations}>
            <ChromeEditor key={id + String(query.status)} kind={id} initial={completeChrome(id, readSetting(id))}/>
          </ChoiceProvider>
          : id === 'media' ? <MediaLibrary assets={assets} media={media} search={typeof query.q === 'string' ? query.q : ''}/>
          : id === 'settings' ? <form className="interior-form studio-panel" action={saveSiteSettings}>
            <h2>Search Console verification</h2>
            <label>Google verification value<input name="googleVerification" maxLength={200} defaultValue={readSetting('site')?.googleVerification || ''}/></label>
            <div className="admin-controls"><Submit className="button">Save settings</Submit><Link href="/sitemap.xml">View sitemap</Link></div>
          </form>
          : <>
            {id === 'pages' && <details className="studio-panel studio-create"><summary>New page</summary>
              <form className="interior-form" action={createPage}><div className="admin-fields">
                <label>Page name<input name="title" required maxLength={150}/></label>
                <label>URL slug<input name="slug" required maxLength={90} placeholder="example-page" pattern="[a-z0-9]+(-[a-z0-9]+)*"/></label>
              </div><Submit className="button">Create draft</Submit></form>
            </details>}
            <PageList entries={seo ? names : names.filter(item => groupFor(item.key) === id)} seo={seo}/>
          </>}
      </div>
    </div>
  </main>
}

function PageList({ entries, seo }) {
  if (!entries.length) return <p className="studio-notice">No pages in this section.</p>
  return <div className="studio-table"><table>
    <thead><tr><th>Page</th><th>Status</th><th>Last published (UTC)</th><th><span className="sr-only">Actions</span></th></tr></thead>
    <tbody>{entries.map(item => <tr key={item.key}>
      <th scope="row"><StudioLink href={editorUrl(item.key, seo)}>{item.name}</StudioLink><small>{pagePath(item.key)}</small></th>
      <td><span className="studio-status" data-live={item.live}>{item.live ? 'Published' : 'Draft'}</span>{item.live && item.draft && <small>Draft changes</small>}</td>
      <td>{item.updated || '—'}</td><td><StudioLink href={editorUrl(item.key, seo)} aria-label={'Edit ' + item.name}>Edit <ArrowUpRight size={14}/></StudioLink></td>
    </tr>)}</tbody>
  </table></div>
}

function Dashboard({ entries, mediaCount }) {
  const recent = entries.filter(item => item.updated).sort((left, right) => right.updated.localeCompare(left.updated)).slice(0, 5)
  return <>
    <div className="studio-metrics">
      {[['Pages', entries.length], ['Published', entries.filter(item => item.live).length], ['Draft changes', entries.filter(item => item.draft).length], ['Media', mediaCount]].map(([label, count]) => <div key={label}><span>{label}</span><strong>{count}</strong></div>)}
    </div>
    <div className="admin-controls studio-quick">
      <Link href={areaUrl('pages')}>Manage pages</Link><Link href={areaUrl('media')}>Add media</Link><Link href={areaUrl('seo')}>Manage SEO</Link>
    </div>
    <h2 className="studio-subheading">Recent publications</h2>
    {recent.length ? <PageList entries={recent}/> : <p className="studio-notice">Pages you publish in Content Studio will appear here.</p>}
  </>
}

function PageEditor({ slug, page, live, library, destinations }) {
  const revisions = db().prepare('SELECT id, created FROM revisions WHERE slug = ? ORDER BY id DESC LIMIT 8').all(slug)
  return <>
    <ChoiceProvider library={library} destinations={destinations}><Editor key={slug} slug={slug} page={{ ...page, sections: editablePageSections(slug, page) }}
      initialLayout={pageLayout(slug, page)} catalog={pageSectionCatalog(slug, page)}/></ChoiceProvider>
    <details className="studio-history"><summary>Publish history</summary>
      {revisions.length ? <ul>{revisions.map(item => <li key={item.id}>{item.created} UTC</li>)}</ul> : <p>No publications yet.</p>}
    </details>
    {(live || !basePage(slug)) && <form className="admin-controls studio-lifecycle" action={changePageStatus}>
      <input type="hidden" name="slug" value={slug}/>
      {live && <Submit name="intent" value="unpublish" confirm="Unpublish this page? Its public URL will stop serving content.">Unpublish</Submit>}
      {!basePage(slug) && <Submit className="studio-danger" name="intent" value="delete" confirm="Permanently delete this page and its revisions?">Delete page</Submit>}
    </form>}
  </>
}

function MediaLibrary({ assets, media, search }) {
  const matches = name => name.toLowerCase().includes(search.trim().toLowerCase())
  const items = [...media.map(item => ({ ...item, name: item.name || item.id, path: '/api/media/' + item.id })),
    ...assets.map(name => ({ name, path: '/media/' + name, mime: /\.(mp4|webm)$/i.test(name) ? 'video' : 'image' }))].filter(item => matches(item.name))
  return <>
    <form className="interior-form studio-panel" action={manageMedia}><div className="admin-fields">
      <label>Upload photos or videos<input type="file" name="file" multiple required accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"/></label>
      <label>Alt text for this batch<input name="alt" maxLength={300}/></label>
    </div><p>Choose one or several files. Up to 24 MB per batch and 20 MB per file.</p><Submit className="button" name="intent" value="upload">Upload media</Submit></form>
    <form className="interior-form studio-search"><input type="hidden" name="view" value="media"/><label>Search media<input name="q" type="search" defaultValue={search}/></label><button className="button">Search</button></form>
    {!items.length && <p className="studio-notice">No matching media.</p>}
    <div className="studio-tiles">{items.map(item => <article className="studio-tile studio-asset" key={item.path}>
      {item.mime.startsWith('video') ? <video src={item.path} controls preload="none"/> : <img src={item.path} alt={item.alt || ''} loading="lazy"/>}
      <h2>{item.name}</h2><small>{item.created ? item.created + ' UTC' : item.id ? 'Upload date unavailable' : 'Site asset'}</small>
      <a href={item.path} target="_blank" rel="noreferrer">{item.path}</a>
      {item.id && <form className="interior-form" action={manageMedia}>
        <input type="hidden" name="id" value={item.id}/><label>Alt text<input name="alt" defaultValue={item.alt || ''} maxLength={300}/></label>
        <div className="admin-controls"><Submit name="intent" value="alt">Save alt text</Submit><Submit className="studio-danger" name="intent" value="delete" confirm="Permanently delete this upload?">Delete</Submit></div>
      </form>}
    </article>)}</div>
  </>
}

function Enquiries() {
  const leads = db().prepare('SELECT * FROM leads ORDER BY id DESC LIMIT 30').all()
  return <div className="studio-enquiries">
    {!leads.length && <p className="studio-notice">No enquiries yet.</p>}
    {leads.map(lead => <article className="studio-page-tile" key={lead.id}><div><h2>{lead.name}</h2><p>{lead.service} · {lead.email}</p>{lead.phone && <p><a href={'tel:' + lead.phone.replace(/[^+\d]/g, '')}>{lead.phone}</a></p>}<p>{lead.message}</p></div></article>)}
  </div>
}
