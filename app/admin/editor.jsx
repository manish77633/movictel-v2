'use client'
import { ArrowDown, ArrowUp, Check, CloudUpload, Copy, Plus, Save, Trash2 } from 'lucide-react'
import { useActionState, useEffect, useRef, useState } from 'react'
import { savePage } from './actions'
import { announceContentChange } from './content-events'
import { Submit } from './submit'
import { collectionLabels, sectionTypes } from '../section-types'
import { LinkField, MediaPicker } from './editor-choices'
import { NativeSectionsEditor } from './native-sections-editor'
import { buttonPositions } from './layout-fields'
import { pagePath } from '../seo'
import './editor-interactions.css'

export function Editor({ slug, page, initialLayout, catalog }) {
  const [status, save, pending] = useActionState(savePage, null)
  const [layout, setLayout] = useState(initialLayout)
  const draftButton = useRef(null)
  const nextKey = useRef(page.sections.length)
  const [pageFields, setPageFields] = useState(() => ({
    title: page.title || '', label: page.label || '', intro: page.intro || '', image: page.image || '', imageAlt: page.imageAlt || '',
  }))
  const [sections, setSections] = useState(() => page.sections.map((section, index) => ({ ...section, editorKey: index })))
  const completed = status?.saved
  const savedAt = status?.savedAt
  useEffect(() => {
    if (completed && savedAt) announceContentChange(slug, completed === 'published')
  }, [completed, savedAt, slug])

  function updateField(field, value) {
    setPageFields(current => ({ ...current, [field]: value }))
  }

  function duplicate(index) {
    const editorKey = nextKey.current++
    setSections(current => {
      const { id: _id, ...original } = structuredClone(current[index])
      return current.toSpliced(index + 1, 0, { ...original, editorKey })
    })
  }
  function edit(index, patch) {
    setSections(current => current.map((section, i) => i === index ? { ...section, ...patch } : section))
  }
  function removeEntry(index, field, entry) {
    edit(index, { [field]: sections[index][field].filter((_, i) => i !== entry) })
  }
  function move(index, direction) {
    setSections(current => {
      const copy = [...current]
      const other = index + direction
      ;[copy[index], copy[other]] = [copy[other], copy[index]]
      return copy
    })
  }

  return <form className="interior-form admin-editor" action={save} onKeyDown={event => {
    if (event.defaultPrevented || event.repeat || event.nativeEvent.isComposing || (!event.metaKey && !event.ctrlKey) || event.shiftKey || event.altKey || event.key.toLowerCase() !== 's' || event.target.closest('dialog[open]')) return
    event.preventDefault()
    draftButton.current?.click()
  }}>
    <input type="hidden" name="slug" value={slug}/>
    <input type="hidden" name="sections" value={JSON.stringify(sections)}/>
    {layout.length > 0 && <input type="hidden" name="layout" value={JSON.stringify(layout)}/>}
    {!layout.length &&
    <fieldset><legend>Page details</legend><div className="admin-fields">
      <label>Published URL<input value={pagePath(slug)} readOnly/></label>
      <label>Page heading (H1)<input name="title" value={pageFields.title} onChange={event => updateField('title', event.target.value)} required/></label>
      <label>Category<input name="label" value={pageFields.label} onChange={event => updateField('label', event.target.value)} required/></label>
      <label>Introduction<textarea name="intro" value={pageFields.intro} onChange={event => updateField('intro', event.target.value)} rows={3}/></label>
      <input type="hidden" name="image" value={pageFields.image}/>
      <MediaPicker label="Hero media" value={pageFields.image} onChange={value => updateField('image', value)}/>
      <label>Hero image alt text<input name="imageAlt" value={pageFields.imageAlt} onChange={event => updateField('imageAlt', event.target.value)}/></label>

    </div></fieldset>}
    {layout.length > 0 && <NativeSectionsEditor layout={layout} catalog={catalog} update={setLayout}/>}
    <h2>{slug.startsWith('blog/') ? 'Article sections' : layout.length ? 'Additional sections' : 'Page sections'}</h2>
    {sections.map((section, index) => <fieldset key={section.editorKey}>
      <legend>Section {index + 1}{section.heading ? ' · ' + section.heading : ''}{section.visible === false && ' · Hidden'}</legend>
      <div className="admin-controls">
        <button type="button" disabled={!index} onClick={() => move(index, -1)} aria-label="Move section up" title="Move up"><ArrowUp size={16} aria-hidden="true"/></button>
        <button type="button" disabled={index === sections.length - 1} onClick={() => move(index, 1)} aria-label="Move section down" title="Move down"><ArrowDown size={16} aria-hidden="true"/></button>
        <button type="button" disabled={sections.length >= 30} onClick={() => duplicate(index)} title="Duplicate section"><Copy size={16} aria-hidden="true"/> Duplicate</button>
        <button type="button" onClick={() => { if (window.confirm("Remove this section from the page?")) setSections(current => current.filter((_, i) => i !== index)) }} className="studio-danger" aria-label="Remove section" title="Remove"><Trash2 size={16} aria-hidden="true"/></button>
      </div>
      <label className="admin-checkbox"><input type="checkbox" checked={section.visible !== false} onChange={event => edit(index, { visible: event.target.checked })}/> Show on public page</label>
      <label>Section type<select value={section.type || 'content'} onChange={event => edit(index, { type: event.target.value, items: collectionLabels[event.target.value] ? [] : undefined })}>
        {Object.entries(sectionTypes).map(([type, label]) => <option key={type} value={type}>{label}</option>)}
      </select></label>
      <label>Heading<input value={section.heading} onChange={event => edit(index, { heading: event.target.value })} required/></label>
      <label>Text<textarea rows={3} value={section.text} onChange={event => edit(index, { text: event.target.value })}/></label>
      <MediaPicker label="Section media" value={section.image || ''} onChange={image => edit(index, { image })}
        onSelect={asset => { if (asset.alt) edit(index, { imageAlt: asset.alt }) }}/>
      <label>Image alt text<input value={section.imageAlt || ''} onChange={event => edit(index, { imageAlt: event.target.value })}/></label>
      <label>Background color<input value={section.background || ''} placeholder="#f2f6ff" onChange={event => edit(index, { background: event.target.value })}/></label>
      <details className="studio-inner-details"><summary>Background image or video</summary>
        <MediaPicker label="Section background media" value={section.backdrop || ''} onChange={backdrop => edit(index, { backdrop })}/>
      </details>
      <label>Icon<select value={section.icon || ''} onChange={event => edit(index, { icon: event.target.value })}>
        <option value="">None</option><option value="building">Building</option><option value="messaging">Messaging</option><option value="phone">Phone</option><option value="growth">Growth</option>
      </select></label>
      {section.points?.map((point, pointIndex) => <div className="studio-list-item" key={pointIndex}>
        <label>Bullet point {pointIndex + 1}<input value={point} onChange={event => edit(index, { points: section.points.map((item, i) => i === pointIndex ? event.target.value : item) })}/></label>
        <div className="admin-controls"><button type="button" onClick={() => removeEntry(index, 'points', pointIndex)} className="studio-danger" aria-label="Remove bullet" title="Remove bullet"><Trash2 size={16} aria-hidden="true"/></button></div>
      </div>)}
      {section.steps?.map((step, stepIndex) => <div className="studio-list-item" key={stepIndex}><label>Workflow step {stepIndex + 1}
        <input value={step} onChange={event => edit(index, { steps: section.steps.map((item, i) => i === stepIndex ? event.target.value : item) })}/>
      </label><div className="admin-controls"><button type="button" onClick={() => removeEntry(index, 'steps', stepIndex)} className="studio-danger" aria-label="Remove step" title="Remove step"><Trash2 size={16} aria-hidden="true"/></button></div></div>)}
      {section.links?.map(([label, url], linkIndex) => <div className="admin-fields" key={linkIndex}>
        <label>Link label<input value={label} onChange={event => edit(index, { links: section.links.map((item, i) => i === linkIndex ? [event.target.value, url] : item) })}/></label>
        <LinkField label="Destination" value={url} onChange={href => edit(index, { links: section.links.map((item, i) => i === linkIndex ? [label, href] : item) })}/>
        <div className="admin-controls"><button type="button" onClick={() => removeEntry(index, 'links', linkIndex)} className="studio-danger" aria-label="Remove link" title="Remove link"><Trash2 size={16} aria-hidden="true"/></button></div>
      </div>)}
      {!!section.links?.length && <label>Button position<select value={section.buttonPosition || 'start'} onChange={event => edit(index, { buttonPosition: event.target.value })}>
        {Object.entries(buttonPositions).map(([key, text]) => <option value={key} key={key}>{text}</option>)}
      </select></label>}
      <div className="admin-controls">
        <button type="button" onClick={() => edit(index, { points: [...(section.points || []), ''] })} className="studio-add"><Plus size={16} aria-hidden="true"/> Add bullet</button>
        <button type="button" onClick={() => edit(index, { steps: [...(section.steps || []), ''] })} className="studio-add"><Plus size={16} aria-hidden="true"/> Add workflow step</button>
        <button type="button" onClick={() => edit(index, { links: [...(section.links || []), ['', '/']] })} className="studio-add"><Plus size={16} aria-hidden="true"/> Add link</button>
      </div>
      {collectionLabels[section.type] && <CollectionFields labels={collectionLabels[section.type]} items={section.items || []}
        update={items => edit(index, { items })} gallery={section.type === 'gallery'}/>}
    </fieldset>)}
    <div className="admin-controls studio-savebar">
      {status?.error && <p role="alert" className="studio-save-error">{status.error}</p>}
      <button type="button" disabled={sections.length >= 30} onClick={() => { const editorKey = nextKey.current++; setSections(current => [...current, { editorKey, heading: '', text: '' }]) }} className="studio-add"><Plus size={16} aria-hidden="true"/> Add section</button>
      <span className="studio-save-feedback" role="status">
        {pending ? 'Saving…' : completed && <><Check size={16} aria-hidden="true"/> {completed === 'draft' ? 'Draft saved' : status.sectionId ? (layout.find(item => item.id === status.sectionId)?.name || 'Section') + ' published' : 'Changes published'}</>}
      </span>
      <Submit ref={draftButton} name="intent" value="draft" className="studio-draft" aria-keyshortcuts="Control+S Meta+S" title="Save draft (Ctrl+S or ⌘S)"><Save size={16} aria-hidden="true"/> Save draft</Submit>
      <Submit className="button" name="intent" value="publish"><CloudUpload size={17} aria-hidden="true"/> Publish</Submit>
    </div>
  </form>
}


function CollectionFields({ labels: [title, first, second], items, update, gallery }) {
  const change = (index, firstValue, secondValue) => update(items.map((item, i) => i === index ? [firstValue, secondValue] : item))
  return <div className="studio-list-editor"><h3>{title}</h3>
    {items.map(([left, right], index) => <div className="studio-list-item" key={index}>
      <div className="admin-fields">
        <>{gallery ? <MediaPicker label={first} value={left} imageOnly onChange={value => change(index, value, right)}/> : <label>{first}<input value={left} required onChange={event => change(index, event.target.value, right)}/></label>}</>
        <label>{second}<textarea value={right} rows={2} onChange={event => change(index, left, event.target.value)}/></label>
      </div>
      <div className="admin-controls"><button type="button" onClick={() => update(items.filter((_, i) => i !== index))} className="studio-danger" aria-label="Remove item" title="Remove item"><Trash2 size={16} aria-hidden="true"/></button></div>
    </div>)}
    <div className="admin-controls"><button type="button" onClick={() => update([...items, ['', '']])} className="studio-add"><Plus size={16} aria-hidden="true"/> Add item</button></div>
  </div>
}

