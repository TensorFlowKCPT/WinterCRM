from sanic import Sanic, response, HTTPResponse, json, redirect, html, file
from sanic import Sanic
from sanic.response import text, html
from jinja2 import Environment, FileSystemLoader, select_autoescape
from Database import Database
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
app = Sanic("WinterCRM")
env = Environment(
    loader=FileSystemLoader('temp'),  # Папка с шаблонами
    autoescape=select_autoescape(['html', 'xml'])
)
app.static("/static/", "./st/")

# Функция для получения значений по определенной дате
def get_data_by_date(data_list, target_date):
    for item in data_list:
        _, _, date, value = item  # Распаковываем элемент кортежа
        if date == target_date:
            return value
    return False  # Если данных на указанную дату нет

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
    print(nameEmployees.text.strip())
    nameMonth = xmlpars.findall(".//h2")
    monthObject = xmlpars.findall(".//table")

    for i in monthObject:
        for j in i.findall(".//td"):
            if j.get("style") != None and "red" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text.strip()}", 2)
            if j.get("style") != None and "blue" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text.strip()}", 1)
            if j.get("style") != None and "green" in j.get("style"):
                Database.putSchedule(idEployees, f"{i.get("id").split('_')[1]}-{listdate[i.get("id").split('_')[0]]}-{j.text.strip()}", 3)
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
                date = f'{i.get('id').split("_")[1]}-{months[i.get('id').split("_")[0]][0]}-{j}'
                if get_data_by_date(scheduleForEmployees, date) != False:
                    tagTd = soup.new_tag(name ='td')
                    tagTd['class'] = "cell"
                    tagTd.string = str(j)
                    data = get_data_by_date(scheduleForEmployees, date)
                    if data == 'Больничный':
                        tagTd['style'] = 'background-color: red'
                    elif data == 'Работает':
                        tagTd['style'] = 'background-color: blue'
                    elif data == 'Отпуск':
                        tagTd['style'] = 'background-color: green'
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

