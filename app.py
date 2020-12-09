from flask import Flask, render_template, redirect, jsonify

# Create an instance of Flask
app = Flask(__name__)


# Use flask_pymongo to set up mongo connection
# app.config["MONGO_URI"] = "mongodb://localhost:27017/mars_app"
# mongo = PyMongo(app)

# Route to render index.html template using data from Mongo
@app.route("/")
def index():
    # Find one record of data from the mongo database
    # Return template and data
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
