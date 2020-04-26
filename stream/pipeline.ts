import * as stream from 'stream';
import * as util from 'util';
import * as fs from 'fs';

const pipeline = util.promisify(stream.pipeline);

async function main() {
    const source = stream.Readable.from(async function* (source: AsyncIterable<Buffer>) {
        for await (const chunk of source) {
            yield String(chunk).toUpperCase()
        }
    }(fs.createReadStream('lowercase.txt')))

    const target = fs.createWriteStream('uppercase.txt')

    await pipeline(source, target)

    console.log('Pipeline succeeded.')
}

main().catch(console.error)
