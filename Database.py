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
                conn.execute('INSERT OR IGNORE INTO WinterInventoryTypes (Name) VALUES (?)', item)

            conn.execute('''CREATE TABLE IF NOT EXISTS WinterInventory (
                        ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
                        Name TEXT NOT NULL,
                        Type INTEGER NOT NULL,
                        Rented BOOLEAN NOT NULL,
                        Size INTEGER,
                        FOREIGN KEY (Type) REFERENCES WinterInventoryTypes (ID)
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
                conn.execute('INSERT OR IGNORE INTO Employees (Name) VALUES (?)', item)
            
            conn.execute('''
                CREATE TABLE IF NOT EXISTS Tasks (
                    ID INTEGER PRIMARY KEY,
                    Task TEXT NOT NULL,
                    Performer INT NOT NULL,
                    Deadline DATE,
                    Status BOOLEAN NOT NULL,
                    FOREIGN KEY (Performer) REFERENCES Employees (ID)
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
                conn.execute('INSERT OR IGNORE INTO Work_status (Status) VALUES (?)', item)

            conn.execute('''
                CREATE TABLE IF NOT EXISTS Employee_schedule (
                    ID INTEGER PRIMARY KEY,
                    Employee_id INTEGER,
                    Date DATE NOT NULL,
                    Status_id INTEGER,
                    FOREIGN KEY (Employee_id) REFERENCES Employees (ID),
                    FOREIGN KEY (Status_id) REFERENCES Work_status (ID)
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
                    FOREIGN KEY (Client) REFERENCES Clients (ID)
                )
            ''')
            
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
        
        



            

Database.StartDataBase()

