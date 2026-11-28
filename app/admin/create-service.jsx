'use client'

import { useState } from 'react'
import { serviceMenu } from '../service-menu'
import { createService } from './actions'
import { Submit } from './submit'

export function CreateService() {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState(null)
  const suggestion = title.normalize('NFKD').toLowerCase().replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '').slice(0, 90).replace(/-+$/, '')
  return <details className="studio-panel studio-create">
    <summary>Add service</summary>
    <form className="interior-form" action={createService}>
      <div className="admin-fields">
        <label>Service name<input name="title" value={title} onChange={event => setTitle(event.target.value)} required maxLength={150}/></label>
        <label>Category<select name="category" defaultValue="" required>
          <option value="" disabled>Choose a category</option>
          {serviceMenu.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}
        </select></label>
        <label>URL slug<input name="slug" value={slug ?? suggestion} onChange={event => setSlug(event.target.value || null)}
          required maxLength={90} placeholder="example-service" pattern="[a-z0-9]+(-[a-z0-9]+)*"/></label>
      </div>
      <p>The service appears in the navbar and on the Services page when you publish it.</p>
      <Submit className="button">Create service draft</Submit>
    </form>
  </details>
}
