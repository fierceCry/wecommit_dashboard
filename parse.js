//parse.js Parse and Summarize with GPT, Save to DB
require('dotenv').config();

const axios = require('axios');
const cors = require("cors");
const cheerio = require("cheerio");
const express = require("express");
const typeorm = require('typeorm');
const cron = require('node-cron');

const GovermentSupportProject = require('./GovermentSupportProject');
const { dataSource } = require('./ormconfig');
const { ConsoleMessage } = require('puppeteer');

const app = express();

app.use(express.json());
app.use(cors());

// API URL과 서비스 키를 환경 변수에서 가져와 조합
const api_url = `${process.env.API_URL}?serviceKey=${process.env.SERVICE_KEY}`;

// API 요청을 위한 쿼리 매개변수 설정 
const query_params = {
    pageNo: '1',         
    openYn: 'N',
    dataType: 'json',
    serviceKey: process.env.SERVICE_KEY 
};

function getDynamicQueryParams() {
    const today = new Date();

    const formatDate = (date) => {
        const yyyy = date.getFullYear().toString();
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const dd = date.getDate().toString().padStart(2, '0');
        return yyyy + mm + dd;
    };

    return {
        ...query_params,
        startDate: formatDate(today),
        endDate: formatDate(today)
    };
}

// API 요청을 보내어 데이터 가져오기
async function fetchUpdatedItems() {
    const dynamic_query_params = getDynamicQueryParams();
    const initialResponse = await axios.get(api_url, { params: { ...dynamic_query_params, numOfRows: "1" } });
    const totalCount = initialResponse.data.response.body.totalCount;
    if (!totalCount || totalCount === 0) {
        console.log("No updated items found.");
        return;
    }

    const response = await axios.get(api_url, { params: { ...dynamic_query_params, numOfRows: totalCount.toString() } });
    const data = response.data;
    
    axios.get(api_url, { params: dynamic_query_params })
        .then(async response => {
        // API 응답이 성공적인 경우
        if (data.response.header.resultCode=== '00') {
        const business_announcements = data.response.body.items;
        // 검색 결과의 개수 출력
        const totalcount = data.response.body.totalCount;
        console.log(`${totalcount}개 검색완료`);
        // API 응답에서 필요한 데이터만 추출하기
        const announcementArray = business_announcements.map((announcement, idx) => {
        const item = announcement.item;
            return {
                "Item": `Item ${idx + 1}`,
                "title": item.title,
                "postsn": item.postsn,
                "supporttype": item.supporttype,
                "biztitle": item.biztitle,
                "areaname": item.areaname,
                "startdate": item.startdate,
                "enddate": item.enddate,
                "detailurl": item.detailurl,
                "viewcount": item.viewcount,
                "prchCnadrNo": item.prchCnadrNo,
                "organizationname": item.organizationname,
                "posttarget": item.posttarget,
                "posttargetage": item.posttargetage,
                "posttargetcomage": item.posttargetcomage,
                "insertdate": item.insertdate,
                "sprvInstClssCdNm": item.sprvInstClssCdNm,
                "bizPrchDprtNm": item.bizPrchDprtNm,
                "blngGvdpCdNm": "진흥원"
        };
    });
        // 각 아이템에 대한 데이터 처리
        for(const item of announcementArray) {
        const targetUrl = item.detailurl;
        try {
            const { data: detailData } = await axios.get(targetUrl);
            const $ = cheerio.load(detailData);

            const containerText = $(".app_notice_details-wrap").text().replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\s+/g, ' ').trim();
            const summarizedText = await splitAndSummarize(containerText);
            const extractDataFromText = (keyword) => {
            const textAfterKeyword = containerText.split(keyword)[1];
            if (!textAfterKeyword) return null; 
            const singleValue = textAfterKeyword.split(" ")[1]; 
            const chunkValue = textAfterKeyword.split(".")[0] + ".";
            if (keyword.endsWith("(문단기준)")) {
                return chunkValue;
            }
            return singleValue;
        };

        const documentUrls = extractDocumentUrls($);
        const extractedData = {
            agreementStartDate: extractDataFromText("협약 시작 일자"),
            agreementEndDate: extractDataFromText("협약 종료 일자"),
            agreementDuration: extractDataFromText("협약 기간", "지원기간", "입주기간", "입주"),
            selectedCnt: extractDataFromText("선정 회사수"),
            maximumAmt: extractDataFromText("지원자금 최대", "지원한도"),
            averageAmt: extractDataFromText("지원자금 평균"),
            selfFundingRatio: extractDataFromText("자부담금 비율"),
            otherSupportContent: extractDataFromText("기타 지원내용 (문단기준)"),
            additionalPoints: extractDataFromText("가점사항 (문단기준)"),
            documentUrl: JSON.stringify(documentUrls)
        }
        const output = {
            item,
            summarizedText,
            extractedData
        };
        console.log("output:",  output)

        await saveDataFromApi(output);

        } catch(error) {
            console.error("Crawling error:", error);
        }
    }

} else {
    // API 요청 실패 시 에러 메시지 출력
    console.log(`Error: ${data.result_code} - ${data.response.header.resultCode}`);
}
})
.catch(error => {
// 예외 처리: API 요청 중 발생한 에러 핸들링
console.error('An error occurred:', error);
});
}

// 주어진 텍스트를 키워드를 기반으로 분할하고, 각 청크를 요약한 후 결합하여 반환합니다.
const splitAndSummarize = async (text, endChunkIndex = -2) => {
    // 분할에 사용할 키워드 목록
    const keywords = [
        "지원분야",
        '신청방법 및 대상',
        '제외대상',
        '제출서류',
        '선정절차 및 평가방법',
        '지원내용',
        '[붙임1]',
    ];
    // 주어진 텍스트를 키워드로 분할하는 함수
    const splitByKeywords = (text, keywords) => {
        const chunks = [];
        let startIndex = 0;
        let lastKeywordIndex = 0;

        keywords.forEach((keyword, idx) => {
            const keywordIndex = text.indexOf(keyword);
            if (keywordIndex !== -1) {
                if (idx === 0) {
                    chunks.push(text.substring(0, keywordIndex + keyword.length));
                    lastKeywordIndex = keywordIndex + keyword.length;
                } else {
                    chunks.push(text.substring(lastKeywordIndex, keywordIndex));
                    lastKeywordIndex = keywordIndex + keyword.length;
                }
            }
        });

        // 마지막 청크를 추가합니다.
        chunks.push(text.substring(lastKeywordIndex));

        return { chunks };
    }
    // 키워드로 텍스트를 분할
    const { chunks } = splitByKeywords(text, keywords); 
    chunks.forEach((chunk, index) => {
        console.log(`Chunk ${index}:`, chunk);
    });
    let maxChunks = (endChunkIndex === -1) ? chunks.length : endChunkIndex + 1;

    // 각 청크를 요약합니다.
    const summaries = await Promise.all(chunks.slice(0, maxChunks).map(async (chunk, index) => {
        try {
            const summary = await summarize(chunk);
            console.log(summary)
            return { index, summary };
        } catch (error) {
            console.error(`Error summarizing chunk ${index}:`, error);
            return { index, summary: "Error summarizing this chunk." };
        }
    }));
    // 청크 인덱스로 요약 결과를 정렬하고 콘솔에 출력
    summaries.sort((a, b) => a.index - b.index).forEach(item => {
        console.log(`Received response for chunk ${item.index}:`, item.summary);
    });
    // 모든 요약된 청크를 연결하여 반환
    return summaries.map(item => item.summary).join(' '); 
};

//HTML 문서($에 저장된 내용)에서 'a.btn_down' 선택자에 해당하는 모든 링크를 추출합니다.
//1. 실제 URL을 구성합니다. 기본 URL은 'https://www.k-startup.go.kr'입니다.
//2. 해당 링크의 가장 가까운 '.board_file' 요소 안에 있는 '.clear .file_bg' 선택자의 텍스트를 이름으로 사용합니다.
//3. 구성된 URL과 이름을 결과 배열에 저장합니다.

const extractDocumentUrls = $ => {
    const results = [];
    $('a.btn_down').each((index, element) => {
        const link = $(element).attr('href');
        if (link) {
            const constructedUrl = `https://www.k-startup.go.kr${link}`;
            const name = $(element).closest('.board_file').find('.clear .file_bg').eq(index).text().trim();
            results.push({ url: constructedUrl, name: name });
        }
    });
    return results;
};

// GPT API를 사용하여 주어진 텍스트를 요약하는 함수
const summarize = async text => {
    try {
        const response = await axios.post(process.env.OPENAI_API_ENDPOINT, {
            prompt: `다음 내용의 핵심적인 부분을 유지하면서 보내줘: ${text}`,
            max_tokens: 200,
            temperature: 0.2
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            }
        });
        const result = response.data.choices[0].text.trim().replace(/\n/g, " ").replace(/\t/g, " ");
        return result;
    } catch (error) {
        console.error(error.response.data);
        if (error.response.data.type === 'invalid_request_error') {
            throw new Error("The text is too long for the model to process.");
        } else {
            throw new Error("KEY ERROR");
        }
    }
}

const dynamic_query_params = getDynamicQueryParams();
cron.schedule('23 15 * * *', () => fetchUpdatedItems(dynamic_query_params));

fetchUpdatedItems(dynamic_query_params);

//주어진 'output' 데이터를 사용하여 데이터베이스에 정부 지원 프로젝트 정보를 저장합니다.
//1. 데이터베이스에 연결합니다.
//2. 'output' 데이터를 기반으로 새로운 'GovermentSupportProject' 엔터티를 생성합니다.
//3. 생성된 엔터티를 데이터베이스에 저장합니다.
//4. 저장이 성공하면 성공 메시지를 콘솔에 출력하고, 실패하면 오류 메시지를 콘솔에 출력합니다.
//5. 마지막으로 데이터베이스 연결을 종료합니다.
async function saveDataFromApi(output) {
    // DB 연결
    const connection = await dataSource.connect();
        try{
            // DB 저장할 때 사용할 entity 생성
            const newproject = new GovermentSupportProject(
                output.item.title,
                output.item.supporttype,
                output.item.biztitle,
                parseInt(output.item.viewcount),
                output.item.detailurl,
                parseInt(output.item.postsn),
                output.item.posttarget,
                output.item.posttargetage,
                output.item.posttargetcomage,
                output.item.startdate,
                output.item.enddate,
                output.item.insertdate,
                output.item.blngGvdpCdNm,
                output.item.prchCnadrNo,
                output.item.areaname,
                output.item.sprvInstClssCdNm,
                "진흥원",
                output.item.organizationname,
                output.extractedData.agreementStartDate,
                output.extractedData.agreementEndDate,
                output.extractedData.agreementDuration,
                output.extractedData.selectedCnt,
                output.extractedData.maximumAmt,
                output.extractedData.averageAmt,
                output.extractedData.selfFundingRatio,
                output.extractedData.otherSupportContent,
                output.extractedData.additionalPoints,
                output.extractedData.documentUrl
            );

            await dataSource.manager.save(newproject);
            console.log("Data saved successfully!");
        } catch (error) {
            console.error("Error saving data:", error);
        } finally {
            // 연결 종료
            await connection.close();
        }
    };