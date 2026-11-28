'use client'

import Thumbnail from 'next/image'
import { createContext, useContext, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, Image, Link2, Search, Upload, Video, X } from 'lucide-react'
import { uploadAssets } from './actions'
import { mediaUrl, isVideo } from '../media-source'

const EditorChoices = createContext({ library: [], destinations: [] })
const pageSize = 24

export function ChoiceProvider({ children, library, destinations }) {
  const [uploads, setUploads] = useState([])
  const choices = useMemo(() => {
    const indexed = new Map([...uploads, ...library].map(item => [item.value, item]))
    return {
      indexed,
      library: [...indexed.values()].map(item => ({
        ...item, search: [item.name, item.alt, item.value].filter(Boolean).join(' ').toLowerCase(),
      })),
      destinations,
      addAsset: item => setUploads(current => [item, ...current]),
    }
  }, [destinations, library, uploads])
  return <EditorChoices.Provider value={choices}>{children}</EditorChoices.Provider>
}

export function LinkField({ label, value, onChange, required }) {
  const { destinations } = useContext(EditorChoices)
  const match = destinations.some(item => item.value === value)
  const [customValue, setCustomValue] = useState(null)
  const custom = Boolean(value && !match) || customValue === value
  return <div className="studio-destination">
    <label><span className="studio-field-caption"><Link2 size={14} aria-hidden="true"/> {label}</span><select value={custom ? 'custom' : value} onChange={event => {
      setCustomValue(event.target.value === 'custom' ? '' : null)
      onChange(event.target.value === 'custom' ? '' : event.target.value)
    }}>
      <option value="">Choose a destination</option>
      {destinations.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}
      <option value="custom">Custom link</option>
    </select></label>
    {custom && <label>Custom link<input className="studio-path-value" value={value} required={required} onChange={event => {
      setCustomValue(event.target.value)
      onChange(event.target.value)
    }} placeholder="https://… or /page/"/></label>}
  </div>
}

export function MediaPicker({ label, value, onChange, imageOnly = false, videoOnly = false, onSelect }) {
  const { library, indexed, addAsset } = useContext(EditorChoices)
  const dialog = useRef(null)
  const [query, setQuery] = useState('')
  const [opened, setOpened] = useState(false)
  const [type, setType] = useState('all')
  const [pageIndex, setPageIndex] = useState(0)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const item = indexed?.get(value)
  const video = item?.video ?? isVideo(value)
  const matches = useMemo(() => {
    if (!opened) return []
    const search = query.trim().toLowerCase()
    const selectedType = imageOnly ? 'images' : videoOnly ? 'videos' : type
    return library.filter(item => (selectedType === 'all' || item.video === (selectedType === 'videos')) && item.search.includes(search))
  }, [imageOnly, videoOnly, library, opened, query, type])
  const pageCount = Math.max(1, Math.ceil(matches.length / pageSize))
  const currentPage = Math.min(pageIndex, pageCount - 1)
  const firstItem = currentPage * pageSize
  const visibleAssets = matches.slice(firstItem, firstItem + pageSize)

  async function upload(file) {
    if (!file) return
    if (videoOnly && !/\.(mp4|webm)$/i.test(file.name)) {
      setError('Choose an MP4 or WebM video.')
      return
    }
    const form = new FormData()
    form.append('file', file)
    if (imageOnly) form.set('imageOnly', '1')
    setPending(true)
    setError('')
    try {
      const result = await uploadAssets(form)
      if (result.error) { setError(result.error); return }
      const uploaded = result.items[0]
      addAsset(uploaded)
      onChange(uploaded.value)
      onSelect?.(uploaded)
      setQuery('')
      setType('all')
      setPageIndex(0)
      dialog.current.close()
    } catch {
      setError('Upload failed. Each file must be under 20 MB.')
    } finally {
      setPending(false)
    }
  }

  return <div className="studio-media-picker" data-selected={Boolean(value)}>
    <div className="studio-media-field">
      <label><span className="studio-field-caption"><Image size={15} aria-hidden="true"/> {label}</span><input className="studio-path-value" value={value || ''} onChange={event => onChange(event.target.value)} placeholder="Choose media or enter an HTTPS link"/></label>
      <div className="admin-controls">
        <button type="button" className="studio-add" onClick={() => { setError(''); setOpened(true); dialog.current.showModal() }}><Upload size={16} aria-hidden="true"/> Browse or upload</button>
        {value && <button type="button" title="Clear selection" onClick={() => onChange('')}><X size={15} aria-hidden="true"/> Clear</button>}
      </div>
    </div>
    {value && <div className="studio-media-preview">{video
      ? <video src={mediaUrl(value)} controls preload="none" aria-label={label + ' preview'}/>
      : <img src={mediaUrl(value)} alt={item?.alt || label + ' preview'} loading="lazy"/>}</div>}
    <dialog ref={dialog} className="studio-media-dialog" onClose={() => setOpened(false)}
      onCancel={event => { if (pending) event.preventDefault() }} aria-label={label + ' library'}>
      {opened && <>
      <header><h2>{label}</h2><button type="button" disabled={pending} aria-label="Close media library" onClick={() => dialog.current.close()}><X size={20}/></button></header>
      <div className="studio-media-tools">
        <label><Search size={16}/>Search files<input type="search" value={query} onChange={event => { setPageIndex(0); setQuery(event.target.value) }}/></label>
        <label><Upload size={16}/>Upload a file<input type="file" disabled={pending}
          accept={imageOnly ? 'image/jpeg,image/png,image/webp' : videoOnly ? 'video/mp4,video/webm' : 'image/jpeg,image/png,image/webp,video/mp4,video/webm'}
          onChange={event => { upload(event.target.files?.[0]); event.target.value = '' }}/></label>
      </div>
      {pending && <p role="status">Uploading…</p>}
      {error && <p role="alert">{error}</p>}
      <div className="studio-media-pagination">
        {!imageOnly && !videoOnly && <label>Media type<select value={type} onChange={event => { setPageIndex(0); setType(event.target.value) }}>
          <option value="all">Images and videos</option><option value="images">Images</option><option value="videos">Videos</option>
        </select></label>}
        <p role="status">{matches.length
          ? `${firstItem + 1}–${firstItem + visibleAssets.length} of ${matches.length} ${imageOnly ? 'images' : 'files'}`
          : 'No matching files.'}</p>
        {pageCount > 1 && <div className="admin-controls" aria-label="Media pages">
          <button type="button" aria-label="Previous media page" disabled={currentPage === 0} onClick={() => setPageIndex(currentPage - 1)}><ChevronLeft size={16} aria-hidden="true"/></button>
          <span>{currentPage + 1} / {pageCount}</span>
          <button type="button" aria-label="Next media page" disabled={currentPage + 1 === pageCount} onClick={() => setPageIndex(currentPage + 1)}><ChevronRight size={16} aria-hidden="true"/></button>
        </div>}
      </div>
      <div className="studio-picker-grid">
        {visibleAssets.map(item => <button key={item.value} type="button" aria-pressed={value === item.value} disabled={pending} onClick={() => {
          onChange(item.value); onSelect?.(item); dialog.current.close()
        }}>
          {item.video ? <span className="studio-picker-video" aria-hidden="true"><Video size={22}/></span>
            : <Thumbnail src={mediaUrl(item.value)} width={160} height={107} alt="" loading="lazy"/>}
          <span>{item.name}</span>
        </button>)}
      </div>
      </>}
    </dialog>
  </div>
}
