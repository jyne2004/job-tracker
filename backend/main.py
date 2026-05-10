from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from your Job Tracker API!"}

@app.get("/ping")
def ping():
    return {"status": "pong"}