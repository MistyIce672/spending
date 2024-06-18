FROM python

WORKDIR /app

COPY BackEnd/requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "BackEnd/main.py"]
