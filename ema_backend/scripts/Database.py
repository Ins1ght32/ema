import mysql.connector
from mysql.connector import Error
from dateutil import parser
from datetime import datetime
import re
import pytz

class Database:
    def __init__(self, server, username, password, db, port):
        self.server = server
        self.username = username
        self.password = password
        self.db = db
        self.port = port
        self.connection = None
    
    def connect(self):
        try:
            self.connection = mysql.connector.connect(
                host = self.server,
                username = self.username,
                password = self.password,
                database = self.db,
                port = self.port
            )

            if self.connection.is_connected():
                print("Connected to DB")
        except Error as e:
            print(f"Error: {e}")

    def close(self):
        if self.connection.is_connected():
            self.connection.close()
            print("MySQL connection closed")

    '''
    def updateEOS(self, updateValues):
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()

            if self.connection.is_connected():
                cursor = self.connection.cursor()
                update_query = "UPDATE products SET eos_date  = %s WHERE products_id = %s"

                for item in updateValues:
                    updatedEosDate = item.get("eol")
                    productsID = item.get("id")
                   #  print(f"Products ID: {productsID}")
                    if updatedEosDate == False:
                        updatedEosDate = "9999-12-31"
                    elif updatedEosDate == None:
                        updatedEosDate = "1970-01-01"
                    try:
                        eosDateTime = parser.parse(updatedEosDate, default=datetime(2024, 1, 1))
                        print(f"eosDatetime: {eosDateTime}")
                    except ValueError as e:
                        return None

                    cursor.execute(update_query, (eosDateTime, productsID))
                    print("executed")
                
                self.connection.commit()
                print(f"Rows updated: {cursor.rowcount}")
        except Error as e:
            print(f"Error: {e}")
    '''
    
    
    def updateEOS(self, updateValues):
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()

            if self.connection.is_connected():
                cursor = self.connection.cursor()
                update_query = "UPDATE products SET eos_date = %s, contains_primary_source = %s WHERE products_id = %s"

                for item in updateValues:
                    name = item.get("name")
                    updatedEosDate = item.get("eol")
                    productsID = item.get("id")
                    primary_source = item.get("contains_primary_source")
                    print(f"Products ID: {productsID}")

                    # Handle default dates
                    if updatedEosDate is False:
                        updatedEosDate = "9999-12-31"
                        eosDateTime = parser.parse(updatedEosDate, default=datetime(2024, 1, 1))

                    elif updatedEosDate is None:
                        updatedEosDate = "1970-01-01"
                        eosDateTime = parser.parse(updatedEosDate, default=datetime(2024, 1, 1))
                    else:
                        
                        # Convert to string if not already a string
                        if not isinstance(updatedEosDate, str):
                            updatedEosDate = str(updatedEosDate)
                        '''
                        try:
                            # Parse the date string
                            eosDateTime = parser.parse(updatedEosDate).strftime('%Y-%m-%d %H:%M:%S')
                            print(f"eosDatetime: {eosDateTime}")

                        except ValueError as e:
                            print(f"Error parsing date for Products ID {productsID}: {e}")
                            eosDateTime = None  # Handle parsing error gracefully
                        '''
                        try:
                            eosDateTime = parser.parse(updatedEosDate, default=datetime(2024, 1, 1))
                        except Exception as e:
                            date_pattern = r'(\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b \d{4})'
                            updatedEosDate = re.findall(date_pattern, updatedEosDate)
                            if (updatedEosDate):
                                eosDateTime = parser.parse(str(updatedEosDate[0]), default=datetime(2024, 1, 1))
                            else:
                                eosDateTime = parser.parse("9998-12-31", default=datetime(2024, 1, 1))




                    print("UPDATING DB")
                    print(f"{name}: {eosDateTime}")
                    # Execute the update query
                    try:
                        
                        cursor.execute(update_query, (eosDateTime, primary_source, productsID))
                        self.connection.commit()
                        print(f"Rows updated for Products ID {productsID}: {cursor.rowcount}")

                    except Exception as e:
                        print(f"Error updating database for Products ID {productsID}: {e}")
                        self.connection.rollback()  # Rollback the transaction on error

        except Error as e:
            print(f"Database error: {e}")

        finally:
            # Make sure to close cursor and connection
            if cursor:
                cursor.close()
            if self.connection and self.connection.is_connected():
                self.connection.close()
        

    def selectAll(self, data = None):
        return_result = []
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()

            if self.connection.is_connected():
                if data == None:
                    query = "SELECT * FROM products WHERE do_not_crawl !='yes' OR do_not_crawl IS NULL"

                    cursor = self.connection.cursor()

                    cursor.execute(query)

                    result = cursor.fetchall()

                    for row in result:
                        # print(type(row))
                        # return type is tuple
                        return_result.append(row)
                else:
                    #data is a list of id
                    for id in data:
                        query = "SELECT * FROM products where products_id = %s"

                        cursor = self.connection.cursor()

                        cursor.execute(query, (int(id),))

                        result = cursor.fetchall()

                        for row in result:
                            return_result.append(row)
        except Error as e:
            print(f"Error: {e}")
        
        return return_result
    
    def test(self, updateValues):
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()

            if self.connection.is_connected():
                for item in updateValues:
                    updatedEosDate = item.get("eol")
                    productsID = item.get("id")

                    if updatedEosDate == False:
                        updatedEosDate = "9999-12-31"
                    if updatedEosDate == None:
                        updatedEosDate = "1970-01-01"
                    try:
                        # print(f"Inside try block: {updatedEosDate}")
                        eosDateTime = parser.parse(updatedEosDate, default=datetime(2024, 1, 1))
                    except (ValueError, TypeError) as e:
                        eosDateTime = None
                        return None
                    print(f"EosDatetime: {eosDateTime}, Product Name: {item.get('name')}")
        except Error as e:
            print(f"Error: {e}")

    def updateTime(self):
        try:
            if not self.connection or not self.connection.is_connected():
                self.connect()

            if self.connection.is_connected():
                local_tz = pytz.timezone('Asia/Singapore')
                current_time = datetime.now(local_tz).isoformat()

                try:
                    cursor = self.connection.cursor()       
                    cursor.execute('UPDATE crawl_times SET crawl_time = %s WHERE id = %s', (current_time, 1))
                    self.connection.commit()
                except mysql.connector.Error as e:
                    print(f"Error updating database for Crawl Time: {e}")
                    self.connection.rollback()  # Rollback the transaction on error
        except Error as e:
            print(f"Error: {e}")


