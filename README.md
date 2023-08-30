
# Expense Tracker 

Spending is a simple expense tracker that is packaged with a api to improve it accessabilty,
allthough it currently uses a react web front end 
a mobile app might arive soon 

## live demo 

https://spending.mistyice.tk/




## More info 

Spending uses a react frontend and a flask backend for its api 

[postman-api](https://www.postman.com/grey-satellite-571466/workspace/spending/collection/29253713-33ae58a3-724f-420d-a55f-8b696fd06d88?action=share&creator=25446603)
## Setup

To run the prebuilt config with python

```bach
  cd Backend
  pip install -r .\requirements.txt
  python main.py
```
To run the prebuilt config with Docker

```bach
  cd Backend
  docker build -t spending .
  docker run -d -p 5000:5000 spending
```
