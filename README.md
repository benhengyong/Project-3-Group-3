# Project-3-Group-3
**Overview:**
Analysis on the Covid distribution across the world during the time of 22nd January 2020 to 27th July 2020.

**Purpose:**
Analyse Covid cases data on different countries with the aim to identify trends how geoloogical distances affected covid spread, as well as which regions and countries were most affected during the sepcific timeframe.

**Ethical considerations:**
Ethical Considerations for this project were copying of the provided dataset and its further analysis and utilisation of the dataset. Issues of owner acknowledgement, proper data manipulation and justifiable data visualisation adn usage were discussed before the creation of the project.

**Data Source:**
COVID-19 Dataset by DEVAKUMAR K. P
https://www.kaggle.com/datasets/imdevskp/corona-virus-report?resource=download


Contains Covid database and files to display this covid database visualising on an html.
The CSV files are lcoated within the data folder.
CovidData.ipynb takes the csv files, edit column names and joins together and loads it into an sql database 'covid.db'

App.py takes the sql database and uses sqlalchemy and Flask to create api links that returns JSON formatted version of the sql data, with added filters for each different api.

**To run the html, open VSS code and use command 'python app.py'**

Note: some tile layers for the leaflet geomap may not run on some computers, if the geomap does not run you may change the tilelayer used in the app.js.

example tilelayer: 
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
