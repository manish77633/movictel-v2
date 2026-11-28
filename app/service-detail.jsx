import { SectionHeading, SectionText } from './managed-sections'
import { CampaignOverview, CampaignPreview, CampaignResults, PropertyHero, ProjectBrief } from './property-story'
import { Scenario } from './scenario'
import { LayoutSections, SectionFrame, SectionMedia } from './section-frame'

export { serviceImages } from './service-photos'

export function ServiceDetail({ page, layout, draft, enquiry }) {
  const scope = page.sections.filter(item => item.visible !== false)
  const render = {
    hero: content => <PropertyHero content={content} draft={draft}/>,
    overview: content => <CampaignOverview content={content}/>,
    example: content => <CampaignPreview content={content}>
      {scope.length > 0 && <div className="property-service-scope">{scope.map((section, index) =>
        <SectionFrame key={section.id || index} section={{ ...section, visible: true }}>
          <article id={section.id}>
            <SectionHeading tag="h3" section={section}/><SectionText section={section}/>
            <SectionMedia value={section.image} mime={section.mediaType} alt={section.imageAlt}/>
          </article>
        </SectionFrame>
      )}</div>}
    </CampaignPreview>,
    scenario: content => <div className="wrap"><Scenario scenario={{ title: content.heading, label: content.label, lead: content.text,
      actions: content.actions.map(({ label, text }) => [label, text]) }}/></div>,
    faq: content => <div className="wrap property-preview-faq">
      {content.heading && <h2>{content.heading}</h2>}
      {content.questions.map(({ question, answer }, index) => <details key={index}><summary>{question}</summary><p>{answer}</p></details>)}
    </div>,
    workflow: content => <CampaignResults title={content.heading} items={content.stages}/>,
    brief: content => <ProjectBrief content={content}/>,
    enquiry: () => enquiry,
  }
  return <main className="property-story" id="home">
    <LayoutSections layout={layout} hiddenHeading={page.title} render={(id, content) => render[id](content)}/>
  </main>
}
