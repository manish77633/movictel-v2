'use client'
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from 'lucide-react'
import { useActionState, useEffect, useState } from 'react'
import { chromeDefaults } from '../chrome-content'
import { LinkIcon } from '../link-icon'
import { linkIcons, resolveLinkIcon } from '../link-icons'
import { saveSetting } from './actions'
import { announceContentChange } from './content-events'
import { LinkField, MediaPicker } from './editor-choices'
import { Fields } from './native-sections-editor'
import { Submit } from './submit'

function ListEditor({ label, items, update, create, render }) {
  const replace = (index, value) => update(items.map((item, i) => i === index ? value : item))
  function move(index, direction) {
    const reordered = [...items]
    const other = index + direction
    ;[reordered[index], reordered[other]] = [reordered[other], reordered[index]]
    update(reordered)
  }
  return <div className="studio-list-editor">
    <h3>{label}</h3>
    {items.map((item, index) => <div className="studio-list-item" key={index}>
      {render(item, value => replace(index, value))}
      <div className="admin-controls">
        <button type="button" disabled={!index} onClick={() => move(index, -1)} aria-label="Move up" title="Move up"><ArrowUp size={16} aria-hidden="true"/></button>
        <button type="button" disabled={index === items.length - 1} onClick={() => move(index, 1)} aria-label="Move down" title="Move down"><ArrowDown size={16} aria-hidden="true"/></button>
        <button type="button" onClick={() => update(items.filter((_, i) => i !== index))} className="studio-danger" aria-label="Remove" title="Remove"><Trash2 size={16} aria-hidden="true"/></button>
      </div>
    </div>)}
    <div className="admin-controls"><button type="button" onClick={() => update([...items, create()])} className="studio-add"><Plus size={16} aria-hidden="true"/> Add item</button></div>
  </div>
}

function LinkFields({ entry, update, iconDefault }) {
  const [label, href, icon = iconDefault] = entry
  const change = (name, destination) => update(entry.length === 3 ? [name, destination, icon] : [name, destination])
  return <div className="admin-fields">
    <label>Label<input required value={label} onChange={event => change(event.target.value, href)}/></label>
    <LinkField label="Destination" required value={href} onChange={destination => change(label, destination)}/>
    {iconDefault && <label>Link icon
      <span className="studio-icon-picker">
        <select value={icon} onChange={event => update([label, href, event.target.value])}>
          {Object.entries(linkIcons).map(([id, name]) => <option value={id} key={id}>{name}</option>)}
        </select>
        {icon !== 'none' && <span className="studio-icon-preview"><LinkIcon icon={resolveLinkIcon(icon, href)}/></span>}
      </span>
    </label>}
  </div>
}

export function ChromeEditor({ kind, initial }) {
  const [value, setValue] = useState(initial)
  const [status, save, pending] = useActionState(saveSetting, null)
  useEffect(() => {
    if (status?.saved) announceContentChange(null, true)
  }, [status])
  const update = (key, item) => setValue(current => ({ ...current, [key]: item }))
  const links = (label, items, change, iconDefault) => <ListEditor label={label} items={items} update={change} create={() => ['', '/']}
    render={(entry, edit) => <LinkFields entry={entry} update={edit} iconDefault={iconDefault}/>}/>
  return <form className="interior-form admin-editor" action={save}>
    <input type="hidden" name="setting" value={kind}/>
    <input type="hidden" name="document" value={JSON.stringify(value)}/>
    <fieldset><legend>Brand</legend><div className="admin-fields">
      <MediaPicker label="Logo" imageOnly value={value.logo} onChange={logo => update('logo', logo)}/>
      <label>Logo alt text<input value={value.alt} onChange={event => update('alt', event.target.value)}/></label>
    </div></fieldset>
    {kind === 'header' ? <fieldset><legend>Navigation</legend>
      <div className="admin-fields">
        <label>Home label<input value={value.homepageLabel} onChange={event => update('homepageLabel', event.target.value)}/></label>
        <label>Services menu label<input value={value.servicesLabel} onChange={event => update('servicesLabel', event.target.value)}/></label>
      </div>
      <label className="admin-checkbox"><input type="checkbox" checked={value.showServices} onChange={event => update('showServices', event.target.checked)}/> Show Services menu</label>
      {value.showServices && <details className="studio-inner-details">
        <summary>Services menu content</summary>
        <Fields model={{ servicesButton: chromeDefaults.header.servicesButton, serviceGroups: chromeDefaults.header.serviceGroups }}
          value={{ servicesButton: value.servicesButton, serviceGroups: value.serviceGroups }}
          update={patch => setValue(current => ({ ...current, ...patch }))}/>
      </details>}
      {links('Navigation links', value.links, items => update('links', items))}
      <label className="admin-checkbox"><input type="checkbox" checked={value.showCta} onChange={event => update('showCta', event.target.checked)}/> Show call to action</label>
      <LinkFields entry={value.cta} update={entry => update('cta', entry)}/>
    </fieldset> : <fieldset><legend>Footer content</legend>
      <label>Brand description<textarea value={value.brandText} onChange={event => update('brandText', event.target.value)}/></label>
      <label>Back to top label<input value={value.backToTop} onChange={event => update('backToTop', event.target.value)}/></label>
      <fieldset><legend>Contact</legend><Fields model={initial.contact} value={value.contact} update={contact => update('contact', contact)}/></fieldset>
      <label>Copyright<input value={value.copyright} onChange={event => update('copyright', event.target.value)}/></label>
      <ListEditor label="Columns" items={value.columns} update={items => update('columns', items)} create={() => ({ title: '', links: [] })}
        render={(column, edit) => <>
          <label>Column title<input required value={column.title} onChange={event => edit({ ...column, title: event.target.value })}/></label>
          {links('Column links', column.links, items => edit({ ...column, links: items }), 'none')}
        </>}/>
      {links('Social links', value.socials, items => update('socials', items), 'auto')}
      <label className="admin-checkbox"><input type="checkbox" checked={value.showClosing} onChange={event => update('showClosing', event.target.checked)}/> Show the shared closing call to action</label>
      {value.showClosing && <fieldset><legend>Closing call to action on interior pages</legend>
        <Fields model={initial.closing} value={value.closing} update={closing => update('closing', closing)}/>
      </fieldset>}
    </fieldset>}
    <div className="admin-controls studio-savebar">
      {status?.error && <p role="alert" className="studio-save-error">{status.error}</p>}
      {!pending && status?.saved && <p role="status" className="studio-save-success">Saved.</p>}
      <Submit className="button"><Save size={16} aria-hidden="true"/> Save {kind}</Submit>
    </div>
  </form>
}
