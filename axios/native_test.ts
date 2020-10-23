import * as  Mime from 'mime';
import * as  FD from 'form-data';
import * as  http from 'https';
import * as  fs from 'fs'

const cookie = 'uctoken=\\"ChFhZC51Yy5sb2dpbi50b2tlbhKAAcrG9YJn9CtJpPmMmHb+WWtdRJ8UO/B7g+ty1D2d0mujnV5MY3eEJT1qX6xzt4xusjxwFRSFudIUvN15+o7b1x2TeCL/Rj3TsSZpTZc7ggOtev+UQ1yodK7pPX+Jrfl2b4A3L8YxqnfcecqIOG+ERUbmWsVOLX3btwzuAMxva32jGhKxnHuNtycbpnJQCjTcRA3Mlt4iIFJyqxgPe+QKYEGK4X4MIPuzWysZNDp1fT05FXnnR340KAUwAQ==\\";kuaishou.ad.dsp_st=ChJrdWFpc2hvdS5hZC5kc3Auc3QSkAETZKxhCGpgOcLg6JPrVUr-p4C0aFbzRpemORFELE0B8P_dxeIN8MqBM5RnnI9AF2Gg8eNdZLej2koU7v_SaKdCT5syAeyyF4msRp2V0jHf6AuqsHfOUcF7lJhGWpewusTSIHKa_z45bOJbROfBFstosf5uXz9HGmOX1t6GnRCsPhuN0P8l-lrWNMzQKgnKRC0aEqfdhCl1EErtp2A41CJYknIJBCIgpalRjhbsngswdz4jzc8qEqa1WytFlieYOfVFOmQWNTQoBTAB;kuaishou.ad.dsp_ph=f9cda8cd4bcfe2f583703431ad09eefb524c;userId=1529772559;didv=1589254850670;did=web_75a5432592e5d39833c77c5549ca1fa2;';
const formData = new FD();
let st;
const path = '/Users/l/Desktop/1.txt';
if (fs.existsSync(path)) {
    st = fs.createReadStream(path);
}
console.log(fs.statSync(path));

formData.append('populationFile', st);
formData.append('type', '3');
formData.append('orientationName', "Final");

const ph = {
    value: "f9cda8cd4bcfe2f583703431ad09eefb524c"
}
var request = http.request({
    method:  'post',
    host:    'dmp.e.kuaishou.com',
    path:    `/rest/dsp/tool/population/upload?kuaishou.ad.dsp_ph=${ph.value}`,
    headers: {
        ...formData.getHeaders()
        , cookie
    }
});

request.setTimeout(10 * 60e3);

formData.pipe(request);

request.on('response', function (res) {
    const ret = [];
    res.on('data', function (body) {
        try {
            ret.push(body);
        } catch (e) {
            console.log(e)
        }
    });

    res.on('end', function () {
        try {
            let result = JSON.parse(Buffer.concat(ret).toString());
            console.log(result);

        } catch (e) {
            console.log(e)
        }
    });
});

request.on('error', (err) => {
    console.log('error: ', err);
});
