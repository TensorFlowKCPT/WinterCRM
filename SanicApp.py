from sanic import Sanic, response, HTTPResponse, json, redirect, html, file
from sanic import Sanic
from sanic.response import text, html
from jinja2 import Environment, FileSystemLoader, select_autoescape
from Database import Database
import xml.etree.ElementTree as ET
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
    listdate = {
    "january": "01",
    "february": "02",
    "march": "03",
    "april": "04",
    "may": "05",
    "june": "06",
    "july": "07",
    "august": "08",
    "september": "09",
    "october": "10",
    "november": "11",
    "december": "12"
    }

    xmlpars = ET.fromstring(html_table)
    nameEmployees = xmlpars.find(".//h1")
    idEployees = Database.getIdEployee(nameEmployees.text)
    nameMonth = xmlpars.findall(".//h2")
    monthObject = xmlpars.findall(".//table")
<<<<<<< HEAD

    for i in monthObject:
        for j in i.findall(".//td"):
            if j.get("style") != None and "red" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text}", 2)
            if j.get("style") != None and "blue" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text}", 1)
            if j.get("style") != None and "green" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text}", 3)
    return response.text("успех")
@app.route('/schedule', methods=['POST'])
async def schedule_post(request):
    return text('POST метод')
=======
>>>>>>> origin/main

    for i in monthObject:
        for j in i.findall(".//td"):
            if j.get("style") != None and "red" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text}", 2)
            if j.get("style") != None and "blue" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text}", 1)
            if j.get("style") != None and "green" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text}", 3)
    return response.text("успех")

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

