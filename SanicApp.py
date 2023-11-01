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
    staff = Database.getStaff()
    print(staff)
    template = env.get_template('schedule.html')
    rendered_html = template.render(data=staff)

    return html(rendered_html)

# Обработчик для сохранения HTML таблицы
@app.route('/save', methods=['POST'])
async def save(request):
    html_table = request.form.get('table')  # Получаем данные таблицы из формы
    print(html_table)
    return text("кайф")

@app.route('/schedule', methods=['POST'])
async def schedule_post(request):
    return text('POST метод')

@app.get('/inventory')
async def inventoryPage(request):
    Data = {}
    inventory = Database.getInventory()
    if inventory:
        Data['Inventory'] = inventory
    Data['InventoryTypes'] = Database.getInventoryTypes()
    template = env.get_template('inventory.html')
    return response.html(template.render(data = Data))

@app.post('/inventory')
async def add_inventory(request):
    name = request.form.get('name')
    type = request.form.get('type')
    rented = request.form.get('rented')
    size = request.form.get('size')
    Database.addInventory(name,type,rented,size)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

