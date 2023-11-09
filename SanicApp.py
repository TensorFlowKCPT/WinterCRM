from sanic import Sanic, response, HTTPResponse, json, redirect, html, file
from sanic import Sanic
from sanic.response import text, html
from jinja2 import Environment, FileSystemLoader, select_autoescape
from Database import Database
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from datetime import datetime

app = Sanic("WinterCRM")
env = Environment(
    loader=FileSystemLoader('temp'),  # Папка с шаблонами
    autoescape=select_autoescape(['html', 'xml'])
)
app.static("/static/", "./st/")


#region /index
@app.route("/")
async def index(request):
    return response.text('Hello')
#endregion

#region /shop
@app.post("/shop")
async def addConsumableType(request):
    Name = request.form.get('Name')
    Cost = request.form.get('Cost')
    Database.addConsumableType(Name,Cost)
    return response.json({'status':'ok'})

@app.post("/sell-consumable")
async def sellConsumable(request):
    Database.sellConsumable(request.json.get('id'))
    return response.json({'response':'OK'}, status = 200)

@app.post("/add-consumable")
async def addConsumable(request):
    Database.addConsumable(request.json.get('id'), 1)
    return response.json({'response':'OK'}, status = 200)

@app.post("/del-consumable")
async def deleteConsumable(request):
    Database.delConsumable(request.json.get('id'))
    return response.json({'response':'OK'}, status = 200)

@app.get("/shop")
async def shop(request):
    consumables = Database.getConsumables()
    Data = {}
    if consumables:
        Data['Consumables'] = consumables
    template = env.get_template('shop.html')
    rendered_html = template.render(data=Data)

    return html(rendered_html)
#endregion

#region /task
@app.route("/addTask", methods=['POST'])
async def addTask(request):
    try:
        task = request.json.get('task')
        employee = request.json.get('employee')
        date = request.json.get('dueDate')
        color = request.json.get('color')
    except:
        return response.text('NOT OK, NOT OK', status=500)
    if task == '' or employee == '' or date == None or color == '':
        return response.text('NOT OK, NOT OK', status=500)
    Database.createTask(task=task, idEployees=employee, deadline=date, status=False, color = color)
    return response.text('OK',status=200)

@app.post("/del-task")
async def delTask(request):
    Database.delTask(request.json.get('id'))
    return response.json({'response':'OK'}, status = 200)

@app.route("/tasks")
async def tasks(request):
    tasks = Database.getTasksAll()
    staff = Database.getStaffAll()
    data = {}
    data['allTasksCount'] = 0
    data['uncheckedTasksCount'] = 0
    if tasks:
        data["tasks"] = sorted(tasks, key=lambda x: (x['Status'], x['Deadline']))
        data['allTasksCount'] = len(tasks)
        data['uncheckedTasksCount'] = sum(1 for task in tasks if task['Status'] == 0)
        
    if staff:
        data['staff'] = staff
    
    template = env.get_template('tasks.html')
    render_template = template.render(data = data)
    return response.html(render_template)

@app.route("/updateTaskStatus", methods=['POST'])
async def updateTaskStatus(request):
    taskId = request.json.get('taskId')
    status = request.json.get('isChecked')
    Database.statusPut(idTask=taskId, status=status)
    return response.json({"status": 200})
#endregion

#region /service
@app.route("/service", methods=['GET'])
async def service(request):
    getClients = Database.getClients()
    getInventory = Database.getInventory()
    getService = Database.getService()
    data = {}
    if getClients:
        data["clients"] = getClients
    if getInventory:
        data['inventory'] = getInventory
    if getService:
        data['service'] = getService
    
    template = env.get_template('service.html')
    render_template = template.render(data = data)
    return response.html(render_template)

@app.route("/service_create", methods=['POST'])
async def service_create(request):
    creating_date = request.json.get('creating_date')
    clients = request.json.get('clients')
    inventory = request.json.get('inventory')
    task = request.json.get('task')
    parts = request.json.get('parts')
    cost = request.json.get('cost')
    ispayed = request.json.get('ispayed')
    if not clients:
        clients = ""
    if not creating_date:
        creating_date = datetime.now().date()
    
    Database.createService(creating_date=creating_date, id_client=clients, id_inventory=inventory, task=task, parts=parts, cost=cost, isPayed=ispayed)
    return text("норм")

#endregion

#region /rents
def rents_sort_key(item):
    return (
        item['Return_Date'] or datetime(1900, 1, 1),  # Сортировка по Return_Date, "None" ставится в начало
        item['IsPayed'],  # По IsPayed
        item['Start_Date']  # По Start_Date
    )
@app.post("/rents")
async def addRent(request):
    #Очень не факт что работает, фронта нет, не тестил
    try:
        StartDate = request.json.get('StartDate')
        StartTime = request.json.get('StartTime')
        ReturnDate = request.json.get('ReturnDate')
        ReturnTime = request.json.get('ReturnTime')
        StartItems = request.json.get('StartItems')
        ReturnedItems = request.json.get('ReturnedItems')
        ClientId = request.json.get('ClientId')
        Deposit = request.json.get('Deposit')
        Cost = request.json.get('Cost')
        IsPayed = request.json.get('IsPayed')
        Database.addRent(Start_Date=StartDate,
                         Start_Time=StartTime,
                         Return_Date=ReturnDate,
                         Return_Time=ReturnTime,
                         StartItems=StartItems, 
                         ReturnedItems=ReturnedItems, 
                         Client=ClientId, 
                         Deposit=Deposit, 
                         Cost=Cost, 
                         IsPayed=IsPayed)
    except Exception as exception:
        return response.json({'error':str(exception)}, status=500)
    return response.json({'status':'Ok'}, status=200)

@app.get("/getInventoryData")
async def InventoryData(request):
    inventory = Database.getInventoryById(request.args.get('ID'))
    if not inventory:
        return response.json(None)
    services = Database.getServicesForInventory(request.args.get('ID'))
    if services:
        inventory['Services'] = services
    return response.json(inventory)

@app.get("/rents")
async def rents(request):
    data = {}
    Inventory = Database.getInventory()
    if Inventory:
        NotRentedInventory = list(filter(lambda item: item['Rented'] == 'false', Inventory))
        data['Inventory'] = NotRentedInventory
    Rents = Database.getRents()
    data['lenRents'] = 0
    if Rents:
        Rents = sorted(data, key=rents_sort_key)
        data['Rents'] = list(filter(lambda item: item['Expired'] == False, Rents))
        data['lenRents'] = len(Rents)
    Clients = Database.getClients()
    if Clients:
        data['Clients'] = Clients
    template = env.get_template('rents.html')
    render_template = template.render(data = data)
    return response.html(render_template)
#endregion

#region /schedule
# Функция для получения значений по определенной дате
def get_data_by_date(data_list, target_date):
    for item in data_list:
        _, _, date, value = item  # Распаковываем элемент кортежа
        if date == target_date:
            return value
    return False  # Если данных на указанную дату нет

@app.route("/schedule")
async def schedule(request):
    staff = Database.getStaffName()
    template = env.get_template('schedule.html')
    rendered_html = template.render(data=staff)

    return html(rendered_html)

# Обработчик для сохранения HTML таблицы
@app.route('/save', methods=['POST'])
async def save(request):
    html_table = request.form.get('table')  # Получаем данные таблицы из формы
    print(html_table)
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
    idEployees = Database.getIdEployee(nameEmployees.text.strip())
    nameMonth = xmlpars.findall(".//h2")
    monthObject = xmlpars.findall(".//table")

    for i in monthObject:
        for j in i.findall(".//td"):
            if j.get("style") != None and "rgb(255, 207, 207)" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get('id').split('_')[1].strip()}-{listdate[i.get('id').split('_')[0]].strip()}-{j.text.strip()}", 2)
            if j.get("style") != None and "rgb(207, 232, 255)" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get('id').split('_')[1].strip()}-{listdate[i.get('id').split('_')[0]].strip()}-{j.text.strip()}", 1)
            if j.get("style") != None and "rgb(253, 255, 174)" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get('id').split('_')[1].strip()}-{listdate[i.get('id').split('_')[0]].strip()}-{j.text.strip()}", 3)
    return response.text("успех")

@app.route('/get_schedule', methods=['POST'])
async def get_schedule(request):
    scheduleForEmployees = Database.getScheduleForEmployees(Database.getIdEployee(request.json.get('employee_id')))
    if scheduleForEmployees != None:
        months = {'november': ["11", 30], 'december': ["12", 31], 'january': ["01", 31], 'february': ["02", 29]}
        result = f'''
        <h1></h1>
        <h2>Ноябрь</h2>
        <table id="november_2023"></table>
        <h2>Декабрь</h2>
        <table id="december_2023"></table>
        <h2>Январь</h2>
        <table id="january_2024"></table>
        <h2>Февраль</h2>
        <table id="february_2023"></table>
        ''' 
        soup = BeautifulSoup(result, 'html.parser')
        soup.find('h1').string = scheduleForEmployees[0][1]
        tables = soup.find_all('table')
        for i in tables:
            for j in range(1, months[i.get('id').split("_")[0]][1]+1):
                if j % 7 == 0 or j == 1:
                    tagTr = soup.new_tag('tr')
                    i.append(tagTr)
                lastTr = i.find_all('tr')[-1]
                date = f'{i.get("id").split("_")[1]}-{months[i.get("id").split("_")[0]][0]}-{j}'
                if get_data_by_date(scheduleForEmployees, date) != False:
                    tagTd = soup.new_tag(name ='td')
                    tagTd['class'] = "cell"
                    tagTd.string = str(j)
                    data = get_data_by_date(scheduleForEmployees, date)
                    if data == 'Больничный':
                        tagTd['style'] = 'background-color: rgb(255, 207, 207)'
                    elif data == 'Работает':
                        tagTd['style'] = 'background-color: rgb(207, 232, 255)'
                    elif data == 'Отпуск':
                        tagTd['style'] = 'background-color: rgb(253, 255, 174)'
                    lastTr.append(tagTd)
                else:
                    tagTd = soup.new_tag(name ='td')
                    tagTd['class'] = "cell"
                    tagTd.string = str(j)
                    lastTr.append(tagTd)
        result = soup.prettify().encode('utf-8').decode('utf-8')
        return response.html(result)

    else:
        result = f'''
        <h1>{request.json.get('employee_id')}</h1>
        <h2>Ноябрь</h2>
        <table id="november_2023">
            <tr>
                <td class="cell">1</td>
                <td class="cell">2</td>
                <td class="cell">3</td>
                <td class="cell">4</td>
                <td class="cell">5</td>
                <td class="cell">6</td>
                <td class="cell">7</td>
            </tr>
            <tr>
                <td class="cell">8</td>
                <td class="cell">9</td>
                <td class="cell">10</td>
                <td class="cell">11</td>
                <td class="cell">12</td>
                <td class="cell">13</td>
                <td class="cell">14</td>
            </tr>
            <tr>
                <td class="cell">15</td>
                <td class="cell">16</td>
                <td class="cell">17</td>
                <td class="cell">18</td>
                <td class="cell">19</td>
                <td class="cell">20</td>
                <td class="cell">21</td>
            </tr>
            <tr>
                <td class="cell">22</td>
                <td class="cell">23</td>
                <td class="cell">24</td>
                <td class="cell">25</td>
                <td class="cell">26</td>
                <td class="cell">27</td>
                <td class="cell">28</td>
            </tr>
            <tr>
                <td class="cell">29</td>
                <td class="cell">30</td>
            </tr>
        </table>
        <h2>Декабрь</h2>
        <table id="december_2023">
            <tr>
                <td class="cell">1</td>
                <td class="cell">2</td>
                <td class="cell">3</td>
                <td class="cell">4</td>
                <td class="cell">5</td>
                <td class="cell">6</td>
                <td class="cell">7</td>
            </tr>
            <tr>
                <td class="cell">8</td>
                <td class="cell">9</td>
                <td class="cell">10</td>
                <td class="cell">11</td>
                <td class="cell">12</td>
                <td class="cell">13</td>
                <td class="cell">14</td>
            </tr>
            <tr>
                <td class="cell">15</td>
                <td class="cell">16</td>
                <td class="cell">17</td>
                <td class="cell">18</td>
                <td class="cell">19</td>
                <td class="cell">20</td>
                <td class="cell">21</td>
            </tr>
            <tr>
                <td class="cell">22</td>
                <td class="cell">23</td>
                <td class="cell">24</td>
                <td class="cell">25</td>
                <td class="cell">26</td>
                <td class="cell">27</td>
                <td class="cell">28</td>
            </tr>
            <tr>
                <td class="cell">29</td>
                <td class="cell">30</td>
                <td class="cell">31</td>
            </tr>
        </table>
        <h2>Январь</h2>
        <table id="january_2024">
            <tr>
                <td class="cell">1</td>
                <td class="cell">2</td>
                <td class="cell">3</td>
                <td class="cell">4</td>
                <td class="cell">5</td>
                <td class="cell">6</td>
                <td class="cell">7</td>
            </tr>
            <tr>
                <td class="cell">8</td>
                <td class="cell">9</td>
                <td class="cell">10</td>
                <td class="cell">11</td>
                <td class="cell">12</td>
                <td class="cell">13</td>
                <td class="cell">14</td>
            </tr>
            <tr>
                <td class="cell">15</td>
                <td class="cell">16</td>
                <td class="cell">17</td>
                <td class="cell">18</td>
                <td class="cell">19</td>
                <td class="cell">20</td>
                <td class="cell">21</td>
            </tr>
            <tr>
                <td class="cell">22</td>
                <td class="cell">23</td>
                <td class="cell">24</td>
                <td class="cell">25</td>
                <td class="cell">26</td>
                <td class="cell">27</td>
                <td class="cell">28</td>
            </tr>
            <tr>
                <td class="cell">29</td>
                <td class="cell">30</td>
                <td class="cell">31</td>
            </tr>
        </table>
        <h2>Февраль</h2>
        <table id="february_2023">
            <tr>
                <td class="cell">1</td>
                <td class="cell">2</td>
                <td class="cell">3</td>
                <td class="cell">4</td>
                <td class="cell">5</td>
                <td class="cell">6</td>
                <td class="cell">7</td>
            </tr>
            <tr>
                <td class="cell">8</td>
                <td class="cell">9</td>
                <td class="cell">10</td>
                <td class="cell">11</td>
                <td class="cell">12</td>
                <td class="cell">13</td>
                <td class="cell">14</td>
            </tr>
            <tr>
                <td class="cell">15</td>
                <td class="cell">16</td>
                <td class="cell">17</td>
                <td class="cell">18</td>
                <td class="cell">19</td>
                <td class="cell">20</td>
                <td class="cell">21</td>
            </tr>
            <tr>
                <td class="cell">22</td>
                <td class="cell">23</td>
                <td class="cell">24</td>
                <td class="cell">25</td>
                <td class="cell">26</td>
                <td class="cell">27</td>
                <td class="cell">28</td>
            </tr>
            <tr>
                <td class="cell">29</td>
            </tr>
        </table>
    '''
    return response.html(result)

@app.route('/get_password', methods=['POST'])
async def get_password(request):
    password = "adminqwerty"
    return response.json({'result': request.form.get('password') == password})
#endregion

#region /clients
@app.route('/add_client', methods=['POST'])
async def addClient(request):
    Fio = request.form.get('FIO')
    Passport = request.form.get('Passport')
    PhoneNumber = request.form.get('PhoneNumber')
    newclient = {"id":Database.addClient(Fio,Passport,PhoneNumber)}
    return response.json(newclient)

@app.route('/del_client', methods=['DELETE'])
async def delClient(request):
    idClient = request.json.get('id')
    Database.delClientById(idClient)
    responseData = {"success": True}
    return response.json(responseData)

@app.route('/del_selected_clients', methods=['POST'])
async def delSelectedClient(request):
    idsClient = request.json.get('ids')
    for i in idsClient:
        Database.delClientById(i)
    responseData = {"success": True}
    return response.json(responseData)

@app.route('/clients', methods=['GET'])
async def clients(request):
    # Получение клиентов из БД, создание словаря и занесение в него данных.
    clients = Database.getClients()
    Data = {}
    Data['lenClients'] = "0 клиентов"
    if clients:
        Data['Clients'] = clients
        # Динамический показ количества клиентов.
        lenClients = len(clients)
        if lenClients % 10 == 1 and lenClients % 100 != 11:
            lenClients = str(len(clients)) + " клиент"
        elif 2 <= lenClients % 10 <= 4 and (lenClients % 100 < 10 or lenClients % 100 >= 20):
            lenClients = str(len(clients)) + " клиента"
        else:
            lenClients = str(len(clients)) + " клиентов"
        Data['lenClients'] = lenClients
    
    # Добавление данных в шаблонизатор
    template = env.get_template('clients.html')
    rendered_html = template.render(data=Data)

    return html(rendered_html)
#endregion

#region /inventory
@app.post('/sell_inventory')
async def sellInventory(request):
   Cost = request.form.get('cost')
   Comment = request.form.get('comment')
   id = request.form.get('idinventory')
   Database.sellInventory(id,Cost,Comment)
   return response.json({'status':'ok'}, status=200)

@app.post('/del-inventory')
async def deleteInventory(request):
    Database.delInventory(request.json.get('id'))
    return response.json({'response':'OK'}, status = 200)

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
    return response.json('OK', status=200)
#endregion

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)

