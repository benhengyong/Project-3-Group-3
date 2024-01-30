# Project-3-Group-3

Contains Covid database and files to display this covid database visualing on an html.
The CSV files are lcoated within the data folder.
CovidData.ipynb takes the csv files, edit column names and joins together and loads it into an sql database 'covid.db'

App.py takes the sql database and uses sqlalchemy adn Flask to create api links that returns JSON formatted version of the sql data, with added filters for each different api.

To run the html, open VSS code and use command 'python app.py'

Note: some tile layers for the leaflet geomap may not run on different computers, if the geomap does not run you may change the tilelayer used in the app.js.
