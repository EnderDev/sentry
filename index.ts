import * as express from 'express';

import { SentryDownloader } from './src/downloader';

import * as lists from './lists.json';

const app = express()
const port = 8000

app.get('/', (req: any, res: any) => {
  res.json({
    ok: true,
    version: lists.version
  })
})

app.get('/lists', (req: any, res: any) => {
  res.json(lists)
})

app.listen(port, async () => {
  console.log(`🛡️   Sentry listening at http://localhost:${port}\n`)
})
