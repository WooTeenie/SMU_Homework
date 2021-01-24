import datetime as dt
import numpy as np
import pandas as pd
from flask import Flask, jsonify
import json
from sqlHelper import SQLHelper

#######################################################

app = Flask(__name__)

sqlHelper = SQLHelper()

@app.route("/")
def home():
    print("Client requested the home page from the server")
    return("<h1>Welcome to my home page!</h1>"
            "<h2>Below are the path's you can choose from:</h2>"
            "<h3>/api/v1.0/precipitation</h3>"
            "<h3>/api/v1.0/stations</h3>"
            "<h3>/api/v1.0/tobs</h3>"
            "<h3>/api/v1.0/YYYY-MM-DD</h3> - the above is used to pull back a start date"
            "<h3>/api/v1.0/YYYY-MM-DD/YYYY-MM-DD</h3> - the above is used to pull back data between a start date and an end date")

@app.route("/api/v1.0/precipitation")
def get_precipitation():
    data = sqlHelper.get_precipitation()
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1.0/stations")
def get_stations():
    data = sqlHelper.get_stations()
    return jsonify(json.loads(data.to_json(orient="records")))

@app.route("/api/v1.0/tobs")
def get_tobs():
    data = sqlHelper.get_tobs()
    return jsonify(json.loads(data.to_json(orient="records")))

#date must be formatted as such: YYYY-MM-DD
@app.route("/api/v1.0/<start>")
def get_start(start):
    data = sqlHelper.get_start(start)
    return jsonify(json.loads(data.to_json(orient="records")))

#date must be formatted as such: YYYY-MM-DD
@app.route("/api/v1.0/<start>/<end>")
def get_start_end(start, end):
    data = sqlHelper.get_start_end(start, end)
    return jsonify(json.loads(data.to_json(orient="records")))

if __name__ == "__main__":
    app.run(debug=True)