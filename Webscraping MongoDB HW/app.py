from flask import Flask, render_template, redirect
import pymongo
from scrape_mars import ScrapeMars

#initialize the app and class
app = Flask(__name__)
scrapeMars = ScrapeMars()

#mongo initialization
conn = 'mongodb://localhost:27017'

# Connection to pymongo
client = pymongo.MongoClient(conn)

# Connect to a database. Creates one if one does not already exist
db = client.mars_app

# Route to render index.html template using data from Mongo
@app.route("/")
def home():

    # Find one record of data from the mongo database
    mars_data = db.mars_data.find_one(sort=[( 'last_updated', pymongo.DESCENDING)])

    # Return template and data
    return render_template("index.html", mars=mars_data)


# Route that will trigger the scrape function
@app.route("/scrape")
def scrape():
    #scrape data
    scraped_data = scrapeMars.scrape_info()
    #update database
    db.mars_data.insert_one(scraped_data)
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)