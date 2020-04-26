import * as tar from 'tar'
import * as fs from 'fs'
import * as stream from "stream";
import * as util from 'util';

const pipeline = util.promisify(stream.pipeline)

async function main() {
    const opt: tar.CreateOptions = {
        gzip: true,
    }
    const list: ReadonlyArray<string> = [
        "abc.txt"
    ];

    await pipeline(await tar.c(opt, list), fs.createWriteStream("abc.tar.gz"))
}

main().catch(console.error)
