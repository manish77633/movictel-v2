'use client'
import { useEffect, useRef, useState } from 'react'
import { savePage } from './actions'

export function Editor({ slug, page, assets }) {
  const nextKey = useRef(page.sections.length)
  const [sections, setSections] = useState(() => page.sections.map((section, index) => ({ ...section, editorKey: index })))
  function edit(index, patch) {
    setSections(current => current.map((section, i) => i === index ? { ...section, ...patch } : section))
  }
  function move(index, direction) {
    setSections(current => {
      const copy = [...current]
      const other = index + direction
      ;[copy[index], copy[other]] = [copy[other], copy[index]]
      return copy
    })
  }

  return <form className="interior-form admin-editor" action={savePage}>
    <input type="hidden" name="slug" value={slug}/>
    <input type="hidden" name="sections" value={JSON.stringify(sections)}/>
    <datalist id="media-options">{assets.map(asset => <option key={asset} value={asset}/>)}</datalist>
    <fieldset><legend>Page details</legend><div className="admin-fields">
      <label>Page title<input name="title" defaultValue={page.title} required/></label>
      <label>Category<input name="label" defaultValue={page.label} required/></label>
      <label>Introduction<textarea name="intro" defaultValue={page.intro} rows={3}/></label>
      <label>Hero media path<input name="image" defaultValue={page.image} list="media-options"/></label>
      <label>Hero image alt text<input name="imageAlt" defaultValue={page.imageAlt}/></label>
      <label>SEO title<input name="seoTitle" defaultValue={page.seoTitle}/></label>
      <label>SEO description<input name="seoDescription" defaultValue={page.seoDescription}/></label>
    </div><MediaField name="hero-file" image={page.image} type={page.mediaType}/></fieldset>
    <h2>Page sections</h2>
    {sections.map((section, index) => <fieldset key={section.editorKey}>
      <legend>Section {index + 1}{section.heading ? ' · ' + section.heading : ''}</legend>
      <div className="admin-controls">
        <button type="button" disabled={!index} onClick={() => move(index, -1)}>Move up</button>
        <button type="button" disabled={index === sections.length - 1} onClick={() => move(index, 1)}>Move down</button>
        <button type="button" onClick={() => setSections(current => current.filter((_, i) => i !== index))}>Remove</button>
      </div>
      <label>Heading<input value={section.heading} onChange={event => edit(index, { heading: event.target.value })} required/></label>
      <label>Text<textarea rows={3} value={section.text} onChange={event => edit(index, { text: event.target.value })}/></label>
      <MediaField name={'section-file-' + index} image={section.image} type={section.mediaType}/>
      <label>Media path<input list="media-options" value={section.image || ''} onChange={event => edit(index, { image: event.target.value })}/></label>
      <label>Image alt text<input value={section.imageAlt || ''} onChange={event => edit(index, { imageAlt: event.target.value })}/></label>
      <label>Background color<input value={section.background || ''} placeholder="#f2f6ff" onChange={event => edit(index, { background: event.target.value })}/></label>
      <label>Icon<select value={section.icon || ''} onChange={event => edit(index, { icon: event.target.value })}>
        <option value="">None</option><option value="building">Building</option><option value="messaging">Messaging</option><option value="phone">Phone</option><option value="growth">Growth</option>
      </select></label>
      {section.steps?.map((step, stepIndex) => <label key={stepIndex}>Workflow step {stepIndex + 1}
        <input value={step} onChange={event => edit(index, { steps: section.steps.map((item, i) => i === stepIndex ? event.target.value : item) })}/>
      </label>)}
      {section.links?.map(([label, url], linkIndex) => <div className="admin-fields" key={linkIndex}>
        <label>Link label<input value={label} onChange={event => edit(index, { links: section.links.map((item, i) => i === linkIndex ? [event.target.value, url] : item) })}/></label>
        <label>Link URL<input value={url} onChange={event => edit(index, { links: section.links.map((item, i) => i === linkIndex ? [label, event.target.value] : item) })}/></label>
      </div>)}
      <div className="admin-controls">
        <button type="button" onClick={() => edit(index, { steps: [...(section.steps || []), ''] })}>Add workflow step</button>
        <button type="button" onClick={() => edit(index, { links: [...(section.links || []), ['', '/']] })}>Add link</button>
      </div>
      <label className="admin-checkbox"><input type="checkbox" checked={section.visible !== false} onChange={event => edit(index, { visible: event.target.checked })}/> Show on public page</label>
    </fieldset>)}
    <div className="admin-controls studio-savebar">
      <button type="button" onClick={() => { const editorKey = nextKey.current++; setSections(current => [...current, { editorKey, heading: '', text: '' }]) }}>Add section</button>
      <button className="button" name="intent" value="draft">Save draft</button>
      <button className="button" name="intent" value="publish">Publish</button>
    </div>
  </form>
}


function MediaField({ name, image, type }) {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState('')
  useEffect(() => {
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  const src = preview || (image ? image.startsWith('/') ? image : '/media/' + image : '')
  const isVideo = (file?.type || type)?.startsWith('video/') || /\.mp4$/i.test(image || '')
  return <div className="studio-media">
    {src && (isVideo ? <video src={src} controls playsInline preload="metadata"/> : <img src={src} alt="Media preview"/>)}
    <label>Upload photo or video
      <input type="file" name={name} accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
        onChange={event => setFile(event.target.files?.[0] || null)}/>
    </label>
    <small>JPG, PNG, WebP, MP4 or WebM. Up to 20 MB per file.</small>
  </div>
}
