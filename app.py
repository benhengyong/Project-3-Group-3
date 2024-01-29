# import necessary libraries
# from models import create_classes
import os
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, or_, inspect, text
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
import pandas as pd
import pickle

from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)




engine = create_engine("sqlite:///covid.db")


# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)



# Save reference to the table
country = Base.classes.country


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

# Web site
@app.route("/")
def data():

    return render_template("index.html")


#geomap that shows total cases worldwide
@app.route("/api/geomap")
def for_map():

    session = Session(engine)
    
    results = session.query(country.Country, country.State, country.Lat, country.Long,
                           country.Confirmed, country.Deaths, country.Recovered, country.Active).filter(country.Date == "2020-07-27").all()
    
    results = [list(r) for r in results]

    countryResults = [result[0] for result in results]
    state = [result[1] for result in results]
    lat = [result[2] for result in results]
    long = [result[3] for result in results]
    confirmed = [result[4] for result in results]
    deaths = [result[5] for result in results]
    recovered = [result[6] for result in results]


    map_results = {
        "country": countryResults,
        "state": state,
        "lat": lat,
        "long": long,
        "confirmed": confirmed,
        "deaths": deaths,
        "recovered": recovered
    }

    session.close()

    return jsonify(map_results)



#bubble chart that shows cases within WHO Region

@app.route("/api/bubble/<region>")
def forlinechart(region):

    session = Session(engine)
    
    results = session.query(country.Country, country.State, country.Date,
        country.Confirmed, country.Deaths, country.Recovered, country.Active, country.WHORegion).filter(country.Date == "2020-07-27").filter(country.WHORegion==region).all()
    
    results = [list(r) for r in results]
    
    countryResults = [result[0] for result in results]
    state = [result[1] for result in results]
    confirmed = [result[3] for result in results]
    deaths = [result[4] for result in results]
    recovered = [result[5] for result in results]


    bubble_results = {
        "country": countryResults,
        "state": state,
        "confirmed": confirmed,
        "deaths": deaths,
        "recovered": recovered
    }

    session.close()

    return jsonify(bubble_results)



#barchart that shows cases within 1 country ie Australia and cases within each state
@app.route("/api/bar/<region>")
def countrys(region):
    
    session = Session(engine)
    
    results = session.query(country.Country, country.State, country.Date,
        country.Confirmed, country.Deaths, country.Recovered, country.Active).filter(country.Country==region).filter(country.Date.like("%27")).all()
    
    results = [list(r) for r in results]

    countryResults = [result[0] for result in results]
    state = [result[1] for result in results]
    date = [result[2] for result in results]
    confirmed = [result[3] for result in results]
    deaths = [result[4] for result in results]
    recovered = [result[5] for result in results]


    bar_results = {
        "country": countryResults,
        "state": state,
        "date": date,
        "confirmed": confirmed,
        "deaths": deaths,
        "recovered": recovered
    }

    session.close()

    return jsonify(bar_results)

@app.route("/api/countrylist" , methods=['GET'])
def countrylist():
    session = Session(engine)
    results = session.query(country.Country.distinct().label("country")).all()
    results = [list(r) for r in results]
    countryName = [result[0] for result in results]
    countrylist = {"country": countryName }
    session.close()
    return jsonify(countrylist)


if __name__ == "__main__":
    app.run(debug=True)


