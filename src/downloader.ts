// @ts-nocheck

import axios from 'axios';
import * as minimist from 'minimist';
import { join } from 'path';
import { writeFileSync } from 'fs';

import * as lists from '../lists.json';

export class SentryDownloader {
  public hosts: Set = new Set(); 
  public args: { send: boolean } = {}

  constructor(args) {
    this.args = args;

    var t = Date.now()

    this.init().then(_ => {
      const hosts = Array.from(this.hosts).join("\n");

      if(this.args && this.args.send) return console.log(hosts)

      writeFileSync(join(__dirname, "../", "latest.txt"), hosts, "utf-8")

      console.log(`\n✅  Done ${Array.from(this.hosts).length.toLocaleString()} hosts in \`${Date.now() - t}ms\`.`)
      console.log(`✏   Wrote ${Array.from(this.hosts).length.toLocaleString()} hosts (${((encodeURI(hosts).split(/%..|./).length - 1)/1000000).toFixed(1)} MB)`)
    })
  }

  public async init() {
    return new Promise(async (resolve) => {
      for(const list of lists.data) {
        for(const listURL of list.lists) {
          const fileName: string | undefined = listURL.split("/").pop();

          if(this.args && !this.args.send) console.log("⬇  ", fileName == "" ? listURL : fileName)

          const data = await this.run(listURL, fileName)

          if(this.args && !this.args.send) console.log("✅ ", fileName == "" ? listURL : fileName)

          this.hosts.add(`${list.type}:`)

          for(const host of data) {
            this.hosts.add(host)
          }
        }
      }

      resolve(true)
    })
  }

  private run(url: any, fileName: string | undefined) {
    if(!(fileName as string).includes(".")) fileName += ".txt"

    return new Promise((resolve) => {
      axios.get(url).then(res => {
        const data = res.data.split("\n").filter(function (line: any) {
            return line.indexOf('#') != 0;
        }).join("\n").replace(/127.0.0.1/g, "").replace(/0.0.0.0/g, "").replace(/ /g, "").replace(/\r/g, "").replace(/\t/g, "")

        resolve(data.split("\n"))
      })
    })
  }
}//LMao, graviton.ml error