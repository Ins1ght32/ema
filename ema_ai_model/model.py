from flask import Flask, request, jsonify
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from transformers import TapasTokenizer, TapasForQuestionAnswering
import mysql.connector
import requests
from bs4 import BeautifulSoup
import spacy
from string import punctuation
from nltk.stem import PorterStemmer
import warnings
from dotenv import load_dotenv
import os

load_dotenv()

# Database and user details
host = os.getenv('DB_HOST')
user = os.getenv('DB_USER')
password = os.getenv('DB_PASSWORD')
database = os.getenv('DB_DATABASE')
port = os.getenv('DB_PORT')

'''
import os
from flask_wtf.csrf import CSRFProtect, generate_csrf
'''

# Suppress specific warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=UserWarning)

# Initialize Flask app
app = Flask(__name__)
'''
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY
csrf = CSRFProtect(app)
'''

# Load Tapas model and tokenizer (Locally)
model_name = "google/tapas-large-finetuned-wtq"
tokenizer = TapasTokenizer.from_pretrained(model_name)
model = TapasForQuestionAnswering.from_pretrained(model_name)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Initialise the stemmer
stemmer = PorterStemmer()

# spaCy NLP model keyword extraction from user query, including numbers
def extract_keywords_spacy(query):
    result = []
    pos_tag = ['PROPN', 'ADJ', 'NOUN', 'NUM']
    doc = nlp(query.lower())
    for token in doc:
        if token.text in nlp.Defaults.stop_words or token.text in punctuation:
            continue
        if token.pos_ in pos_tag or token.pos_ == 'NUM':
            result.append(token.text)
    return result

# Function to stem the words in the query
def stem_query(query):
    return [stemmer.stem(word) for word in query.split()]

def extract_keywords(query):
    query = query.lower()
    keywords = ["url", "webpage"]
    if any(word in stem_query(query) for word in keywords):
        return extract_keywords_spacy(query)
    return None

'''
# Web scraper code
def scrape_websites_for_info(keyword):
    search_query = f"{keyword} end of service dates"
    google_search_url = f"https://www.google.com/search?q={search_query}&ie=utf-8&oe=utf-8&num=10"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    }

    response = requests.get(google_search_url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        featured_snippet = None
        
        # Find the featured snippet
        snippet_div = soup.find('div', class_='V3FYCf')
        featured_answer = {}

        for h2 in soup.find_all('h2'):
            if 'Featured snippet from the web' in h2.get_text():
                # Find the parent div of the h2
                parent_div = h2.find_parent('div')
                if parent_div:
                    # Find the next upper parent div
                    featured_snippet = parent_div.find_parent('div')
                break

        if featured_snippet:
            # Find the first <b> tag within the featured snippet div
            first_b_tag = featured_snippet.find('b')
            if first_b_tag:
                b_tag_content = first_b_tag.get_text()
                featured_answer['Answer'] = b_tag_content
            else:
                return {"error": "Recommended dates produced but not enough information was provided to the query to produce a specific date. Please select from the top 3 websites below instead."}

        if snippet_div:
            # Extract the content of the featured snippet
            description_div = snippet_div.find('div', class_='LGOjhe')
            if description_div:
                featured_answer['Featured Answer'] = description_div.get_text()
            
            # Extract the link of the featured snippet
            link_tag = snippet_div.find('a', href=True)
            if link_tag:
                featured_answer['Link'] = link_tag['href']
        
        allData = soup.find_all("div", {"class": "g"})
        Data = []

        for data in allData[:3]:
            result_data = {}
            title = data.find('h3', {"class": "DKV0Md"})
            link = data.find('a', href=True)
            if link:
                href = link['href']
                if href.startswith('https') and 'aclk' not in href:
                    result_data['title'] = title.text if title else None
                    result_data['link'] = href
                    Data.append(result_data)

        return {"featured_answer": featured_answer, "top_websites": Data}
    return []
'''

# Web scraper code
def scrape_websites_for_info(keyword):
    search_query = f"{keyword} end of service dates"
    google_search_url = f"https://www.google.com/search?q={search_query}&ie=utf-8&oe=utf-8&num=10"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
    }

    response = requests.get(google_search_url, headers=headers)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        featured_snippet = None
        
        # Find the featured snippet
        snippet_div = soup.find('div', class_='V3FYCf')
        featured_answer = {}

        for h2 in soup.find_all('h2'):
            if 'Featured snippet from the web' in h2.get_text():
                # Find the parent div of the h2
                parent_div = h2.find_parent('div')
                if parent_div:
                    # Find the next upper parent div
                    featured_snippet = parent_div.find_parent('div')
                break

        if featured_snippet:
            # Find the first <b> tag within the featured snippet div
            first_b_tag = featured_snippet.find('b')
            if first_b_tag:
                b_tag_content = first_b_tag.get_text()
                featured_answer['Answer'] = b_tag_content
            else:
                featured_answer['Featured Answer'] = None  # No specific answer found

        if snippet_div:
            # Extract the content of the featured snippet
            description_div = snippet_div.find('div', class_='LGOjhe')
            if description_div:
                featured_answer['Featured Answer'] = description_div.get_text()
            
            # Extract the link of the featured snippet
            link_tag = snippet_div.find('a', href=True)
            if link_tag:
                featured_answer['Link'] = link_tag['href']
        
        allData = soup.find_all("div", {"class": "g"})
        Data = []

        for data in allData[:3]:
            result_data = {}
            title = data.find('h3', {"class": "DKV0Md"})
            link = data.find('a', href=True)
            if link:
                href = link['href']
                if href.startswith('https') and 'aclk' not in href:
                    result_data['title'] = title.text if title else None
                    result_data['link'] = href
                    Data.append(result_data)

        if not featured_answer and not Data:
            return {"error": "Recommended dates produced but not enough information was provided to the query to produce a specific date. Please select from the top 3 websites below instead."}

        return {"featured_answer": featured_answer, "top_websites": Data}
    
    return {"error": "Failed to fetch data from Google."}


# Processes query from input for both URL query and normal database query
def process_query(input_table, query):
    keywords = extract_keywords(query)
    if keywords:
        search_query = " ".join(keywords)
        results = scrape_websites_for_info(search_query)
        return None, None, results

    inputs = tokenizer(table=input_table, queries=[query], padding="max_length", truncation=True, return_tensors="pt")
    outputs = model(**inputs)
    return outputs, inputs, input_table

# Extraction of answer with proper formatting
def extract_answer(outputs, inputs, table):
    if outputs is None:
        return None

    predictions = tokenizer.convert_logits_to_predictions(inputs, outputs.logits.detach())
    predicted_answer_coordinates = predictions[0]

    answers = []
    for coordinates in predicted_answer_coordinates:
        for coord in coordinates:
            row, column = map(int, coord)
            answers.append((row, column))
    return answers

# SQL query with connection to MySQL Database
def read_data_from_db(host, user, password, database, port):
    try:
        connection = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database,
            port=port
        )
        query = """SELECT p.products_id, p.name AS product_name, p.eos_date, p.url, 
                          p.version_number, GROUP_CONCAT(h.hostname_name) AS all_hostnames, 
                          c.category_name, v.vendor_name 
                   FROM products p 
                   LEFT JOIN products_hostname ph ON p.products_id = ph.products_id 
                   LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id 
                   LEFT JOIN category c ON p.category_id = c.category_id 
                   LEFT JOIN vendor v ON p.vendor_id = v.vendor_id 
                   GROUP BY p.products_id, p.name, p.eos_date, p.url, p.version_number, c.category_name;"""
        df = pd.read_sql(query, connection)
        df['eos_date'] = pd.to_datetime(df['eos_date'], errors='coerce').dt.strftime('%d %B %Y')
        df = df.astype(str)
        return df
    except mysql.connector.Error as e:
        print("Error reading data from MySQL table:", e)
        return None
    finally:
        if connection.is_connected():
            connection.close()

# Load data from database at the start of the server
df = read_data_from_db(host, user, password, database, port)

'''
@app.route('/query', methods=['POST'])
def query():
    if df is None:
        return jsonify({"error": "Unable to read database table."}), 500

    input_query = request.json.get('query', '')
    if not input_query:
        return jsonify({"error": "Query is required."}), 400

    outputs, inputs, results = process_query(df, input_query)

    
    if not results:
        print("results not empty")
        if "error" in results:
            return jsonify({"error": results["error"]}), 400
        response = {}
        if "featured_answer" in results and "top_websites" in results:
            response["answer"] = []
            response["answer"].append(results["featured_answer"])
            response["answer"].append(results["top_websites"])
            return jsonify(response)

        if outputs is not None:
            answers = extract_answer(outputs, inputs, df)
            if answers:
                formatted_answers = []
                for row, column in answers:
                    product_name = df.iat[row, df.columns.get_loc('product_name')]
                    version = df.iat[row, df.columns.get_loc('version_number')]
                    eos_date = df.iat[row, df.columns.get_loc('eos_date')]
                    formatted_answers.append(f"{product_name} version {version}, EOS date: {eos_date}")
                return jsonify({"answer": formatted_answers})
            else:
                return jsonify({"answer": "No answer found."})
        else:
            return jsonify({"error": "Unable to process query."}), 500
'''
'''
@app.route('/query', methods=['POST'])
def query():
    if df is None:
        return jsonify({"error": "Unable to read database table."}), 500

    input_query = request.json.get('query', '')
    if not input_query:
        return jsonify({"error": "Query is required."}), 400

    outputs, inputs, results = process_query(df, input_query)

    if not results:
        return jsonify({"error": "No results found."}), 404

    if "error" in results:
        return jsonify({"error": results["error"]}), 400

    response = {}
    if "featured_answer" in results and "top_websites" in results:
        response["answer"] = []
        if "featured_answer" in results:
            response["answer"].append(results["featured_answer"])
        if "top_websites" in results:
            response["answer"].append(results["top_websites"])
        return jsonify(response)

    if outputs is not None:
        answers = extract_answer(outputs, inputs, df)
        if answers:
            formatted_answers = []
            for row, column in answers:
                product_name = df.iat[row, df.columns.get_loc('product_name')]
                version = df.iat[row, df.columns.get_loc('version_number')]
                eos_date = df.iat[row, df.columns.get_loc('eos_date')]
                formatted_answers.append(f"{product_name} version {version}, EOS date: {eos_date}")
            return jsonify({"answer": formatted_answers})
        else:
            return jsonify({"answer": "No answer found."})
    else:
        return jsonify({"error": "Unable to process query."}), 500
'''

@app.route('/query', methods=['POST'])
def query():
    
    if df is None:
        return jsonify({"error": "Unable to read database table."}), 500

    input_query = request.json.get('query', '')
    print(f"Input Query: {input_query}")
    if not input_query:
        return jsonify({"error": "Query is required."}), 400

    outputs, inputs, results = process_query(df, input_query)

    if isinstance(results, dict):
        if "error" in results:
            return jsonify({"error": results["error"]}), 400

        response = {}
        if "featured_answer" in results and "top_websites" in results:
            response["answer"] = ""
            if "Answer" in results["featured_answer"]:
                print("answer in result")
                response["answer"] += "Answer: " + results["featured_answer"]["Answer"] + "<br />"

            featured_answer = results["featured_answer"].get("Featured Answer")
            if featured_answer is not None:  # Check for NoneType explicitly
                print("featured in result")
                response["answer"] += "Featured Answer: " + str(featured_answer) + "<br />"  # Convert to string if necessary

            if "Link" in results["featured_answer"] and results["featured_answer"]["Link"]:
                response["answer"] += "Link: " + results["featured_answer"]["Link"] + "<br /><br /><br />"

            if "top_websites" in results:
                for website in results["top_websites"]:
                    response["answer"] += f"Top Websites: {website['title']} - {website['link']} <br />"

            # Remove trailing comma and space
            response["answer"] = response["answer"].rstrip(", ")

            return jsonify(response)

        else:
            return jsonify({"error": "No results found."}), 404

    elif isinstance(results, pd.DataFrame):
        if results.empty:
            return jsonify({"error": "No results found."}), 404

        response = {}
        if outputs is not None:
            answers = extract_answer(outputs, inputs, df)
            if answers:
                formatted_answers = []
                for row, column in answers:
                    product_name = df.iat[row, df.columns.get_loc('product_name')]
                    version = df.iat[row, df.columns.get_loc('version_number')]
                    # eos_date = df.iat[row, df.columns.get_loc('eos_date')]
                    the_ans = df.iat[row, column]
                    formatted_answers.append(f"{product_name} version {version}, Answer: {the_ans} <br /><br />")

                # Join formatted answers into a single string
                joined_answers = ", ".join(formatted_answers)
                return jsonify({"answer": joined_answers})
            else:
                return jsonify({"answer": "No answer found."})
        else:
            return jsonify({"error": "Unable to process query."}), 500


    else:
        return jsonify({"error": "Unexpected result type."}), 500

'''
@app.route('/getCSRFToken', methods=['GET'])
@csrf.exempt
def get_csrf_token():
    token = generate_csrf()
    return jsonify({'csrf_token': token})
'''

if __name__ == '__main__':
    app.run(debug=False)
