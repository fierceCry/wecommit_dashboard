require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "Hello World!" });
});

//app.js response from Kakao request
app.get("/keyboard", (req, res) => {
  const data = { type: "text" };
  res.json(data);
});

app.post("/message", (req, res) => {
  //TODO parse user value
  // const question = req.body.userRequest.utterance;
  //TODO carousel card decoration
  const data = {
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
          label: goMain,
          action: "message",
          messageText: goMain,
        },
      ],
    },
  };

  res.json(data);
});

/*
// TODO alert와 parse를 주기적으로 실행하기 위한  타이머 설정 혹은 별도 스케줄러 설정 
  const intervalInMilliseconds = 24 * 60 * 60 * 1000; // 24시간
  setInterval(() => {
    extractAndSaveData();
  }, intervalInMilliseconds);
  
  // TODO 초기 실행
*/
app.listen(PORT, async () => {
  console.log(`Listening to request on port: ${PORT}`);
});
