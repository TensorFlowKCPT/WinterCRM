from sanic import Sanic, response, HTTPResponse, json, redirect, html, file
from sanic import Sanic
from sanic.response import text, html
from jinja2 import Environment, FileSystemLoader, select_autoescape
app = Sanic("on-wifi")


@app.route("/")
async def index(request):
    return response.text('Hello')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)