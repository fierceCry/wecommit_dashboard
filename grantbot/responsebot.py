from flask import Flask, request, jsonify

application = Flask(__name__)

@application.route("/")
def hello():
    return "Hello world!"


#카카오 response봇 
@application.route("/register",methods=['POST'])
def register():
    req = request.get_json()
    
    raw = req["action"]["detailParams"]
    name = raw["name"]["value"]	# 카카오톡에서 전달되는 파라미터 ex) name 

##TODO generate answer
    answer = answer
    
    # 답변 텍스트 설정
    res = {
        "version": "2.0",
        "template": {
            "outputs": [
                {
                    "simpleText": {
                        "text": answer
                    }
                }
            ]
        }
    }

    # 답변 전송
    return jsonify(res)



if __name__ == "__main__":
    application.run(host='0.0.0.0', port=5000, threaded=True)