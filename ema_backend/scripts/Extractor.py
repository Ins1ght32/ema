import requests
from bs4 import BeautifulSoup
import pandas as pd
from io import StringIO
from Finder import Finder
import re
from dateutil import parser
from datetime import datetime
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
import tabula
# import json

class Extractor:
    def __init__(self):
        pass

    def extractHTMLTable(self, url):

        session = requests.Session()
        retry = Retry(connect=3, backoff_factor=0.5)
        adapter = HTTPAdapter(max_retries=retry)
        session.mount('https://', adapter)

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
            'Content-Type': 'text/html',
        }

        if (url == "https://help.sap.com/docs/SUPPORT_CONTENT/crystalreports/3354088411.html"):
            try:
                primary_url = "https://help.sap.com/http.svc/pagecontent?deliverableInfo=0&deliverable_id=30230609&file_path=3354088411.html&buildNo=33"
                response = requests.get(primary_url, headers=headers)
                response.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(f"Error retrieving {url}: {e}")
                return None

            if (response.text):
                dfs = []
                json_response = response.json()

                # response_dict = json.loads(json_response)

                body_content = json_response["data"]["body"]

                table_pattern = r'<table\b[^>]*>(.*?)</table>'

                table_content = re.findall(table_pattern, str(body_content), re.DOTALL)

                if not table_content:
                    print("SAP Table not found")
                    return None
                else:
                    for table in table_content:
                        table_html = str(table)
                        table_html_with_tag = f"<table>{table_html}</table>"
                        if (table_html_with_tag):
                            # print(table_html_with_tag)
                            df = pd.read_html(StringIO(str(table_html_with_tag)))[0]
                            # print(df)
                            if not df.empty:
                                dfs.append(df)
                return dfs
        elif (url == "https://docs.progress.com/bundle/whatsup-gold-life-cycle/page/WhatsUp-Gold-Life-Cycle_2.html"):
            try:
                primary_url = "https://progress-be-prod.zoominsoftware.io/api/bundle/whatsup-gold-life-cycle/page/WhatsUp-Gold-Life-Cycle_2.html"
                response = requests.get(primary_url, headers=headers)
                response.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(f"Error retrieving {url}: {e}")
                return None

            
            if (response.text):
                dfs = []
                json_response = response.json()

                # response_dict = json.loads(json_response)

                body_content = json_response["topic_html"]

                # print(body_content)

                table_pattern = r'<table\b[^>]*>(.*?)</table>'

                table_content = re.findall(table_pattern, str(body_content), re.DOTALL)

                if not table_content:
                    print("Table not found")
                    return None
                else:
                    for table in table_content:
                        table_html = str(table)
                        table_html_with_tag = f"<table>{table_html}</table>"
                        if (table_html_with_tag):
                            # print(table_html_with_tag)
                            df = pd.read_html(StringIO(str(table_html_with_tag)))[0]
                            # print(df)
                            if not df.empty:
                                dfs.append(df)
                return dfs
            
        else:
            try:
                response = requests.get(url, headers=headers)
                response.raise_for_status()
            except requests.exceptions.RequestException as e:
                print(f"Error retrieving {url}: {e}")
                return None

            if response.headers.get('Content-Type') == 'application/pdf':
                with open('document.pdf', 'wb') as f:
                    f.write(response.content)
                tables = tabula.read_pdf("document.pdf", pages='all', multiple_tables=True)
                return tables
            else:  
                if (response.text):
                    # extract table and return as dataframe
                    soup = BeautifulSoup(response.text, "html.parser")
                    tables = soup.find_all("table")
                    dfs = []

                    if not tables:
                        # print("sAP")
                        tables_within_scriptag = soup.find_all("script")
                        # print(tables_within_scriptag)
                        table_pattern = r'<table\b[^>]*>(.*?)</table>'
                        table_content = re.findall(table_pattern, str(tables_within_scriptag), re.DOTALL)
                        if not table_content:
                            return None
                        else:

                            table_html = str(table_content[0])
                            table_html_with_tag = f"<table>{table_html}</table>"
                            if (table_html_with_tag):
                                df = pd.read_html(StringIO(str(table_html_with_tag)))[0]
                                # print(df)
                                if not df.empty:
                                    dfs.append(df)
                    else:
                        for table in tables:
                            df = pd.read_html(StringIO(str(table)))[0]
                            # df = pd.read_html(StringIO(table.prettify()))[0]
                            if not df.empty:
                                dfs.append(df)
                            else:
                                # likely dynamically loaded content, need use selenium
                                return None
                    return dfs

    def is_pdf(self, url: str) -> bool:
        response = requests.head(url, allow_redirects=True)
        if response.headers.get('Content-Type') == 'application/pdf':
            return True
        return False
            
    def extract_dates(self, text):
    # Define regex patterns for date formats
        patterns = [
            r'\b\d{2}\d{2}\d{4}\b',  # ddmmyyyy
            r'\b\d{1,2}(?:st|nd|rd|th)?\s+\w+\s+\d{4}\b',  # ddth month year
            r'\b\w+\s+\d{1,2},\s+\d{4}\b',  # Month dd, yyyy
            r'\b\d{1,2}(?:st|nd|rd|th)?\s+of\s+\w+\s+\d{4}\b',  # ddth of month year
            r'\b\d{1,2}/\d{1,2}/\d{4}\b',  # mm/dd/yyyy
            r'\b\d{1,2}-\d{1,2}-\d{4}\b',  # mm-dd-yyyy
            r'\b\w+\s\d{1,2}\b,\s\d{4}',  # Month dd, yyyy (with comma)
            r'\b\d{4}-\d{2}-\d{2}\b',  # yyyy-mm-dd
        ]

        dates = []
        for pattern in patterns:
            matches = re.findall(pattern, text)
            for match in matches:
                try:
                    date = parser.parse(match, fuzzy=True)
                    dates.append(date)
                except ValueError:
                    pass
        return dates
        
    def extractText(self, url):
        session = requests.Session()
        retry = Retry(connect=3, backoff_factor=0.5)
        adapter = HTTPAdapter(max_retries=retry)
        session.mount('https://', adapter)

        try:
            response = requests.get(url)
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Error retrieving {url}: {e}")
            return None
        
        if (response.text):
            # Send a GET request to the URL
            response = requests.get(url)

            # Check if the request was successful
            if response.status_code != 200:
                print(f"Failed to retrieve the webpage. Status code: {response.status_code}")
                return None

            # Parse the HTML content
            soup = BeautifulSoup(response.content, 'html.parser')

            # Initialize relevant_text variable
            relevant_text = ""

            # Try to find specific divs that might contain the relevant information
            content_divs = ['content', 'main', 'article', 'post']
            for div_id in content_divs:
                content_div = soup.find('div', {'id': div_id})
                if content_div:
                    for tag in content_div.find_all(['p', 'span', 'div']):
                        if any(keyword in tag.get_text().lower() for keyword in ["end of life", "end of support", "end-of-life", "end-of-support"]):
                            relevant_text = tag.get_text()
                            break
                if relevant_text:
                    break

            # If no specific div was found, search in all relevant tags
            if not relevant_text:
                for tag in soup.find_all(['div', 'p', 'span']):
                    if any(keyword in tag.get_text().lower() for keyword in ["end of life", "end of support", "end-of-life", "end-of-support"]):
                        relevant_text = tag.get_text()
                        break

            if not relevant_text:
                return None

            # Extract dates from the relevant text
            dates = self.extract_dates(relevant_text)

            if not dates:
                print("No dates found in the relevant text.")
                return None

            # Assume the relevant date is the one closest to today
            end_of_support_date = min(dates, key=lambda d: abs(d - datetime.now()))

            return end_of_support_date
        
    '''
    def extract_eos_data(self, dfs, software_version, eos_keywords):
        eos_data = []
        for df in dfs:
            # find row with correct software version
            version_row = df.apply(lambda row: row.astype(str).str.contains(software_version, case=False).any(), axis = 1)
            if version_row.any():
                row_idx = version_row.idxmax()
                row = df.iloc[row_idx]
                
                finder = Finder()
                # check if first row is column name or not
                if (df.iloc[0].apply(lambda x: pd.api.types.is_numeric_dtype(type(x))).any()):
                    pass
                else:
                    df.columns = df.iloc[0]
                    # print(f"df.columns: {df.columns}")
                    df = df[1:]
                    df = df.reset_index(drop=True)
                    
                eos_column = finder.find_eos_column(df.columns, eos_keywords)
                if eos_column:
                    eos_date_text = row[df.columns.get_loc(eos_column)]
                    eos_data.append((software_version, eos_column, eos_date_text))
        return eos_data
    '''