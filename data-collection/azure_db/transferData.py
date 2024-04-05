import sqlite3
import pyodbc
from azureCreds import connection_string


def transform_persons(row):
    id, family_he, family_en, family_ar, name_he, name_en, name_ar, birth_year, age = (
        row
    )
    # Calculate the age_group based on the tens digit of age
    age_group = age // 10 if age else None  # Handles case where age might be None
    
    # Return the transformed row in the order expected by the SQL Server persons table
    return (
        id,
        family_he,
        family_en,
        family_ar,
        name_he,
        name_en,
        name_ar,
        birth_year,
        age,
        age_group,
    )


# Example of transferring data for one table
def transfer_table_data(
    source_cursor,
    dest_cursor,
    source_db_name,
    dest_table_name,
):
    query = f"""
        SELECT id, family_he, family_en,family_ar, name_he,name_en,name_ar, birth_year, age
        FROM {source_db_name}
        WHERE length(id) = 9 
    """
    source_cursor.execute(query)
    rows = source_cursor.fetchall()
    # transformed_rows = [transform_persons(row) for row in rows]

    # print(transformed_rows)
        
    for row in rows:
        # The INSERT statement now matches the SQL Server persons table structure, excluding the auto-generated pers_id
        dest_cursor.execute(
            f"""
            INSERT INTO {dest_table_name} (id, family_he, family_en, family_ar, name_he, name_en, name_ar, birth_year, age, age_group)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, {row[-1]// 10 if row[-1] else 0})
        """,
            row,
        )


# Define any necessary transformation functions
def transform_persons(row):
    # Transform the data as needed
    return row


if __name__ == '__main__': 
    print("hell0")

    # Connect to the SQLite database
    sqlite_conn = sqlite3.connect(
        "/Users/razbuxboim/Desktop/Halbitza/server-hal/db/workers_database_2023_cleaned.sqlite"
    )
    sqlite_cursor = sqlite_conn.cursor()

    # Connect to the SQL Server database
    # connectionString = "sqlcmd -S tcp:halvitsa-db-server.database.windows.net,1433 -U dbadmin -P 'Passw0rd!@#$%^' -d havitsa-db"
    sqlserver_conn = pyodbc.connect(connection_string)
    sqlserver_cursor = sqlserver_conn.cursor()

    # the name of the main table
    source_db_name = "all_data_cleaned"

    # Transfer data for each table
    transfer_table_data(
        sqlite_cursor, sqlserver_cursor, source_db_name,"persons")

    # Don't forget to commit and close connections!
    sqlserver_conn.commit()
    sqlserver_conn.close()
    sqlite_conn.close()
