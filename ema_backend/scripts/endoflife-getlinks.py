import requests
from bs4 import BeautifulSoup
import json

# URL of the webpage
url = "https://endoflife.date/"

# Send a GET request to the webpage
response = requests.get(url)

# Parse the HTML content of the webpage
soup = BeautifulSoup(response.text, "html.parser")

# Find the navbar HTML element(s) based on its class, id, or tag name
navbar = soup.find("nav", class_="site-nav")

# Initialize a list to store the links
navbar_links = []

navbar_links_mapping = {}

# Find all anchor tags within the navbar
if navbar:
    navbar_links = navbar.find_all("a")

    for link in navbar_links:
        name = link.text.strip()
        href = link.get("href")[1:]
        if name and href:
            navbar_links_mapping[name] = href

file_path = "navbar_links_mapping2.json"
'''
# Extract the href attribute from each anchor tag to get the link
navbar_links = [link.get("href") for link in navbar_links]
# navbar_links_stripped = [link.strip("/") for link in navbar_links]
navbar_links_stripped = [link[1:] for link in navbar_links]
'''

with open(file_path, "w") as file:
    json.dump(navbar_links_mapping, file, indent = 4)

# Print the extracted links
print(navbar_links_mapping)

