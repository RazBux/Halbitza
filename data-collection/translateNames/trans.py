import sqlite3
import pandas as pd
from googletrans import Translator

# Initialize the translator
translator = Translator()

# Function to translate text, english = 'en' , arabic = 'ar'
def translate_text(text):
    try:
        translated = translator.translate(text, src='en',dest='ar')
        return translated.text
    except Exception as e:
        print(f"Error translating {text}: {e}")
        return None

# Connect to your SQLite database
db_path = '/Users/razbuxboim/Desktop/Halbitza/excel_data_new.db' 
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Read the data from the table
# Read the data from the table that needs translation
query = "SELECT id, name_en, family_en FROM persons"
df = pd.read_sql_query(query, conn)

# Translate and update the database
for index, row in df.iterrows():
    name = row['name_en']
    family = row['family_en']
    translated_name = translate_text(name)
    translated_family = translate_text(family)
    print(f'{name}":"{translated_name}, {family}:{translated_family}')
    # Update the database
    update_query = """UPDATE persons SET name_ar = ?, family_ar = ? WHERE id = ?"""
    cursor.execute(update_query, (translated_name, translated_family, row['id']))

# Commit the changes and close the connection
conn.commit()
conn.close()