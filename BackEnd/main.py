from flask import Flask, request, send_from_directory, redirect,make_response
import jwt
import dataLayer
from datetime import datetime, timedelta
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
database = os.getenv("database")
key = os.getenv("key")

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = key

frontend_folder = os.path.join(os.path.dirname(__file__), '..', 'spending')

channel_key = "Z_zhTjo-qB9UXO9MFpUg9z-Apok1Q3CWQ9DpVCS2yy0a1CRsIm6WhZHll4i3XScC"

@app.route('/')
def serve_index():
    return send_from_directory(
        os.path.join(frontend_folder, 'dist'), 'index.html')


@app.route('/assets/<filename>')
def serve_static(filename):
    return send_from_directory(
        os.path.join(frontend_folder, 'dist/assets'), filename)


@app.route('/api/auth')
def redi_auth():
    return (redirect("https://spending.mandadev.com/#/auth?"+str(request.query_string, 'UTF-8')))


@app.route("/ifttt/v1/status")
def get_status():
    if request.headers['IFTTT-Channel-Key'] == channel_key:
        return ({"status": True})
    return "error", 401, {}

@app.route("/ifttt/v1/test/setup",methods=['GET',"POST"])
def ift_setup():
    if request.headers['IFTTT-Channel-Key'] != channel_key:
        return "error", 401, {}
    return({"data":{"access_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImdhdXRoNjcyQGdtYWlsLmNvbSIsInBhc3N3b3JkIjoiamFiYmEiLCJleHBpcmF0aW9uIjoiMjAyMy0xMS0xOCAxMjoyNDowNy41MzQxNTMifQ.GDtzGrv11UdjVC9ZSbkMPop_NP3qj5uGa6VWdriTTRw"}})


@app.route("/ifttt/v1/user/info")
def get_user_info():
    token = request.headers['Authorization'].split(" ")[1]
    user_id = validate_token(token)
    if not user_id:
        return ({"status": False, "error": "invalid otken"})
    account = dataLayer.get_user(user_id)
    if not account:
        return ({"status": False, "error": "invalid user"})
    return ({"data": {"name": account['email'], "id": str(account['_id'])}})


@app.route("/api/token", methods=['POST', "GET"])
def get_token_from_code():
    if request.method == 'GET':
        return ({})
    else:
        code = request.form.get("code")
        user_id = dataLayer.get_uid_from_code(code)
        if not user_id:
            return ({"status": False, "error": "invalid code"})
        account = dataLayer.get_user(user_id)
        if not account:
            return ({"status": False, "error": "invalid user"})
        token = jwt.encode({
            'email': account['email'],
            "password": account['password'],
            'expiration': str(datetime.utcnow() + timedelta(seconds=120))
        }, app.config["SECRET_KEY"], algorithm="HS256")
        return ({"access_token": token, "token_type": "token"})


@app.route('/api/signup', methods=["POST"])
def signup():
    email = request.json['email']
    password = request.json['password']
    newAccount = dataLayer.create_account(email, password)

    if newAccount["status"] == True:
        token = jwt.encode({'email': email, "password": password, 'expiration': str(
            datetime.utcnow() + timedelta(seconds=120))}, app.config["SECRET_KEY"], algorithm="HS256")
        return ({"status": True, "token": token})
    else:
        return ({"status": False, "error": "Email already in use"})


@app.route('/api/auth/code', methods=['POST'])
def get_auth_code():
    if 'Authorization' not in request.headers:
        return ({"status": False, "error": "authorisation is required"})
    user_id = validate_token(request.headers['Authorization'])
    if not user_id:
        return ({"status": False, "error": "invalid otken"})
    code = dataLayer.get_code(user_id)
    return ({"status": True, "code": code})


@app.route('/api/login', methods=["POST"])
def login():
    email = request.json['email']
    password = request.json['password']
    acc = dataLayer.auth(email, password)
    if acc['status'] is True:
        token = jwt.encode({'email': email, "password": password, 'expiration': str(
            datetime.utcnow() + timedelta(seconds=120))}, app.config["SECRET_KEY"], algorithm="HS256")
        return ({"status": True, 'token': token})
    else:
        return ({"status": False, "error": "invalid username or password"})


@app.route('/api/expense/add', methods=["POST"])
def add_expense():
    if 'name' not in request.json:
        return ({"error": "name is required"})
    name = request.json['name']
    if 'amount' not in request.json:
        return ({"error": "amount is required"})
    amount = int(request.json['amount'])
    if 'term' not in request.json:
        return ({"error": "term is required"})
    term = request.json['term']
    if 'occurrence' not in request.json:
        return ({"error": "occurrence is required"})
    occurrence = request.json['occurrence']
    user_id = validate_token(request.headers['Authorization'])
    dataLayer.add_expense(user_id, name, amount, term, occurrence)
    return ({"status": True})

    #


@app.route('/api/income/add', methods=["POST"])
def add_income():
    if 'name' not in request.json:
        return ({"error": "name is required"})
    name = request.json['name']
    if 'amount' not in request.json:
        return ({"error": "amount is required"})
    amount = int(request.json['amount'])
    if 'term' not in request.json:
        return ({"error": "term is required"})
    term = request.json['term']
    if 'occurrence' not in request.json:
        return ({"error": "occurrence is required"})
    occurrence = request.json['occurrence']
    user_id = validate_token(request.headers['Authorization'])
    dataLayer.add_income(user_id, name, amount, term, occurrence)
    return ({"status": True})


@app.route('/api/finance/<term>')
def finance(term):
    if term == 'current':
        term = datetime.today().strftime("%Y-%m")
    if 'Authorization' not in request.headers:
        return ({"status": False, "error": "Authorization is required"})
    user = validate_token(request.headers['Authorization'])
    if user == False:
        return ({"status": False, "error": "invalid token"})
    recurring = dataLayer.get_recurring_items(user)
    term_items = dataLayer.get_term_items(user, term)
    items = []
    for item in recurring:
        item['_id'] = str(item['_id'])
        item['user'] = str(item['user'])
        items.append(item)
    for item in term_items:
        item['_id'] = str(item['_id'])
        item['user'] = str(item['user'])
        items.append(item)
    total = 0
    total_income = 0
    total_expenses = 0
    income = []
    expenses = []
    for item in items:
        if item['direction'] == "income":
            total += item['amount']
            total_income += item['amount']
            income.append(item)
        if item['direction'] == "expense":
            total -= item['amount']
            total_expenses += item['amount']
            expenses.append(item)
    return ({"status": True, "total_income": total_income, 'total_expenses': total_expenses, "total": total, 'income': income, 'expenses': expenses})


@app.route('/api/account')
def account():
    if 'Authorization' not in request.headers:
        return ({"status": False, "error": 'Authorization required in header'})
    token = request.headers['Authorization']
    if token == False:
        return ({"status": False, "error": "invalid token"})
    user = validate_token(token)
    if user == False:
        return ({"status": False, "error": "invalid token"})
    email = dataLayer.get_email(user)
    recurring = dataLayer.get_recurring_items(user)
    items = []
    for item in recurring:
        item['_id'] = str(item['_id'])
        item['user'] = str(item['user'])
        items.append(item)
    return ({"status": True, "items": items, 'email': email})


@app.route("/api/item/<item_id>", methods=['DELETE'])
def delete_item(item_id):
    user = validate_token(request.headers['Authorization'])
    return (dataLayer.delete_item(user, item_id))


def validate_token(token):
    try:
        payload = jwt.decode(
            token, app.config["SECRET_KEY"], algorithms=["HS256"])
        print(payload)
        sc = dataLayer.auth(payload['email'], payload['password'])
        if sc['status'] == True:
            return (sc['_id'])
        else:
            return (False)
    except:
        return (False)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=4111)
