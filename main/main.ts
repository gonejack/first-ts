import * as http from "http";
import * as https from "https";
import {hostname} from "os";
import * as path from "path";
import * as url from "url";

const proxy = url.parse(process.env['http_proxy']);

async function main() {
    const request = (uri: string, timeout: number = 1e3): Promise<http.IncomingMessage> => {
        return new Promise<http.IncomingMessage>((resolve, reject) => {
            const request = http.request({
                method: 'GET',
                host:    proxy.hostname,
                port:    proxy.port,
                path:    uri,
                headers: {
                    'Host':  url.parse(uri).hostname,
                    'Proxy-Connection': 'Keep-Alive'
                }
            }, resp => resolve(resp))
            {
                request.setTimeout(timeout);
                request.once('error', e => {
                    console.error('error')
                    reject(e)
                })
                request.once('timeout', e => {
                    console.error('timeout')
                    request.destroy();
                    reject(e)
                });
                request.end();
            }
        })
    }

    try {
        const resp = await request("https://www.qq.com", 2e3);
        {
            resp.setTimeout(3e3, resp.destroy)
            resp.on('error', console.log);
            resp.on('data', chunk => console.log('data'))
            resp.on('close', () => console.log('close'))
            resp.on('end', () => console.log("end"))
        }
    } catch (e) {
        console.error(e)
    }
}

main();
