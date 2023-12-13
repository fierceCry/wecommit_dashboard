//alert.js DB+User recommendation to alert with Solapi KaKao Integration
require("dotenv").config();
const kstartup_key = process.env.KSTARTUP_API_KEY;
const solapi_key = process.env.KSTARTUP_API_KEY;
const axios = require("axios");
var crypto = require("crypto");
const express = require("express");
const GovernmentSupportProject = require("./GovermentSupportProject");
const { dataSource } = require("./ormconfig");
const { connectToDatabase } = require("./index");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());

app.listen(PORT, async () => {
  console.log(`Listening to request on port: ${PORT}`);
});

app.get("/summerize-data-info", async (req, res) => {
  const { businessType, businessExperience, ageOfRepresentative, location } = req.query;
  console.log(req.query);
  async function dataOfCategory(businessType, businessExperience, ageOfRepresentative, location) {
    try {
      const connetcion = await connectToDatabase();
      console.log("Connected to the Database!");
      try {
        const projectRepository = connetcion.getRepository(GovernmentSupportProject);
        // console.log(projectRepository)
        const projectData = await projectRepository
          .createQueryBuilder("gsp")
          .where(businessType ? "gsp.posttarget = :inputposttarget" : "1=1", {
            inputposttarget: businessType,
          })
          .andWhere(businessExperience ? "gsp.posttargetcomage = :inputposttargetcomage" : "1=1", {
            inputposttargetcomage: businessExperience,
          })
          .andWhere(ageOfRepresentative ? "gsp.posttargetage = :inputposttargetage" : "1=1", {
            inputposttargetage: ageOfRepresentative,
          })
          .andWhere(location ? "gsp.areaname = :inputareaname" : "1=1", { inputareaname: location })
          .andWhere("gsp.enddate >= CURRENT_DATE()")
          .orderBy("gsp.maximum_amt", "DESC") // 최대 지원금 내림차순
          .getMany();
        console.log(projectData);
        await connetcion.close();
        return projectData;
      } catch (error) {
        console.error("Database query error:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error during Data Source initialized", error);
    }
  }

  try {
    const result = await dataOfCategory(
      businessType,
      businessExperience,
      ageOfRepresentative,
      location
    );
    console.log(result);
    res.json({ data: result });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

axios
  .get("Notice_ENDPOINT", {
    message: result,
  })
  .then((response) => {
    console.log("알림톡 전송 완료");
  })
  .catch((error) => {
    console.error("알림톡 전송 실패");
  });

//API 사용 시 인증을 위해 헤더에 포함될 인증정보를 생성
var now = new Date().toISOString();
// 16진수 64자의 랜덤 값 생성
var genRanHex = (size) =>
  [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("");
var salt = genRanHex(64);
var message = now + salt;
var apiKey = "NCS3MBEEC5MDREY8";
var apiSecret = "HSTPOVEMR7MXZUXQ2CQVXBJ2ZPM8ILIS";
var signature = crypto.createHmac("sha256", apiSecret).update(message).digest("hex");

// 생성한 시그니처를 사용하여 API 호출
var uri = `https://api.solapi.com/messages/v4/list?limit=1`;
axios
  .get(uri, {
    headers: {
      Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${now}, salt=${salt}, signature=${signature}`,
    },
  })
  .then((res) => {
    console.log(res.data);
  })
  .catch((error) => {
    console.log(error.response.data);
  });

//TODO Solapi Integration
const { SolapiMessageService } = require("solapi");
const messageService = new SolapiMessageService(
  "NCS3MBEEC5MDREY8",
  "HSTPOVEMR7MXZUXQ2CQVXBJ2ZPM8ILIS"
);

messageService.getKakaoAlimtalkTemplateCategories().then((res) => {
  for (const category of res) {
    console.log(category.code);
    console.log(category.name);
  }
});

messageService
  .createKakaoAlimtalkTemplate({
    version: "2.0",
    template: {
      outputs: [
        {
          carousel: {
            type: "itemCard",
            items: [
              {
                imageTitle: {
                  title: "",
                  maximum_amt: "",
                },
                title: "",
                description: "",
                thumbnail: {
                  imageUrl: "",
                  width: 800,
                  height: 800,
                },
                profile: {
                  profileTitle: "회사명",
                },
                itemList: [
                  {
                    title: "접수 종료 일자",
                    enddate: "",
                  },
                  {
                    title: "지원내용",
                    other_support_content: "",
                  },
                  {
                    title: "가점사항",
                    additional_pointst: "",
                  },
                  {
                    title: "조회수",
                    viewcount: "",
                  },
                  {
                    title: "연락처",
                    prchCnadrNo: "",
                  },
                  {
                    title: "접수 종료 일자",
                    enddate: "",
                  },
                  {
                    title: "협약기간",
                    agreement_duration: "",
                  },
                  {
                    title: "선정회사수",
                    selected_cnt: "",
                  },
                ],
                itemListAlignment: "right",
                buttons: [
                  {
                    label: "추가정보",
                    action: "webLink",
                    webLinkUrl: "",
                  },
                ],
                buttonLayout: "vertical",
              },
            ],
          },
        },
      ],
      quickReplies: [
        {
          label: "goMain",
          action: "message",
          messageText: "goMain",
        },
      ],
    },
  })
  .then((res) => {
    console.log(res);
  });

// 알림톡 전송
messageService.send({
  to: prchCnadrNo,
  from: "계정에서 등록한 발신번호 입력",
  text: "2,000byte 이내의 메시지 입력",
  kakaoOptions: {
    pfId: "연동한 비즈니스 채널의 pfId",
    // 버튼은 최대 5개까지 삽입하실 수 있습니다.
    buttons: [
      {
        buttonType: "WL", // 웹링크
        buttonName: "버튼 이름",
        linkMo: "https://m.example.com",
        linkPc: "https://example.com", // 생략 가능
      },
      {
        buttonType: "AL", // 앱링크
        buttonName: "실행 버튼",
        linkAnd: "examplescheme://",
        linkIos: "examplescheme://",
      },
      {
        buttonType: "BK", // 봇키워드(챗봇에게 키워드를 전달합니다. 버튼이름의 키워드가 그대로 전달됩니다.)
        buttonName: "봇키워드",
      },
      {
        buttonType: "MD", // 상담요청하기 (상담요청하기 버튼을 누르면 메시지 내용이 상담원에게 그대로 전달됩니다.)
        buttonName: "상담요청하기",
      },
      {
        buttonType: "BC", // 상담톡으로 전환합니다 (상담톡 서비스 사용 시 가능)
        buttonName: "상담톡 전환",
      },
      /*{
        "buttonType": "BT", // 챗봇 운영시 챗봇 문의로 전환할 수 있습니다.
        "buttonName": "챗봇 문의"
      }*/
    ],
  },
});

// TODO carousel card decoration
const data = {
  version: "2.0",
  template: {
    outputs: [
      {
        simpleText: {
          text: "테스트",
        },
      },
    ],
    quickReplies: [
      {
        label: goMain,
        action: "message",
        messageText: goMain,
      },
    ],
  },
};

axios
  .post("SOLAPI_ENDPOINT", {
    userId: "사용자ID",
    message: data,
  })
  .then((response) => {
    console.log("알림톡 전송 완료");
  })
  .catch((error) => {
    console.error("알림톡 전송 실패");
  });
