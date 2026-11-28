'use client'
import { useActionState, useEffect, useState } from 'react'
import { Monitor, Smartphone } from 'lucide-react'
import { saveSeo } from './actions'
import { seoFields } from './seo-fields'
import { MediaPicker } from './editor-choices'
import { Submit } from './submit'
import { announceContentChange } from './content-events'
import { pagePath, siteOrigin } from '../seo'
import { buildMetadata } from '../page-metadata'

export function SeoEditor({ slug, page, live, heading, defaultImage }) {
  const [values, setValues] = useState(() => ({
    ...Object.fromEntries(Object.keys(seoFields).map(key => [key, page[key]])),
    title: heading ?? page.title, intro: page.intro, noIndex: page.noIndex, noFollow: page.noFollow,
  }))
  const [device, setDevice] = useState('desktop')
  const [result, submit, pending] = useActionState(saveSeo, null)
  const [dirty, setDirty] = useState(false)
  const patch = changes => {
    setDirty(true)
    setValues(current => ({ ...current, ...changes }))
  }
  const update = key => event => patch({ [key]: event.target.value })
  const metadata = buildMetadata(slug, values, false, defaultImage)
  const graph = metadata.openGraph

  useEffect(() => {
    if (!result?.saved) return
    announceContentChange(slug, result.published)
  }, [result, slug])

  return <form className="interior-form admin-editor" action={submit} onSubmit={() => setDirty(false)}>
    <input type="hidden" name="slug" value={slug}/>
    <input type="hidden" name="shareImage" value={values.shareImage || ''}/>
    <div className="studio-seo-layout">
      <fieldset><legend>Search and social metadata</legend>
        <label>Page heading (H1)<input name="title" required maxLength={300} value={values.title} onChange={update('title')}/></label>
        {Object.entries(seoFields).filter(([key]) => key !== 'shareImage').map(([key, [label, maxLength]]) => <label key={key}>{label}
          {key.endsWith('Description')
            ? <textarea name={key} maxLength={maxLength} rows={3} value={values[key] || ''} onChange={update(key)}/>
            : <input name={key} maxLength={maxLength} value={values[key] || ''} onChange={update(key)}
                placeholder={key === 'canonical' ? siteOrigin + pagePath(slug) : undefined}/>}
        </label>)}
        <MediaPicker label="Social image" imageOnly value={values.shareImage || ''}
          onChange={shareImage => patch({ shareImage })}
          onSelect={asset => { if (asset.alt) patch({ shareImageAlt: asset.alt }) }}/>
        <label className="admin-checkbox"><input type="checkbox" name="noIndex" checked={Boolean(values.noIndex)} onChange={event => patch({ noIndex: event.target.checked })}/> Request exclusion from search results</label>
        <label className="admin-checkbox"><input type="checkbox" name="noFollow" checked={Boolean(values.noFollow)} onChange={event => patch({ noFollow: event.target.checked })}/> Ask crawlers to ignore links on this page</label>
      </fieldset>
      <div className="studio-seo-side studio-seo-preview">
        <div className="admin-controls" aria-label="Preview width" role="group">
          <button type="button" aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Monitor size={16} aria-hidden="true"/> Desktop</button>
          <button type="button" aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}><Smartphone size={16} aria-hidden="true"/> Mobile</button>
        </div>
        <div className="studio-seo-device" data-device={device}>
          <section className="studio-panel"><h2>Search preview</h2>
            <p className="studio-preview-url">{previewUrl(metadata.alternates.canonical)}</p>
            <p className="studio-preview-title">{typeof metadata.title === 'string' ? metadata.title + ' | Movictel' : metadata.title.absolute}</p>
            <p>{metadata.description || 'Add a description for this page.'}</p>
            <small>{values.noIndex ? 'This page requests exclusion from search.' : 'Google may rewrite the title and snippet.'}</small>
          </section>
          <section className="studio-panel studio-social-preview"><h2>Social preview</h2>
            <img src={graph.images[0].url} alt={graph.images[0].alt || ''}/>
            <strong>{graph.title}</strong>
            <p>{graph.description}</p>
          </section>
        </div>
      </div>
    </div>
    <div className="admin-controls studio-savebar">
      {result?.error && <p role="alert" className="studio-save-error">{result.error}</p>}
      {!dirty && !pending && result?.saved && <p role="status">{result.published ? 'SEO published.' : 'SEO draft saved.'}</p>}
      <Submit name="intent" value="draft">Save SEO draft</Submit>
      <Submit className="button" name="intent" value="publish" disabled={!live}>Publish SEO</Submit>
    </div>
    {!live && <p>Publish this page from Pages before publishing SEO on its own.</p>}
  </form>
}

function previewUrl(value) {
  try { return new URL(value, siteOrigin).href }
  catch { return value }
}

