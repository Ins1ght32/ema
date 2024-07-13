import requests
from Finder import Finder
from Extractor import Extractor
import pandas as pd
import re
import time
import xml.etree.ElementTree as ET
from datetime import datetime, date
from dateutil import parser
import json

class Crawler:
    def __init__(self):
        self.eolurl = "https://endoflife.date/api/"

    def eolAPICall(self, data):
        return_results = []
        print(data)
        for item in data:
            print(f"Crawling for: {item.get('name')} {item.get('versionNumber')}")
            if (item.get("mapped") == "yes"):
                # found inside endoflife.date site
                simpleName = item.get("simpleName")
                versionNumber = item.get("versionNumber")
                numeric_version = ''.join(re.findall(r'[0-9.]+', versionNumber))
                while numeric_version:
                    url = f"{self.eolurl}{simpleName}/{numeric_version}.json"

                    response = requests.get(url)

                    if response.status_code == 200:
                        # print(response.json())
                        response_data = response.json()
                        response_data["name"] = item.get("name")
                        response_data["id"] = item.get("id")
                        # return_results.append(response_data)

                        # secondary check with external link here
                        if item.get("url") is None:
                            response_data["contains_primary_source"] = "3"
                            return_results.append(response_data)
                            break
                        else:
                            extractor = Extractor()
                            dfs = extractor.extractHTMLTable(item.get("url"))
                            if (dfs):

                                name = item.get("name")
                                eos_keywords = ["end of life", "eol date", "end-of-life support", "discontinuation date", "support end date", "product retirement", "service end date", "lifecycle end date", "termination date", "end of support", "eos date", "end-of-service date", "last support date", "support termination date", "end-of-sale date", "end of service life", "support sunset date", "service withdrawal date", "obsolescence date", "maintenance end date", "end of maintenance", "final support date", "retirement date", "sunset date", "decommission date", "service end", "last ship date", "final availability date", "product sunset date", "support expiry date", "extended end date", "end of availability", "mainstream end date", "support level change date", "end-of-sale", "eosl date", "last date of support", "final release", "End-of-Sale Date", "retired", "deprecated"]
                                
                                secondary_check_result = self.crawl_eos_data(dfs, versionNumber, eos_keywords, name)
                                print(f"secondary check result: {secondary_check_result}")

                                
                                if (secondary_check_result):
                                    crawling_for = f"{item.get('name')} {item.get('versionNumber')}"
                                    print(f"Crawling_for  in secondary_check: {crawling_for}")
                                    crawled_product_name = secondary_check_result[0].get("crawled_product_name")
                                    print(f"Crawled_product_name in secondary_check: {crawled_product_name}")
                                    if crawled_product_name in crawling_for:
                                        print(f"CRAWLED_PRODUCT_NAME IN CRAWLING_FOR: {item.get('name')}")
                                        pass
                                    # if ((secondary_check_result[0].get("crawled_product_name") not in str(item.get("name"))) or (secondary_check_result[0].get("crawled_product_name") not in str(item.get("versionNumber")))):
                                    # if secondary_check_result[0].get("crawled_product_name") in str(item.get("name")) or secondary_check_result[0].get("crawled_product_name") in str(item.get("versionNumber")):
                                        # pass
                                    else:
                                        print(f"WRONG URL: {item.get('name')}")
                                        # wrong URL/different product but found in endoflife.date
                                        temp_response_data = response_data
                                        # temp_response_data["eol"] = secondary_check_result_date
                                        temp_response_data["contains_primary_source"] = "2"
                                        return_results.append(temp_response_data)
                                        break
                                

                                primary_check_result_date = parser.parse(response_data["eol"], default=datetime(2024, 1, 1))

                                if (response_data["eol"] == False):
                                    # endoflife.date still supported but no dates
                                    primary_check_result_date = parser.parse("9999-12-31", default=datetime(2024, 1, 1))

                                secondary_check_result_date = parser.parse(secondary_check_result[0].get("eol"), default=datetime(2024, 1, 1))
                                # print(f"secondary_check_result_date: {secondary_check_result_date}")
                                if (primary_check_result_date != secondary_check_result_date):
                                    # print("dates not equal")
                                    temp_response_data = response_data
                                    temp_response_data["eol"] = secondary_check_result_date
                                    temp_response_data["contains_primary_source"] = "1_no"
                                    return_results.append(temp_response_data)
                                    break
                                elif (primary_check_result_date == secondary_check_result_date):
                                    # print("dates equal")
                                    temp_response_data = response_data
                                    response_data["contains_primary_source"] = "1_yes"
                                    temp_response_data["contains_primary_source"] = "1_yes"
                                    return_results.append(response_data)
                                    break

                                break
                            else:
                                # extract text for secondary check
                                text_data = extractor.extractText(item.get("url"))
                                # print(f"Text_data: {text_data}")

                                if (text_data):
                                    print(f"TEXT DATA: {text_data}")
                                    software_version = item.get("versionNumber")
                                    name = item.get("name")
                                    id = item.get("id")
                                    eos_crawled_data = {"versionNumber": software_version, "eos_column": None, "eol": text_data, "name": name, "id": id, "contains_primary_source": "1_yes"}
                                    return_results.append(eos_crawled_data)
                                    break
                                else:
                                    print(f"TEXT DATA IN ELSE BLOCK: {text_data}")
                                    software_version = item.get("versionNumber")
                                    name = item.get("name")
                                    id = item.get("id")
                                    eos_crawled_data = {"versionNumber": software_version, "eos_column": None, "eol": response_data["eol"], "name": name, "id": id, "contains_primary_source": "2"}
                                    return_results.append(eos_crawled_data)
                                    break

                    else:
                        numeric_version = numeric_version[:-1]
                        # print(f"Error for {simpleName} {versionNumber}: {response.status_code}")
                
                if not numeric_version and item.get("url") is not None:
                    # maybe wrong formatting in endoflife.date
                    # print(f"Error for {simpleName} {versionNumber}: {response.status_code}")
                    extractor = Extractor()
                    dfs = extractor.extractHTMLTable(item.get("url"))

                    # print(dfs)
                    if (dfs):
                        name = item.get("name")
                        id = item.get("id")
                        version = item.get("versionNumber")

                        eos_keywords = ["end of life", "eol date", "end-of-life support", "discontinuation date", "support end date", "product retirement", "service end date", "lifecycle end date", "termination date", "end of support", "eos date", "end-of-service date", "last support date", "support termination date", "end-of-sale date", "end of service life", "support sunset date", "service withdrawal date", "obsolescence date", "maintenance end date", "end of maintenance", "final support date", "retirement date", "sunset date", "decommission date", "service end", "last ship date", "final availability date", "product sunset date", "support expiry date", "extended end date", "end of availability", "mainstream end date", "support level change date", "end-of-sale", "eosl date", "last date of support", "final release", "End-of-Sale Date", "retired", "deprecated"]

                        eos_crawled_data = self.crawl_eos_data(dfs, version, eos_keywords, name)

                        # eos_crawled_data.append(self.crawl_eos_data(dfs, version, eos_keywords))
                        # print(f"Eos_crawled_data: {eos_crawled_data}")

                        if (eos_crawled_data):
                            print(f"EOS CRAWLED DATA {name}: {eos_crawled_data}")
                            # check whether data matches with actual given product
                            crawling_for = f"{item.get('name')} {item.get('versionNumber')}"
                            crawled_product_name = eos_crawled_data[0].get("crawled_product_name")
                            if (crawled_product_name):
                                list_crawled_product_names = [name.strip() for name in crawled_product_name.split(',')]
                            if (crawled_product_name):
                                if (crawled_product_name.lower() in crawling_for.lower()) or (crawling_for.lower() in crawled_product_name.lower() or crawling_for.lower() in name.lower() for name in list_crawled_product_names):
                                    # matches
                                    print(f"{item.get('name')} matches?")
                                    for item in eos_crawled_data:
                                        item["name"] = name
                                        item["id"] = id
                                        item["contains_primary_source"] = "3"
                                        return_results.append(item)
                                else:
                                    # dont match
                                    for item in eos_crawled_data:
                                        item["name"] = name
                                        item["id"] = id
                                        item["eol"] = None
                                        item["contains_primary_source"] = "4"
                                        return_results.append(item)
                            else:
                                # Likely Cisco Use Case
                                for item in eos_crawled_data:
                                    item["name"] = name
                                    item["id"] = id
                                    item["contains_primary_source"] = "3"
                                    return_results.append(item)


                        else:
                            # cannot get EOL data
                            item["name"] = name
                            item["id"] = id
                            item["eol"] = None
                            item["contains_primary_source"] = "4"
                            print(item)
                            return_results.append(item)

                    else:
                        # crawl using text instead of table (no tables found)
                        # print(item.get("name"))
                        # print(f'PUTTY??? item.get("name")')
                        text_data = extractor.extractText(item.get("url"))
                        print("HOW MANY TIMESS")
                        # print(f"Text_data: {text_data}")

                        if (text_data):
                            # print('I HAVE TEXT DATA')
                            software_version = item.get("versionNumber")
                            name = item.get("name")
                            id = item.get("id")
                            eos_crawled_data = {"versionNumber": software_version, "eos_column": None, "eol": text_data, "name": name, "id": id, "contains_primary_source": "3"}
                            return_results.append(eos_crawled_data)
                            # break
                        else:
                            # print('I DONT HAVE TEXT DATA')
                            software_version = item.get("versionNumber")
                            name = item.get("name")
                            id = item.get("id")
                            eos_crawled_data = {"versionNumber": software_version, "eos_column": None, "eol": None, "name": name, "id": id, "contains_primary_source": "4"}
                            return_results.append(eos_crawled_data)
                            # break

            else:
                if any(name in item.get("name") for name in ["SAS", "Microfocus", "Veritas"]):
                    if ("SAS" in item.get("name") or item.get("name") in "SAS"):
                        versionNumber = item.get("versionNumber")
                        eos_data = self.static_crawl(item, versionNumber, item.get("name"), "SAS")

                        for item in eos_data:
                            item["contains_primary_source"] = "3"
                            return_results.append(item)

                    elif ("Microfocus" in item.get("name") or item.get("name") in "Microfocus"):
                        versionNumber = item.get("versionNumber")
                        eos_data = self.static_crawl(item, versionNumber, item.get("name"), "Microfocus")

                        for item in eos_data:
                            item["contains_primary_source"] = "3"
                            return_results.append(item)
                            
                    elif ("Veritas" in item.get("name") or item.get("name") in "Veritas"):
                        versionNumber = item.get("versionNumber")
                        eos_data = self.static_crawl(item, versionNumber, item.get("name"), "Veritas")

                        for item in eos_data:
                            item["contains_primary_source"] = "3"
                            return_results.append(item)
                else:
                    # Not found in endoflife.date site
                    # print(f"ID: {item.get('id')}, Name: {item.get('name')}")

                    if item.get("url") is None:
                        software_version = item.get("versionNumber")
                        name = item.get("name")
                        id = item.get("id")
                        eos_crawled_data = {"versionNumber": software_version, "eos_column": None, "eol": None, "name": name, "id": id, "contains_primary_source": "4"}
                        return_results.append(eos_crawled_data)
                    else:
                        extractor = Extractor()
                        dfs = extractor.extractHTMLTable(item.get("url"))

                        # print(dfs)
                        if (dfs):
                            name = item.get("name")
                            id = item.get("id")
                            version = item.get("versionNumber")

                            eos_keywords = ["end of life", "eol date", "end-of-life support", "discontinuation date", "support end date", "product retirement", "service end date", "lifecycle end date", "termination date", "end of support", "eos date", "end-of-service date", "last support date", "support termination date", "end-of-sale date", "end of service life", "support sunset date", "service withdrawal date", "obsolescence date", "maintenance end date", "end of maintenance", "final support date", "retirement date", "sunset date", "decommission date", "service end", "last ship date", "final availability date", "product sunset date", "support expiry date", "extended end date", "end of availability", "mainstream end date", "support level change date", "end-of-sale", "eosl date", "last date of support", "final release", "End-of-Sale Date", "retired", "deprecated"]

                            eos_crawled_data = self.crawl_eos_data(dfs, version, eos_keywords, name)

                            # eos_crawled_data.append(self.crawl_eos_data(dfs, version, eos_keywords))
                            # print(f"Eos_crawled_data: {eos_crawled_data}")

                            if (eos_crawled_data):
                                # check whether data matches with actual given product
                                print(f"EOS CRAWLED DATA {name}: {eos_crawled_data}")
                                crawling_for = f"{item.get('name')} {item.get('versionNumber')}"
                                crawled_product_name = eos_crawled_data[0].get("crawled_product_name")
                                if (crawled_product_name):
                                    list_crawled_product_names = [name.strip() for name in crawled_product_name.split(',')]
                                if (crawled_product_name):
                                    if (crawled_product_name.lower() in crawling_for.lower()) or (crawling_for.lower() in crawled_product_name.lower() or crawling_for.lower() in name.lower() for name in list_crawled_product_names):
                                        # matches
                                        print(f"{item.get('name')} matches?")
                                        for item in eos_crawled_data:
                                            item["name"] = name
                                            item["id"] = id
                                            item["contains_primary_source"] = "3"
                                            return_results.append(item)
                                    else:
                                        # dont match
                                        for item in eos_crawled_data:
                                            item["name"] = name
                                            item["id"] = id
                                            item["eol"] = None
                                            item["contains_primary_source"] = "4"
                                            return_results.append(item)
                                else:
                                    # Likely Cisco Use Case
                                    for item in eos_crawled_data:
                                        item["name"] = name
                                        item["id"] = id
                                        item["contains_primary_source"] = "3"
                                        return_results.append(item)


                            else:
                                # cannot get EOL data
                                item["name"] = name
                                item["id"] = id
                                item["eol"] = None
                                item["contains_primary_source"] = "4"
                                print(item)
                                return_results.append(item)

                        else:
                            # crawl using text instead of table (no tables found)
                            # print(item.get("name"))
                            # print(f'PUTTY??? item.get("name")')
                            text_data = extractor.extractText(item.get("url"))
                            print("HOW MANY TIMESS")
                            # print(f"Text_data: {text_data}")

                            if (text_data):
                                # print('I HAVE TEXT DATA')
                                software_version = item.get("versionNumber")
                                name = item.get("name")
                                id = item.get("id")
                                eos_crawled_data = {"versionNumber": software_version, "eos_column": None, "eol": text_data, "name": name, "id": id, "contains_primary_source": "3"}
                                return_results.append(eos_crawled_data)
                                # break
                            else:
                                # print('I DONT HAVE TEXT DATA')
                                software_version = item.get("versionNumber")
                                name = item.get("name")
                                id = item.get("id")
                                eos_crawled_data = {"versionNumber": software_version, "eos_column": None, "eol": None, "name": name, "id": id, "contains_primary_source": "4"}
                                return_results.append(eos_crawled_data)
                                # break


                # print(f"Return results: {return_results}")            
        return return_results

    def remove_whitespace(self, row):
        return row.astype(str).str.replace('\s+', '', regex=True)
        # return row.apply(lambda x: str(x).replace('\s+', '', regex=True))

    def crawl_eos_data(self, dfs, software_version, eos_keywords, item_name):
        eos_data = []
        # print(dfs)
        found_row = 0
        for df in dfs:
            # print(df)
            if (item_name != "Cisco"):
                # print("HPE WTFFF")
                df_remove_whitespace = df.apply(self.remove_whitespace, axis=1)
                # df = df.apply(self.remove_whitespace, axis=1)
                software_version_no_whitespace = ''.join(software_version.split())
                # print(f"Software version: {software_version_no_whitespace}")
                # find row with correct software version
                # must match exact, version number with the row, if not may return multiple results.
                # version_row = df.apply(lambda row: row.astype(str).str.contains(software_version, case=False).any(), axis = 1)
                df_cleaned = df_remove_whitespace.apply(lambda row: row.astype(str).str.strip(), axis=1)
                # print(df_cleaned)
                version_row = df_cleaned.apply(lambda row: row.astype(str).str.contains(software_version_no_whitespace, case=False, regex=False).any(), axis=1)
                
                # print(version_row)
                if version_row.any():
                    found_row = 1
                    # print(df)
                    # print(f"version_row: {version_row}")
                    # print("Row found")
                    row_idx = version_row.idxmax()
                    row = df.iloc[row_idx]
                    # print(f"{software_version_no_whitespace}:{row}")

                    crawled_product_name = str(df.iloc[row_idx, 0])
                    print(f"Crawled product name: {crawled_product_name}")

                    finder = Finder()
                    # check if first row is column name or not
                    #if (df.iloc[0].apply(lambda x: pd.api.types.is_numeric_dtype(type(x))).any() or len(df) == 1 or df.shape[0] > 0):
                    #    pass

                    # check if column names are not correct.
                    if (df.columns.dtype == 'int64'):
                        df.columns = df.iloc[0]
                        df = df[1:]
                        df =  df.reset_index(drop=True)
                    if (len(df) == 1 or df.shape[0] > 0):
                        # print(f"len of df: {len(df)}, df.shape[0]: {df.shape[0]}")
                        pass
                    else:
                        if ("SAP Crystal" in item_name or item_name in "SAP Crystal"):
                            pass
                        else:
                            df.columns = df.iloc[0]
                            df = df[1:]
                            df =  df.reset_index(drop=True)
                            pass
                    # print(df.columns)
                    # print(df)
                    eos_column = finder.find_eos_column(df.columns, eos_keywords)
                    if eos_column:
                        # print(eos_column)
                        # eos_date_text = row[df.columns.get_loc(eos_column)]
                        eos_date_text = row.iloc[df.columns.get_loc(eos_column)]
                        # print(eos_date_text)
                        eos_data.append({"crawled_product_name": crawled_product_name, "versionNumber": software_version, "eos_column": eos_column, "eol": eos_date_text, "contain_primary_source": "Yes"})
                        break           
                
            else:
                # not_cisco = 0
                # df = dfs[0]
                # Cisco Use Case, their table flip
                # print("Cisco Use Case")
                # print(f"Pls work: {item.get('name')}")
                df_transposed = df.T
                df_transposed.columns = df_transposed.iloc[0]
                df_transposed = df_transposed[1:]
                # print(f"DF_TRANSPOSED: {df_transposed}")

                finder = Finder()
                # print(df_transposed.columns)
                eos_column = finder.find_eos_column(df_transposed.columns, eos_keywords)
                if eos_column:
                    eos_date_text = df_transposed.iloc[-1][eos_column]
                    # print(eos_date_text)
                    eos_data.append({"versionNumber": software_version, "eos_column": eos_column, "eol": eos_date_text, "contain_primary_source": "Yes"})

        if (found_row == 0):
            for df in dfs:
                df_transposed = df.T
                df_transposed.columns = df_transposed.iloc[0]
                df_transposed = df_transposed[1:]
                print(f"DF_TRANSPOSED: {df_transposed}")
                finder = Finder()
                # print(df_transposed.columns)
                eos_column = finder.find_eos_column(df_transposed.columns, eos_keywords)
                if eos_column:
                    eos_date_text = df_transposed.iloc[-1][eos_column]
                    # print(eos_date_text)
                    eos_data.append({"versionNumber": software_version, "eos_column": eos_column, "eol": eos_date_text, "contain_primary_source": "Yes"})
                    break

        return eos_data

    
    def detect_transpose_needed(self, df):
        if df.shape[1] > df.shape[0]:
            print("df.shape[1] > df.shape[0]")
            return True
        else:
            print("detect transposed needed else")
            first_row = df.iloc[0]
            first_col = df.iloc[:, 0]
            
            # Check if first row is not typical header names
            if first_row.apply(lambda x: isinstance(x, (int, float)) or x.isnumeric()).mean() > 0.5:
                print("first row true")
                return True
            
            # Check if first column contains typical header names
            if first_col.apply(lambda x: isinstance(x, str) and x.isalpha()).mean() > 0.5:
                print("first column true")
                return True
        print("returning false")
        return False
    
    def static_crawl(self, item, software_version, item_name, product_name):
        eos_data = []
        software_item, version_prod_release = software_version.rsplit(' ', 1)
        software_item_with_sas = f"SAS {software_item}"
        # print(f"Software Name: {software_item}")
        # print(f"Software Version: {version_prod_release}")
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"}
        if product_name == "SAS":
            # Get current Unix timestamp in seconds
            timestamp_seconds = int(time.time())

            # Convert seconds to milliseconds
            timestamp_milliseconds = timestamp_seconds * 1000
            url = f"https://support.sas.com/techsup/Product_Support_Levels.json?_={timestamp_milliseconds}"

            try:
                response = requests.get(url, headers=headers)

                if response.status_code == 200:
                    print("GOOD RESPONSE")
                    json_response = response.json()

                    for product in json_response:
                        # print(product['LONG_LEGAL_NM_RU'])
                        # print(software_item)
                        if (product['LONG_LEGAL_NM_RU'].lower() == software_item_with_sas.lower() or product['LONG_LEGAL_NM_RU'].lower() == software_item.lower()):
                            versions = product['Versions']
                            if (versions):
                                for version in versions:
                                    if version['PROD_RELEASE'] == version_prod_release:
                                        eos_date = version['SUPPORT_STATUS_CHANGE']
                                        name = item.get("name")
                                        id = item.get("id")
                                        item["name"] = name
                                        item["id"] = id
                                        eos_data.append({"versionNumber": software_version, "eos_column": 'SUPPORT_STATUS_CHANGE', "eol": eos_date, "name": name, "id": id})
                                        print(f"SAS EOS DATA {eos_data}")
                                        return eos_data
                else:
                    print(f"Failed to retrieve data. Status code: {response.status_code}")

            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {e}")
        
        if product_name == "Microfocus":
            url = "http://www.microfocus.com/productlifecycle/lifecycle_list_search.jsp?list=0&attachmate=true&netiq=true&novell=true&suse=false"

            try:
                # Send GET request
                response = requests.get(url, headers=headers, allow_redirects=True)
                
                # Check if request was successful (status code 200)
                if response.status_code == 200:
                    # Print response data
                    root = ET.fromstring(response.text)

                    for product in root.findall('product'):
                        if (product.get('name') in software_version or software_version in product.get('name')):
                            prod_id = product.get('prod_id')
                            # print(prod_id)
                            children_url = f"http://www.microfocus.com/productlifecycle/lifecycle_subrows.jsp?lt_id={prod_id}&parent_ids={prod_id}"
                            # print(children_url)

                            try:
                                response = requests.get(children_url, headers=headers, allow_redirects=True)

                                if (response.status_code == 200):
                                    root = ET.fromstring(response.text)

                                    for product in root.findall('product'):
                                        if (product.get('service_pack') == software_version):
                                            committed_ends = product.get('Committed_ends')
                                            eos_date = committed_ends
                                            name = item.get("name")
                                            id = item.get("id")
                                            item["name"] = name
                                            item["id"] = id
                                            eos_data.append({"versionNumber": software_version, "eos_column": 'SUPPORT_STATUS_CHANGE', "eol": eos_date, "name": name, "id": id})
                                            # print(eos_data)
                                            return eos_data
                                    # print(response.text)
                                else:
                                    print(f"Failed to retrieve data. Status code: {response.status_code}")

                            except requests.exceptions.RequestException as e:
                                print(f"An error occurred: {e}")
                            break
                else:
                    print(f"Failed to retrieve data. Status code: {response.status_code}")

            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {e}")

        if product_name == "Veritas":
            print("I AM VERITAS")
            primary_url = "https://www.veritas.com/bin/support/eoslservlet?action_type=ROSETTA_PRODUCTS"
            try:
                print("GOOD")
                print(f"SOFTWARE VERSION: {software_version}")

                response = requests.get(primary_url, headers=headers)

                if response.status_code == 200:
                    json_response = response.json()

                    for product in json_response:
                        if (product["p1"] in software_version or software_version in product["p1"]):
                            p1_id = product["p1_id"]
                            if (p1_id):
                                secondary_url = f"https://www.veritas.com/bin/support/eoslservlet?action_type=ROSETTA_VERSIONS&product_value={p1_id}"

                                try:
                                    response = requests.get(secondary_url, headers=headers)

                                    if response.status_code == 200:
                                        json_response = response.json()

                                        for product in json_response:
                                            for version in product:
                                                if ((version["p2_name"] in software_version or software_version in version["p2_name"]) and (version["name"] in software_version or software_version in version["name"])):
                                                    eos_date = version["eosl"]
                                                    if eos_date == None:
                                                        eos_date = date(9999, 12, 31)
                                                    name = item.get("name")
                                                    id = item.get("id")
                                                    item["name"] = name
                                                    item["id"] = id
                                                    print(eos_date)
                                                    eos_data.append({"versionNumber": software_version, "eos_column": 'eosl', "eol": eos_date, "name": name, "id": id})  
                                                    return eos_data
                                except requests.exceptions.RequestException as e:
                                    print(f"An error occurred: {e}")
            except requests.exceptions.RequestException as e:
                print(f"An error occured: {e}")

                                            








            

                
