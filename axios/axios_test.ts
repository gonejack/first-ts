import Axios from 'axios'
import * as  fs from 'fs'
import * as  FormData from 'form-data'

const data = new FormData()

data.append('data', fs.createReadStream("bigdata.data"));

async function test() {
    // memory overflow at below call
    await Axios.request({
        url:              "http://localhost:1234/post",
        method:           "POST",
        headers:          {
            ...data.getHeaders(),
        },
        maxContentLength: 1024 * 1024 * 1024,
        data:             data,
    })
}

test().catch(console.error);
