import * as TurndownService from 'turndown';

const text = `
<html>
<head></head>
<body>
<div style="margin-top: 1em; margin-bottom: 1em;-en-paragraph:true;">
    <div style="padding-bottom: 10px;">
        <a shape="rect"
           href="https://www.bigboobsjapan.com/2021/01/03/han-ga-eun-%E9%9F%A9%E4%BD%B3%E6%81%A9/bbj-001-2318/"><img
                width="853" height="1280" alt="Han Ga Eun 韩佳恩" hash="5e205a55700e98644d01fba65be44c7b"
                type="image/jpeg"/>
        </a><a href="https://www.solidot.org/story?sid=66765" target="null"
               style="font-size: 1em;"></a>
        <div style="font-size: 1em;"><a href="https://www.solidot.org/story?sid=66765" target="null"
                                        style="font-size: 1em;"></a><a href="https://www.solidot.org/story?sid=66765"
                                                                       style="color: rgb(102, 102, 102); font-weight: normal; text-decoration: none;">Solidot</a>
        </div>
        <div><a href="https://www.solidot.org/story?sid=66765"
                style="color: rgb(0, 0, 0); font-weight: normal; text-decoration: none;"> </a><a
                href="https://www.solidot.org/story?sid=66765"
                style="color: rgb(0, 0, 0); font-size: 1.5em; font-weight: normal; text-decoration: none;">北京计划 5
            年内基本消除重污染天气</a><a href="https://www.solidot.org/story?sid=66765"
                              style="color: rgb(0, 0, 0); font-weight: normal; text-decoration: none;"> </a></div>
    </div>
</div>
<div>北京市公布的最新纲要草案计划 5 年内<a shape="rect" href="http://news.sciencenet.cn/htmlnews/2021/1/452409.shtm">基本消除重污染天气</a>。据了解，2020
    年，北京市 PM2.5 年均浓度首次实现“30+”，创下了自 2013 年监测以来的最低值。2013
    年前后北京的严重污染状况引发了广泛关注，促使政府采取了关闭污染工厂限制汽车出行等治理措施。在最新的计划中，北京将大力推动汽车改用纯电动或氢燃料电池，加强充换电基础设施和加氢站建设。报道称，“大气污染治理无法局限在某一座城市。今后 5
    年，北京将强化区域大气污染联防联控，坚持统一标准、统一检测，强化联合执法、应急联动，积极争取国家开展区域生态环境污染防治立法，推动国家逐步统一治理政策和标准体系。”
</div>
<div><br clear="none"/></div>
<div><a shape="rect"
        style="display: inline-block; border-top-width: 1px; border-top-style: solid; border-top-color: rgb(204, 204, 204); padding-top: 5px; color: rgb(102, 102, 102); text-decoration: none;"
        href="https://www.solidot.org/story?sid=66765">https://www.solidot.org/story?sid=66765</a></div>
<div style="margin-top: 1em; margin-bottom: 1em;-en-paragraph:true;"><span
        style="color: rgb(153, 153, 153);">Sent with </span><a shape="rect" href="http://reederapp.com/"
                                                               style="color: rgb(102, 102, 102); font-weight: bold; text-decoration: none;">Reeder</a>
</div>
</body>
</html>
`

async function main() {
    const markdown = new TurndownService().turndown(text)

    console.log(markdown)
}

main()
