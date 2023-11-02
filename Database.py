import sqlite3
from datetime import datetime

class Database:
    def StartDataBase():
        with sqlite3.connect('database.db') as conn:
            conn.execute('''CREATE TABLE IF NOT EXISTS Clients (
                        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        FIO TEXT NOT NULL,
                        Passport TEXT NOT NULL,
                        PhoneNumber TEXT NOT NULL
                     )
                 ''')
            
            conn.execute('''CREATE TABLE IF NOT EXISTS WinterInventoryTypes (
                        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        Name TEXT NOT NULL
                     )
                 ''')
            
            data_to_insert = [
                ('Сноуборд',),
                ('Ботинки',),
                ('Лыжи',),
                ('г/л Ботинки',),
                ('Шлема',),
                ('Лыжные Чехлы',),
                ('Маски',),
                ('Палки',)
            ]
            
            for item in data_to_insert:
                cursor = conn.execute('SELECT ID FROM WinterInventoryTypes WHERE Name = ?', item).fetchone()
                if not cursor:
                    conn.execute('INSERT OR IGNORE INTO WinterInventoryTypes (Name) VALUES (?)', item)

            conn.execute('''CREATE TABLE IF NOT EXISTS WinterInventory (
                        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        Name TEXT NOT NULL,
                        Type INTEGER NOT NULL,
                        Rented BOOLEAN NOT NULL,
                        Size INTEGER,
                        Sold BOOLEAN,
                        FOREIGN KEY (ID) REFERENCES WinterInventoryTypes (Type)
                     )
                 ''')
            
            conn.execute('''CREATE TABLE IF NOT EXISTS SoldInventory (
                        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        InventoryID INT NOT NULL,
                        Cost INT NOT NULL,
                        Comment TEXT,
                        FOREIGN KEY (ID) REFERENCES WinterInventory (InventoryID)
                     )
                 ''')
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS Employees (
                    ID INTEGER PRIMARY KEY,
                    Name TEXT NOT NULL
                )
            ''')
            data_to_employees = [
                ('Александр',),
                ('Валерий',),
                ('Никита',),
                ('Егор',),
                ('Люба',)
            ]

            for item in data_to_employees:
                cursor = conn.execute('SELECT ID FROM Employees WHERE Name = ?', item).fetchone()
                if not cursor:
                    conn.execute('INSERT OR IGNORE INTO Employees (Name) VALUES (?)', item)
            conn.execute('''
                CREATE TABLE IF NOT EXISTS Shop (
                    ID INTEGER PRIMARY KEY,
                    Task TEXT NOT NULL,
                    Performer INT NOT NULL,
                    Deadline DATE,
                    Status BOOLEAN NOT NULL,
                    FOREIGN KEY (ID) REFERENCES Employees (Performer)
                )
            ''')
            conn.execute('''
                CREATE TABLE IF NOT EXISTS Tasks (
                    ID INTEGER PRIMARY KEY,
                    Task TEXT NOT NULL,
                    Performer INT NOT NULL,
                    Deadline DATE,
                    Status BOOLEAN NOT NULL,
                    FOREIGN KEY (ID) REFERENCES Employees (Performer)
                )
            ''')

            conn.execute('''
                CREATE TABLE IF NOT EXISTS Work_status (
                    ID INTEGER PRIMARY KEY,
                    Status TEXT NOT NULL
                )
            ''')
            data_to_insert = [
                ('Работает',),
                ('Больничный',),
                ('Отпуск',)
            ]

            for item in data_to_insert:
                cursor = conn.execute('SELECT ID FROM Work_status WHERE Status = ?', item).fetchone()
                if not cursor:
                    conn.execute('INSERT OR IGNORE INTO Work_status (Status) VALUES (?)', item)

            conn.execute('''
                CREATE TABLE IF NOT EXISTS Employee_schedule (
                    ID INTEGER PRIMARY KEY,
                    Employee_id INTEGER,
                    Date DATE NOT NULL,
                    Status_id INTEGER,
                    FOREIGN KEY (ID) REFERENCES Employees (Employee_id),
                    FOREIGN KEY (ID) REFERENCES Work_status (Status_id)
                )
            ''')

            conn.execute('''
                CREATE TABLE IF NOT EXISTS Rents (
                    ID INTEGER PRIMARY KEY,
                    Start_Date DATE NOT NULL,
                    Return_Date DATE,
                    StartItemsJSON TEXT NOT NULL,
                    ReturnedItemsJSON TEXT,
                    Client INT NOT NULL,
                    Deposit TEXT NOT NULL,
                    COST INT NOT NULL,
                    IsPayed BOOLEAN NOT NULL,
                    FOREIGN KEY (ID) REFERENCES Clients (Client)
                )
            ''')
            
    def getClientRents(id):
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT * FROM Rents WHERE Client = ?',(id,))
            rows = cursor.fetchall()
            if not rows:
                return None
            rows = [row for row in rows]
            output = []
            for row in rows:
                output.append({
                    'ID' : row[0],
                    'Start_Date' : datetime.strptime(row[1], "%Y-%m-%d"),
                    'Return_Date' : datetime.strptime(row[2], "%Y-%m-%d"),
                    'StartItemsJSON' : row[3],
                    'ReturnedItemsJSON' : row[4],
                    'Client' : Database.GetClientById(row[5]),
                    'Deposit' : row[6],
                    'Cost' : row[7],
                    'IsPayed' : row[8]})
            return output

    def getClients():
        with sqlite3.connect('database.db') as conn:
           cursor = conn.execute('SELECT * FROM Clients')
           rows = cursor.fetchall()
           if not rows:
               return None
           rows = [row for row in rows]
           output = []
           for row in rows:
               output.append({
                   'ID' : row[0],
                   'FIO' : row[1],
                   'Passport' : row[2],
                   'PhoneNumber' : row[3]})
           return output

    def delClientById(id):
        with sqlite3.connect('database.db') as conn:
            conn.execute('DELETE FROM Clients WHERE ID = ?', (id,))
            conn.commit()

    def addClient(fio, passport, phone_number):
        with sqlite3.connect('database.db') as conn:
            conn.execute('INSERT INTO Clients (FIO, Passport, PhoneNumber) VALUES (?,?,?)', (fio, passport, phone_number,))
            conn.commit()

    def getInventoryTypes():
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT ID, Name FROM WinterInventoryTypes')
            rows = cursor.fetchall()
            output = []
            if rows:
                rows = [row for row in rows]
                for row in rows:
                    output.append({
                        'ID' : row[0],
                        'Name' : row[1]})
                return output
            return None
        
    def addInventory(name:str, type: int, rented: bool, size: int):
        with sqlite3.connect('database.db') as conn:
            conn.execute('INSERT INTO WinterInventory (Name, Type, Rented, Size, Sold) VALUES (?,?,?,?,?)', (name, type, rented, size, False,))
            conn.commit()

    def sellInventory(id, Cost, Comment):
        with sqlite3.connect('database.db') as conn:
            conn.execute('INSERT INTO SoldInventory (InventoryID,Cost,Comment) VALUES (?,?,?)', (id, Cost, Comment,))
            conn.execute('UPDATE WinterInventory SET Sold = True WHERE ID = ?', (id,))
            conn.commit()

    def delInventory(id):
        with sqlite3.connect('database.db') as conn:
            conn.execute('DELETE FROM WinterInventory WHERE ID = ?', (id,))
            conn.commit()

    def getInventory():
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT * FROM WinterInventory WHERE NOT Sold = True')
            rows = cursor.fetchall()
            if not rows:
                return None
            rows = [row for row in rows]
            output = []
            for row in rows:
                cursor = conn.execute('SELECT Name FROM WinterInventoryTypes WHERE ID = ?', (row[2],))
                output.append({
                    'Name' : row[1],
                    'Type' : cursor.fetchone()[0],
                    'Rented' : row[3],
                    'Size' : row[4]})
            return output
        
    def GetClientById(id):
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT * FROM Clients WHERE ID = ?',(id,))
            rows = cursor.fetchone()
            if not rows:
                return None
            client = {
                'ID' : rows[0][0],
                'FIO' : rows[0][1],
                'Passport' : rows[0][2],
                'PhoneNumber' : rows[0][3]
            }
            return client
        
    def addRent(Start_Date:datetime, Return_Date:datetime, StartItems:list, ReturnedItems:list, Client:int, Deposit:str, Cost:str, IsPayed:bool):
        
        with sqlite3.connect('database.db') as conn:
            conn.execute('INSERT INTO Rents (Start_Date, Return_Date, StartItemsJSON, ReturnedItemsJSON, Client, Deposit, Cost, IsPayed) VALUES (?,?,?,?,?,?,?,?)', ())
        return
    
    def getRents():
         with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT * FROM Rents')
            rows = cursor.fetchall()
            if not rows:
                return None
            rows = [row for row in rows]
            output = []
            for row in rows:
                output.append({
                    'ID' : row[0],
                    'Start_Date' : datetime.strptime(row[1], "%Y-%m-%d"),
                    'Return_Date' : datetime.strptime(row[2], "%Y-%m-%d"),
                    'StartItemsJSON' : row[3],
                    'ReturnedItemsJSON' : row[4],
                    'Client' : Database.GetClientById(row[5]),
                    'Deposit' : row[6],
                    'Cost' : row[7],
                    'IsPayed' : row[8]})
            return output
    def getStaff():
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT Name FROM Employees ')
            rows = cursor.fetchall()
            if rows:
                rows = [row[0] for row in rows]
                return rows
            return None
    
    def putSchedule(idEmployee: int, date: str, idStatus: int):
        with sqlite3.connect('database.db') as conn:
            cursor = conn.cursor()

            # Проверяем, существует ли запись с заданными значениями Employee_id и Date
            cursor.execute('SELECT Employee_id FROM Employee_schedule WHERE Employee_id = ? AND Date = ?;', (idEmployee, date))
            existing_record = cursor.fetchone()

            if existing_record:
                # Если запись существует, обновляем ее
                cursor.execute('UPDATE Employee_schedule SET Status_id = ? WHERE Employee_id = ? AND Date = ?;', (idStatus, idEmployee, date))
            else:
                # Если запись не существует, вставляем новую
                cursor.execute('INSERT INTO Employee_schedule (Employee_id, Date, Status_id) VALUES (?, ?, ?);', (idEmployee, date, idStatus))

    def getIdEployee(name: str):
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT ID FROM Employees WHERE Name = ?', (name,))
            row = cursor.fetchone()
            if row:
                return row[0]
            return None
        
    def getIdWorkStatus(status: str):
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT ID FROM Work_status WHERE Status = ?', (status,))
            row = cursor.fetchone()
            if row:
                return row[0]
            return None
        
    def getScheduleForEmployees(id: int):
        with sqlite3.connect('database.db') as conn:
            cursor = conn.execute('SELECT * FROM Employee_schedule WHERE Employee_id = ?', (id,))
            rows = cursor.fetchall()
            if rows:
                result = []
                for row in rows:
                    schedule_id, employee_id, date, status_id = row
                    # Получите имя сотрудника и значение статуса по их id из соответствующих таблиц
                    cursor.execute('SELECT name FROM Employees WHERE id = ?', (employee_id,))
                    employee_name = cursor.fetchone()[0]
                    cursor.execute('SELECT status FROM Work_status WHERE id = ?', (status_id,))
                    status_value = cursor.fetchone()[0]
                    result.append((schedule_id, employee_name, date, status_value))
                return result
            return None
        



            

Database.StartDataBase()
Database.getRents()
