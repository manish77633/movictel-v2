import { pages } from './content'

export default function sitemap() {
  const origin = 'https://movictel.com'
  return [{ url: origin + '/' }, ...Object.keys(pages).map(slug => ({ url: origin + '/' + slug + '/' }))]
}
