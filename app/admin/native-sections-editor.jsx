'use client'

import { useRef } from 'react'
import { ArrowDown, ArrowUp, ChevronDown, CloudUpload, Copy, Eye, EyeOff, Image, Layers3, MousePointer2, Plus, RotateCcw, SlidersHorizontal, Trash2 } from 'lucide-react'
import { buttonPositions, defaultItem, fieldType } from './layout-fields'
import { sectionAction } from '../section-layout'
import { LinkField, MediaPicker } from './editor-choices'
import { Submit } from './submit'

const sectionIcons = { hero: Image, closing: MousePointer2, explore: Image, 'client-videos': Image }
const labels = { heading: 'Heading', media: 'Image or video', imageAlt: 'Image alt text', href: 'Destination', text: 'Text', faq: 'FAQ', ivr: 'IVR', rotatingHeadlines: 'Rotating headlines' }
const fieldLabel = key => labels[key] || (key.charAt(0).toUpperCase() + key.slice(1)).replace(/[A-Z]/g, (letter, index) => index ? ' ' + letter.toLowerCase() : letter)

export function moveItem(items, index, delta) {
  const reordered = [...items]
  const other = index + delta
  ;[reordered[index], reordered[other]] = [reordered[other], reordered[index]]
  return reordered
}

export function OrderButtons({ label, index, length, move, children }) {
  return <div className="admin-controls studio-order">
    {children}
    <button type="button" aria-label={'Move ' + label + ' up'} disabled={!index} onClick={() => move(-1)}><ArrowUp size={16} aria-hidden="true"/></button>
    <button type="button" aria-label={'Move ' + label + ' down'} disabled={index + 1 === length} onClick={() => move(1)}><ArrowDown size={16} aria-hidden="true"/></button>
  </div>
}

export function NativeSectionsEditor({ layout, catalog, update }) {
  const list = useRef(null)
  function openSection(event) {
    const id = event.target.value
    if (!id) return
    const details = list.current.querySelector('#edit-section-' + id)
    details.open = true
    details.querySelector('summary').focus()
    details.scrollIntoView({ block: 'start' })
  }
  const setSection = (index, patch) => update(layout.map((section, i) => i === index ? { ...section, ...patch } : section))
  return <div className="studio-section-list" ref={list}>
    <header className="studio-section-toolbar">
      <h2>Page sections <span>{layout.length}</span></h2>
      <label><span className="sr-only">Jump to a section</span><select value="" onChange={openSection}>
        <option value="">Jump to a section</option>
        {layout.map(section => <option key={section.id} value={section.id}>{section.name}</option>)}
      </select></label>
    </header>
    {layout.map((section, index) => {
      const Icon = sectionIcons[section.id] || Layers3
      const Visibility = section.visible ? Eye : EyeOff
      const model = catalog.find(item => item.id === section.id).content
      return <div className="studio-section-row studio-section-with-tools" key={section.id}>
        <details id={'edit-section-' + section.id}>
          <summary><span className="studio-section-name"><span className="studio-section-icon"><Icon size={18} aria-hidden="true"/></span><span><strong>{section.name}</strong>{section.content.heading && section.id !== 'hero' && section.content.heading !== section.name && <small>{section.content.heading}</small>}</span></span>
            <span className="studio-section-state" data-visible={section.visible}><Visibility size={15} aria-hidden="true"/><span>{section.visible ? 'Visible' : 'Hidden'}</span><ChevronDown className="studio-chevron" size={15} aria-hidden="true"/></span>
          </summary>
          <div className="studio-section-fields">
            <div className="studio-section-settings">
              <h3><SlidersHorizontal size={16} aria-hidden="true"/> Section settings</h3>
              <label className="admin-checkbox"><input type="checkbox" checked={section.visible} onChange={event => setSection(index, { visible: event.target.checked })}/> Show on page</label>
              <label>Background color<input type="color" value={section.background || '#0b1225'} onChange={event => setSection(index, { background: event.target.value })}/></label>
              {section.background && <div className="admin-controls"><button type="button" onClick={() => setSection(index, { background: '' })}><RotateCcw size={15} aria-hidden="true"/> Use theme color</button></div>}
            </div>
            <div className="studio-content-fields"><Fields model={model} value={section.content} update={content => setSection(index, { content })}/></div>
            <details className="studio-inner-details"><summary><Image size={16} aria-hidden="true"/> Background image or video <ChevronDown size={16} aria-hidden="true"/></summary>
              <MediaPicker label="Background media" value={section.backdrop} onChange={backdrop => setSection(index, { backdrop })}/>
            </details>
            <details className="studio-inner-details"><summary><MousePointer2 size={16} aria-hidden="true"/> Additional button <ChevronDown size={16} aria-hidden="true"/></summary>
              <Fields model={sectionAction} value={section.action} update={action => setSection(index, { action })}/>
            </details>
            <div className="admin-controls studio-section-publish">
              <Submit type="submit" name="section" value={section.id} formNoValidate className="studio-draft"
                aria-label={'Publish ' + section.name}><CloudUpload size={16} aria-hidden="true"/> Publish section</Submit>
            </div>
          </div>
        </details>
        <OrderButtons label={section.name} index={index} length={layout.length} move={delta => update(moveItem(layout, index, delta))}>
          <button type="button" onClick={() => setSection(index, { visible: !section.visible })}
            aria-label={(section.visible ? 'Hide ' : 'Show ') + section.name} title={section.visible ? 'Hide section' : 'Show section'}>
            <Visibility size={16} aria-hidden="true"/>
          </button>
        </OrderButtons>
      </div>
    })}
  </div>
}

export function Fields({ model, value, update }) {
  return <div className="studio-schema-fields">
    {Object.entries(model).map(([key, seed]) => <Field key={key} name={key} seed={seed} value={value[key]} update={item => update({ ...value, [key]: item })}
      selectAsset={asset => {
        const altKey = Object.hasOwn(value, 'imageAlt') ? 'imageAlt' : Object.hasOwn(value, 'alt') ? 'alt' : ''
        if (altKey && key !== 'poster' && asset.alt) update({ ...value, [key]: asset.value, [altKey]: asset.alt })
      }}/>)}
  </div>
}

function Field({ name, seed, value, update, selectAsset }) {
  const label = fieldLabel(name)
  switch (fieldType(name, seed)) {
    case 'group':
      return <fieldset className="studio-field-group"><legend>{label}</legend><Fields model={seed} value={value} update={update}/></fieldset>
    case 'list':
      return <div className="studio-list-editor studio-field-group"><h3>{label}</h3>
        {value.map((item, index) => <div key={index} className="studio-list-item">
          {typeof seed[0] === 'object'
            ? <Fields model={seed[0]} value={item} update={next => update(value.map((previous, i) => i === index ? next : previous))}/>
            : <label>{label} {index + 1}<input value={item} onChange={event => update(value.map((previous, i) => i === index ? event.target.value : previous))}/></label>}
          <div className="admin-controls">
            <OrderButtons label={label + ' ' + (index + 1)} index={index} length={value.length} move={delta => update(moveItem(value, index, delta))}/>
            <button type="button" disabled={value.length >= 40} aria-label={'Duplicate ' + label.toLowerCase() + ' item ' + (index + 1)}
              title="Duplicate item" onClick={() => update(value.toSpliced(index + 1, 0, structuredClone(item)))}><Copy size={16} aria-hidden="true"/></button>
            <button type="button" className="studio-danger" aria-label={'Remove ' + label.toLowerCase() + ' item ' + (index + 1)}
              title="Remove item" onClick={() => update(value.filter((_, i) => i !== index))}><Trash2 size={16} aria-hidden="true"/></button>
          </div>
        </div>)}
        <div className="admin-controls"><button type="button" disabled={value.length >= 40} onClick={() => update([...value, defaultItem(seed[0])])} className="studio-add"><Plus size={16} aria-hidden="true"/> Add item to {label.toLowerCase()}</button></div>
      </div>
    case 'checkbox':
      return <label className="admin-checkbox"><input type="checkbox" checked={value} onChange={event => update(event.target.checked)}/>{label}</label>
    case 'media':
      return <MediaPicker label={label} value={value} onChange={update} onSelect={selectAsset} imageOnly={name === 'poster'} videoOnly={name === 'video'}/>
    case 'link':
      return <LinkField label={label} value={value} onChange={update}/>
    case 'position':
      return <label>Button position<select value={value} onChange={event => update(event.target.value)}>{Object.entries(buttonPositions).map(([key, text]) => <option value={key} key={key}>{text}</option>)}</select></label>
    case 'textarea':
      return <label className="studio-long-field">{label}<textarea value={value} rows={3} onChange={event => update(event.target.value)}/></label>
    default:
      return <label>{label}<input value={value} onChange={event => update(event.target.value)}/></label>
  }
}
