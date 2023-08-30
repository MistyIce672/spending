from flask import Flask,request,render_template
import jwt
import dataLayer
from datetime import datetime,timedelta
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()
database = os.getenv("database")
key = os.getenv("key")

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = key

@app.route('/')
def home():
    return(render_template("index.html"))

@app.route('/api/signup',methods = ["POST"])
def signup():
    if request.method == "POST":
        email = request.json['email']
        password = request.json['password']
        newAccount = dataLayer.create_account(email,password)

        if newAccount["status"] == True:
            token = jwt.encode({'email': email,"password":password, 'expiration' : str(datetime.utcnow() + timedelta (seconds = 120))}, app.config["SECRET_KEY"],algorithm="HS256")
            return ({"status":True,"token": token})
        else:
            return ({"status":False,"error" : "Email already in use"})
        
@app.route('/api/login',methods = ["POST"])
def login():
    if request.method == "POST":
        email = request.json['email']
        password = request.json['password']
        acc = dataLayer.auth(email,password)
        if acc['status'] is True:
            token = jwt.encode({'email': email,"password":password, 'expiration' : str(datetime.utcnow() +  timedelta (seconds=120)) }, app.config["SECRET_KEY"],algorithm="HS256")
            return ({"status":True,'token': token})
        else:
            return ({"status":False,"error":"invalid username or password"})

@app.route('/api/expense/add',methods = ["POST"])
def add_expense():
    if 'name' not in request.json:
        return({"error":"name is required"})
    name = request.json['name']
    if 'amount' not in request.json:
        return({"error":"amount is required"})
    amount = int(request.json['amount'])
    if 'term' not in request.json:
        return({"error":"term is required"})
    term = request.json['term']
    if 'occurrence' not in request.json:
        return({"error":"occurrence is required"})
    occurrence = request.json['occurrence']
    user_id = validate_token(request.headers['Authorization'])
    dataLayer.add_expense(user_id,name,amount,term,occurrence)
    return({"status":True})
    
    #
    
@app.route('/api/income/add',methods = ["POST"])
def add_income():
    if 'name' not in request.json:
        return({"error":"name is required"})
    name = request.json['name']
    if 'amount' not in request.json:
        return({"error":"amount is required"})
    amount = int(request.json['amount'])
    if 'term' not in request.json:
        return({"error":"term is required"})
    term = request.json['term']
    if 'occurrence' not in request.json:
        return({"error":"occurrence is required"})
    occurrence = request.json['occurrence']
    user_id = validate_token(request.headers['Authorization'])
    dataLayer.add_income(user_id,name,amount,term,occurrence)
    return({"status":True})

@app.route('/api/finance/<term>')
def finance(term):
    if term == 'current':
        term = datetime.today().strftime("%Y-%m")
    if 'Authorization' not in request.headers:
        return({"status":False,"error":"Authorization is required"})
    user = validate_token(request.headers['Authorization'])
    if user == False:
        return({"status":False,"error":"invalid token"})
    recurring = dataLayer.get_recurring_items(user)
    term_items = dataLayer.get_term_items(user,term)
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
    return({"status":True,"total_income":total_income,'total_expenses':total_expenses,"total":total,'income':income,'expenses':expenses})

@app.route('/api/account')
def account():
    if 'Authorization' not in request.headers:
        return({"status":False,"error":'Authorization required in header'})
    token = request.headers['Authorization']
    if token == False:
        return({"status":False,"error":"invalid token"})
    user = validate_token(token)
    if user == False:
        return({"status":False,"error":"invalid token"})
    email = dataLayer.get_email(user)
    recurring = dataLayer.get_recurring_items(user)
    items = []
    for item in recurring:
        item['_id'] = str(item['_id'])
        item['user'] = str(item['user'])
        items.append(item)
    return({"status":True,"items":items,'email':email})

@app.route("/api/item/<item_id>",methods=['DELETE'])
def delete_item(item_id):
    user = validate_token(request.headers['Authorization'])
    return(dataLayer.delete_item(user,item_id))

    


def validate_token(token):
    try:
        payload = jwt.decode(token,app.config["SECRET_KEY"],algorithms=["HS256"])
        print(payload)
        sc = dataLayer.auth(payload['email'],payload['password'])
        if sc['status'] == True:
            return(sc['_id'])
        else:
            return(False)
    except:
        return(False)


if __name__ == "__main__":
    app.run(host='0.0.0.0',port=3000)