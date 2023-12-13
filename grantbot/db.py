able_info = { "신청 주관기관명": "기업성장센터", "과제번호": "(사업신청내역조회) 12345678", "신청 분야 (택 1)": "일반", "사업 분야 (택 1)": "이것저것사업", "기술 분야 (택 1)": "숑숑기술", "사업비 구성계획": { "정부 지원금": "50백만원", "주요성과 (직전년도)": "고용", "성과 목표 (협약기간)": { "고용": "5명", "매출": "-", "투자": "50백만원" } } }

submission_name: str = "" #지원과제(지원사업)명 
submission_id: str = "" 

# 과제번호 
submission_type: str = ""

# 신청분야
business_type: str = "" 

# 사업분야
tech_type: str = "" 

# 기술분야 
submission_date: Union[str, datetime] = ""

item_name: str = "" 
submission_organization: str = "" 

# 주관기관 
aid_start: Union[str, datetime] = ""

#협약기간 시작 년월일 or 년월 
aid_end: Union[str, datetime] = "" 
#협약기간 끝 
budget: Dict = {} # budget info, include details as key-value pairs 
desc: str = "" # other info in natural language""", "Person": """class 