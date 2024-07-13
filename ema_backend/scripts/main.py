import pandas as pd
from io import StringIO
from Extractor import Extractor
from Finder import Finder
from Database import Database
from Crawler import Crawler
from Mapper import Mapper
import json
import sys
import argparse



if __name__ == "__main__":
    # url = "https://www.cloudera.com/services-and-support/support-lifecycle-policy.html"
    # software_version = "CDF-CEM 1.6"
    # extractor = Extractor()
    # dfs = extractor.extractHTMLTable(url)

    CLI=argparse.ArgumentParser()
    CLI.add_argument(
    "--ids",  # name on the CLI - drop the `--` for positional/required parameters
    nargs="*",  # 0 or more values expected => creates a list
    type=int,
    default=[-1],  # default if nothing is provided
    )

    args = CLI.parse_args()

    if args.ids[0] == -1:
        print("CRAWL ALL INVOKED")
        eos_keywords = ["end of life", "eol date", "end-of-life support", "discontinuation date", "support end date", "product retirement", "service end date", "lifecycle end date", "termination date", "end of support", "eos date", "end-of-service date", "last support date", "support termination date", "end-of-sale date", "end of service life", "support sunset date", "service withdrawal date", "obsolescence date", "maintenance end date", "end of maintenance", "final support date", "retirement date", "sunset date", "decommission date", "service end", "last ship date", "final availability date", "product sunset date", "support expiry date", "extended end date", "end of availability"]


            
        
        with open("dbconfig.json", "r") as dbconf:
            config = json.load(dbconf)
        
        
        # uncomment this block when using with frontend
        
        database = Database(config["server"], config["username"], config["password"], config["db"], config["port"])
        database.connect()
        db_results = database.selectAll()
        # print(db_results)
        name_results = []
        for i in range(len(db_results)):
            name_results.append({"id": db_results[i][0], "name" : db_results[i][1], "versionNumber": db_results[i][7], "url" : db_results[i][3]})
        
        # name_results.append({"id": 99, "name": "Cisco", "versionNumber": "c9500-48y4c", "url": "https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-9500-series-switches/c9500-12q-c9500-24q-c9500-40x-eol.html"})
        # name_results.append({"id": 999, "name": "Palo Alto", "versionNumber": "PA-3050", "url": "https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates"})
        # name_results.append({"id": 998, "name": "Product ABC", "versionNumber": "2022", "url": "https://learn.microsoft.com/en-us/lifecycle/products/windows-server-2022"})
        # name_results.append({"id": 1000, "name": "Product DEF", "versionNumber": "2023", "url": "https://fake-link.com"})
        # name_results.append({"id": 9999, "name": "SAP", "versionNumber": "SAP Crystal Reports 2013", "url": "https://help.sap.com/docs/SUPPORT_CONTENT/crystalreports/3354088411.html"})
        # name_results.append({"id": "9999", "name": "Whatsup", "versionNumber": "20.0", "url": "https://docs.progress.com/bundle/whatsup-gold-life-cycle/page/WhatsUp-Gold-Life-Cycle_2.html"})
        # print(f"Name Result: {name_results}")

        mapper = Mapper()
        # mapped_results = mapper.mapToSimpleName(sampleDataReal)
        # use this (line 87) ^ line 89 is for testing
        mapped_results = mapper.mapToSimpleName(name_results)

        # print(f"Mapped Results: {mapped_results}")
        
        crawler = Crawler()
        crawler_results =  crawler.eolAPICall(mapped_results)

        print(f"Crawler Results: {crawler_results}")

        # uncomment this block to update the DB, for use with frontend
        # can rename database.test to database.prepare
        database.test(crawler_results)
        database.updateEOS(crawler_results)
        database.updateTime()
        database.close()

    else:

        with open("dbconfig.json", "r") as dbconf:
            config = json.load(dbconf)
        
        
        # uncomment this block when using with frontend
        
        database = Database(config["server"], config["username"], config["password"], config["db"], config["port"])
        database.connect()
        db_results = database.selectAll(data = args.ids)

        name_results = []
        for i in range(len(db_results)):
            name_results.append({"id": db_results[i][0], "name" : db_results[i][1], "versionNumber": db_results[i][7], "url" : db_results[i][3]})
        
        # name_results.append({"id": 99, "name": "Cisco", "versionNumber": "c9500-48y4c", "url": "https://www.cisco.com/c/en/us/products/collateral/switches/catalyst-9500-series-switches/c9500-12q-c9500-24q-c9500-40x-eol.html"})
        # name_results.append({"id": 999, "name": "Palo Alto", "versionNumber": "PA-3050", "url": "https://www.paloaltonetworks.com/services/support/end-of-life-announcements/hardware-end-of-life-dates"})
        # name_results.append({"id": 998, "name": "Product ABC", "versionNumber": "2022", "url": "https://learn.microsoft.com/en-us/lifecycle/products/windows-server-2022"})
        # name_results.append({"id": 1000, "name": "Product DEF", "versionNumber": "2023", "url": "https://fake-link.com"})
        # name_results.append({"id": 9999, "name": "SAP", "versionNumber": "SAP Crystal Reports 2013", "url": "https://help.sap.com/docs/SUPPORT_CONTENT/crystalreports/3354088411.html"})
        # name_results.append({"id": "9999", "name": "Whatsup", "versionNumber": "20.0", "url": "https://docs.progress.com/bundle/whatsup-gold-life-cycle/page/WhatsUp-Gold-Life-Cycle_2.html"})
        # print(f"Name Result: {name_results}")

        mapper = Mapper()
        # mapped_results = mapper.mapToSimpleName(sampleDataReal)
        # use this (line 87) ^ line 89 is for testing
        mapped_results = mapper.mapToSimpleName(name_results)

        # print(f"Mapped Results: {mapped_results}")
        
        crawler = Crawler()
        crawler_results =  crawler.eolAPICall(mapped_results)

        print(f"Crawler Results: {crawler_results}")

        # uncomment this block to update the DB, for use with frontend
        # can rename database.test to database.prepare
        database.test(crawler_results)
        database.updateEOS(crawler_results)
        database.close()

    '''
    sampleDataReal = [
        {"name": "Chef Infra Server", "versionNumber": "14"},
        {"name": "Linux Mint", "versionNumber": "21"},
        {"name": "nginx", "versionNumber": "1.27"},
        {"name": "Cloudera", "versionNumber": "CDV 7.1", "url": "https://www.cloudera.com/services-and-support/support-lifecycle-policy.html"},
        {"name": "Microsoft Server", "versionNumber": "2022", "url": "https://learn.microsoft.com/en-us/lifecycle/products/windows-server-2022"},
        {"name": "Kibana", "versionNumber": "8", "url": "https://www.elastic.co/support/eol"},
        {"name": "django1", "versionNumber": "5.0", "url": "https://www.djangoproject.com/download"},
        {"name": "Trend Micro Deep Discovery", "versionNumber": "6.6", "url": "https://success.trendmicro.com/dcx/s/solution/1105726-supported-trend-micro-products-versions?language=en_US"},
        {"name": "IBM File", "versionNumber": "FileNet Image Manager Active Edition 4.5.x", "url": "https://www.ibm.com/support/pages/end-support-information-ibm-enterprise-content-management-ecm-products"},
        {"name": "SAP", "versionNumber": "SAP Crystal Server 2020 (Windows)", "url": "https://pages.community.sap.com/topics/crystal-reports"},
        {"name": "SAS Metadata Server", "versionNumber": "9.4_M7", "url": "https://support.sas.com/en/technical-support/support-levels.html"},
        {"name": "Microfocus", "versionNumber": "Reflection for Secure IT Server for Windows 8.4", "url": "https://www.microfocus.com/productlifecycle/"},
        {"name": "Tectia", "versionNumber": "6.6", "url": "https://www.ssh.com/products/support/end-of-support"},
        {"name": "Red Hat Enterprise Linux", "versionNumber": "7.9", "url": "https://stackoverflow.com/questions/50450655/selenium-reading-xhr-response"},
        {"name": "sqltexttest", "versionNumber": "3.2", "url": "https://lists.fedoraproject.org/archives/list/announce@lists.fedoraproject.org/thread/3QE22ILC7EBM6EISHD3HR2S4DFRO7AJL/"},
        {"name": "Veritas", "versionNumber": "NetBackup & Alta Data Protection Database Agents 8.3.0.2", "url": "https://www.veritas.com/support/en_US/eosl"},
        {"name": "Symantec", "versionNumber": "14.3", "url": "https://knowledge.broadcom.com/external/article/263064/changes-in-service-and-support-for-syman.html"},
        {"name": "111111", "versionNumber": "Windows Server 2012 R2", "url": "https://learn.microsoft.com/en-us/lifecycle/products/windows-server-2012-r2"}
    ]
    '''
    
    
    

