from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/anomaly")
def anomaly():
    return render_template("anomaly.html")


@app.route("/reactor-control")
def reactor_control():
    return render_template("reactor_control.html")


@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == "__main__":
    app.run(debug=True)