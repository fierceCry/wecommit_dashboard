import os
from dotenv import load_dotenv
import requests

# # Load the environment variables from the .env file
load_dotenv()

# # Access the secret token key using the os.environ dictionary
service_key = os.environ.get('SERVICE_KEY')

# Set the query parameters
query_params = {
    'serviceKey': service_key,
    'pageNo': '1',           # Page number you want to retrieve
    'numOfRows': '5',       # Number of rows per page
    'startDate': '20230802', # Start date for the announcement list (replace with your desired date)
    'endDate': '20230802',   # End date for the announcement list (replace with your desired date)
    'openYn': 'Y',           # Only retrieve open projects
    'dataType' :'json',
}

# API endpoint URL
api_url = 'http://apis.data.go.kr/B552735/k-startup/kisedGWAPI/getAnnouncementList'

try:
    # Make the API request
    response = requests.get(api_url, params=query_params)

    # Check if the request was successful (status code 200)
    if response.status_code == 200:
        # Parse the JSON response
        #print(response.text)

        data = response.json()
        #print(data)

        

        result_code = data["response"]["header"]["resultCode"]

        # Check if the result code is successful
        if result_code == "00":
            # Access the list of business announcements
            business_announcements = data["response"]["body"]["items"]
            totalcount = data["response"]["body"]["totalCount"]

            print(totalcount,"개 검색완료")
            for idx, announcement  in enumerate(business_announcements[:5]):
              item = announcement['item']
              print(f"Item {idx + 1}:")

              print("  - 공고제목:", item["title"])
              print("    지원유형:", item["supporttype"])
              print("    상세공고제목:", item["biztitle"])
              print("    지역:", item["areaname"])
              print("    Start Date:", item["startdate"])
              print("    End Date:", item["enddate"])
              print("    신청링크:", item["detailurl"])
              print("    View Count:", item["viewcount"])
              print("    PRCH CNADR No:", item["prchCnadrNo"])
              print("    지원기관:", item["organizationname"])
              print("    Post Target:", item["posttarget"]) # 대학생,일반인,일반기업,1인 창조기업
              print("    Post Target Age:", item["posttargetage"]) #만 20세 미만,만 20세 이상 ~ 만 39세 이하,만 40세 이상
              print("    Post Target Com Age:", item["posttargetcomage"]) # 예비창업자,7년미만
              print("    Insert Date:", item["insertdate"])
              print("    Supervising Institution Class Code Name:", item["sprvInstClssCdNm"]) #공공기관
              print("    Business Purchase Department Name:", item["bizPrchDprtNm"]) #남부권역센터
              print("    Belonging Gvdp Code Name:", item["blngGvdpCdNm"]) #경기도청
                # Add more details as needed
        else:
            print(f"Error: {result_code} - {data['response']['header']['resultCode']}")
    else:
        print(f"Error: {response.status_code} - {response.text}")
except requests.exceptions.RequestException as e:
    print(f"An error occurred: {e, repr(e)}")