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
    
    results = session.query(country.Country, country.State, country.Lat, country.Long, country.Date,
                           country.Confirmed, country.Deaths, country.Recovered, country.Active).all()
    
    results = [list(r) for r in results]

    map_results = {
        "cases": results
    }

    session.close()

    return jsonify(map_results)



#bubble chart that shows cases within WHO Region

@app.route("/api/bubble/<region>")
def for_linechart(region):

    session = Session(engine)
    
    results = session.query(country.Country, country.State, country.Date,
                           country.Confirmed, country.Deaths, country.Recovered, country.Active, country.WHORegion).filter(country.WHORegion==region).all()
    
    results = [list(r) for r in results]
    
    bubble_results = {
        "cases": results
    }

    session.close()

    return jsonify(bubble_results)



#barchart that shows cases within 1 country ie Australia and cases within each state
@app.route("/api/bar/<region>")
def countrys(region):
    
    session = Session(engine)
    
    results = session.query(country.Country, country.State, country.Date,
                           country.Confirmed, country.Deaths, country.Recovered, country.Active).filter(country.Country==region).all()
    
    results = [list(r) for r in results]

    country_results = {
        "table": results
    }

    session.close()

    return jsonify(country_results)




if __name__ == "__main__":
    app.run()


