import { mediaUrl, isVideo } from './media-source'

export function SectionMedia({ value, alt = '', poster, className, priority = false, background = false, mime }) {
  if (!value) return null
  const src = mediaUrl(value)
  if (isVideo(value, mime)) return <video className={className} src={src} poster={mediaUrl(poster)} preload="metadata"
    playsInline muted={background} autoPlay={background} loop={background} controls={!background} aria-label={alt || undefined}/>
  return <img className={className} src={src} alt={alt} loading={priority ? undefined : 'lazy'} fetchPriority={priority ? 'high' : undefined}/>
}

export function SectionFrame({ section, children }) {
  if (!section.visible) return null
  const action = section.action
  const extra = action?.button?.label && action.button.href && <div className="wrap cms-buttons cms-extra-button" data-position={action.buttonPosition}>
    <SectionButton button={action.button}/>
  </div>
  if (!section.backdrop && !section.background && !extra) return children
  return <div className="cms-section-frame" style={{ '--cms-section-color': section.background || undefined }}>
    {section.backdrop && <div className="cms-section-backdrop" aria-hidden="true"><SectionMedia value={section.backdrop} background/></div>}
    <div className="cms-section-content">{action?.showAbove && extra}{children}{!action?.showAbove && extra}</div>
  </div>
}

export function LayoutSections({ layout, render, hiddenHeading }) {
  return <>
    {hiddenHeading && !layout.find(section => section.id === 'hero')?.visible && <h1 className="sr-only">{hiddenHeading}</h1>}
    {layout.map(section => section.visible && <SectionFrame key={section.id} section={section}>{render(section.id, section.content)}</SectionFrame>)}
  </>
}

export function SectionButton({ button, className = 'button', children }) {
  if (!button?.href || !button.label) return null
  return <a className={className} href={button.href}>{button.label}{children}</a>
}
