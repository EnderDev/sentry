import * as minimist from 'minimist';

import { SentryDownloader } from "./src/downloader";

const args = minimist(process.argv.splice(2));

if(args && !args.send) console.log(`🛡️   Sentry will be automagically downloading and merging the lists...\n`)

new SentryDownloader(args);