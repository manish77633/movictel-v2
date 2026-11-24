import { PropertyHero, PropertyStory } from './property-story'
import { Scenario } from './scenario'
import { servicePhotos } from './service-photos'
import { serviceExamples, workflowDetails } from './service-examples'

export { serviceImages } from './service-photos'

export function ServiceDetail({ page, basics, guide, slug, draft }) {
  const [name, definition, useCase, deliverables] = basics
  const [exampleLabel, exampleTitle, exampleText] = guide.sample
  const { hero, cutouts, examplePhotos, workflowPhotos } = servicePhotos[slug]
  const [descriptions, exampleSteps] = serviceExamples[slug]
  const bookingHref = '/book-a-consultation/?service=' + encodeURIComponent(slug)
  const topics = [
    { title: name, text: definition, image: cutouts[0] },
    ...deliverables.map((title, index) => ({
      title, text: descriptions[index], image: cutouts[index + 1],
    })),
  ]
  const steps = exampleSteps.map(([title, text], index) => [title, text, examplePhotos[index], 'Step ' + (index + 1)])
  const story = guide.workflow.map(([title, result], index) => ({
    title, result, name, image: workflowPhotos[index], intro: workflowDetails[slug][index],
  }))
  const scope = page.sections.filter(item => item.visible !== false)

  return <main className="property-story" id="home">
    <PropertyHero page={{ ...page, image: page.image?.startsWith('/') ? page.image : hero }} draft={draft} bookingHref={bookingHref}/>
    <PropertyStory topics={topics} topicsTitle={'What you get with ' + name} topicsIntro={useCase}
      steps={steps} previewTitle={exampleTitle} previewLabel={exampleLabel} previewIntro={exampleText}
      story={story} storyTitle={'How we deliver ' + name} inputs={guide.inputs}
      ctaTitle="Plan your project" ctaText="Bring what you have so we can discuss your goals and agree on the first step."
      bookingHref={bookingHref}>
      {scope.length > 0 && <div className="property-service-scope">{scope.map((section, index) =>
        <article key={section.id || index} id={section.id}>
          <h3>{section.heading}</h3>
          <p>{section.text}</p>
          {section.points?.length > 0 && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}
          {section.links?.length > 0 && <div className="property-service-links">{section.links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>}
        </article>
      )}</div>}
      {page.scenario && <Scenario scenario={page.scenario}/>}
      {page.faq?.length > 0 && <div className="property-preview-faq">{page.faq.map(([question, answer]) =>
        <details key={question}><summary>{question}</summary><p>{answer}</p></details>
      )}</div>}
    </PropertyStory>
  </main>
}
