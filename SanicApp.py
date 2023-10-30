from sanic import Sanic, response, HTTPResponse, json, redirect, html, file
from sanic import Sanic
from sanic.response import text, html
from jinja2 import Environment, FileSystemLoader, select_autoescape
from Database import Database
app = Sanic("WinterCRM")
env = Environment(
    loader=FileSystemLoader('temp'),  # Папка с шаблонами
    autoescape=select_autoescape(['html', 'xml'])
)
app.static("/static/", "./st/")

@app.route("/")
async def index(request):
    return response.text('Hello')

@app.route("/shop")
async def shop(request):
    return response.text('Hello')

@app.route("/tasks")
async def tasks(request):
    return response.text('Hello')

@app.route("/service")
async def service(request):
    return response.text('Hello')

# РАБОТА С ГРАФИКОМ СОТРУДНИКОВ

@app.route("/schedule")
async def schedule(request):
    # Получите данные о сотрудниках из базы данных
    staff = Database.getStaff()
    print(staff)

    # Создайте шаблон и передайте данные в него
    template = env.get_template('schedule.html')
    rendered_html = template.render(data=staff)

    # Верните HTTP-ответ с рендеренным HTML
    return html(rendered_html)

@app.route('/schedule', methods=['POST'])
async def schedule_post(request):
    return text('POST метод')


@app.route("/inventory")
async def inventory(request):
    return response.text('Hello')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

