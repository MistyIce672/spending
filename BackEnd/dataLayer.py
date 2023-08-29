from dotenv import load_dotenv
import os
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId

load_dotenv()
database = os.getenv("database")
cluster = MongoClient(database)

db = cluster['saver']
accounts = db['accounts']
items = db['items']

def create_account(email,password):
    account = accounts.find_one({"email":email})
    if account != None:
        return({"status":False,"error":"email_in_use"})
    accounts.insert_one({"email":email,"password":password})
    return({"status":True})
    
def auth(email,password):
    account = accounts.find_one({"email":email})
    if account == None:
        return({"status":False,"error":"account_not_found"})
    else:
        if account['password'] == password:
            return({"status":True,"_id":account['_id']})
        return({"status":False,"error":"incorrect_password"})

def get_email(user_id):
    user = accounts.find_one({'_id':user_id})
    return(user['email'])

def add_expense(user_id,name,amount,term,occurrence):
    items.insert_one({"user":user_id,'name':name,"amount":amount,"term":term,"direction":"expense","occurrence":occurrence})

def add_income(user_id,name,amount,term,occurrence ):
    items.insert_one({"user":user_id,'name':name,"amount":amount,"term":term,"direction":"income","occurrence":occurrence})

def get_term_items(user_id,term):
    query = items.find({"user":user_id,'term':term})
    new_items = []
    if query == None:
        return({})
    for item in query:
        new_items.append(item)
    return(new_items)

def get_recurring_items(user_id):
    query = items.find({"user":user_id,'occurrence':'recurring'})
    new_items = []
    if query == None:
        return({})
    for item in query:
        new_items.append(item)
    return(new_items)

def delete_item(user,item_id):
    item = items.find_one({"_id":ObjectId(item_id)})
    if item['user'] == user:
        items.delete_one({"_id":ObjectId(item_id)})
        return({"status":True})
    else:
        return({"status":False,"error":"invalid id"})