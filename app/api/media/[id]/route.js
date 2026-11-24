import { db } from '../../../store'

export async function GET(request, { params }) {
  const { id } = await params
  const row = db().prepare('SELECT mime,bytes FROM assets WHERE id = ?').get(id)
  if (!row) return new Response(null, { status: 404 })
  const size = row.bytes.byteLength
  const headers = {
    'Content-Type': row.mime, 'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'public, max-age=31536000, immutable', 'Accept-Ranges': 'bytes',
  }
  const range = request.headers.get('range')
  if (!range) return new Response(row.bytes, { headers: { ...headers, 'Content-Length': size } })
  const match = /^bytes=(\d*)-(\d*)$/.exec(range)
  const start = match?.[1] ? Number(match[1]) : Math.max(0, size - Number(match?.[2]))
  const end = match?.[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1
  if (!match || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end) {
    return new Response(null, { status: 416, headers: { ...headers, 'Content-Range': 'bytes */' + size } })
  }
  return new Response(row.bytes.subarray(start, end + 1), { status: 206, headers: {
    ...headers, 'Content-Length': end - start + 1, 'Content-Range': 'bytes ' + start + '-' + end + '/' + size,
  } })
}
