import sqlite3

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
                    FOREIGN KEY (Status_id) REFERENCES Work_statuses (ID)
                )
            ''')

Database.StartDataBase()

