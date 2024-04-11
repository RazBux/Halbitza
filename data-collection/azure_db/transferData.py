import sqlite3
import pyodbc
from azureCreds import connection_string
from datetime import datetime

def transfer_table_data(sqlite_cursor, sqlserver_cursor, source_table_name, dest_table_name):
    # Query to fetch data from the source table (SQLite)
    sqlite_cursor.execute(f"SELECT pers_id, city FROM {source_table_name} WHERE length(pers_id) = 9")
    rows = sqlite_cursor.fetchall()
    print(rows)
    
    for row in rows:
        pers_id = row[0]  # Assuming pers_id is the first element of the row tuple

        # Check if pers_id exists in the persons table
        sqlserver_cursor.execute("SELECT COUNT(*) FROM persons WHERE id = ?", (pers_id,))
        if sqlserver_cursor.fetchone()[0] > 0:
            # Safe to insert since pers_id exists in the persons table
            try:
                sqlserver_cursor.execute(
                    f"""
                    INSERT INTO addresses (pers_id, city)
                    VALUES (?, ?)
                    """,
                    row
                )
            except pyodbc.IntegrityError as e:
                print(f"Failed to insert row with pers_id {pers_id} due to an integrity error: {e}")
        else:
            print(f"Skipping insert for pers_id {pers_id}: not found in persons table.")



if __name__ == "__main__":
    # Connect to the SQLite database
    db_path = "/Users/razbuxboim/Desktop/Halbitza/excel_data_new.db"
    sqlite_conn = sqlite3.connect(db_path)
    sqlite_cursor = sqlite_conn.cursor()

    # Connect to the SQL Server database
    sqlserver_conn = pyodbc.connect(connection_string)
    sqlserver_cursor = sqlserver_conn.cursor()

    # Transfer data for each table
    transfer_table_data(sqlite_cursor, sqlserver_cursor, "addresses", "addresses")

    # Don't forget to commit and close connections!
    sqlserver_conn.commit()
    sqlserver_conn.close()
    sqlite_conn.close()
