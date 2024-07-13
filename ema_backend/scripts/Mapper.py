import json

class Mapper:
    def __init__(self):
        with open("navbar_links_mapping.json", "r") as file:
            mappings = json.load(file)
            self.mappings = mappings
        
    def mapToSimpleName(self, data):
        return_results = []

        for item in data:
            name = item.get("name")
            if name in self.mappings:
                simple_name = self.mappings[name]
                item["simpleName"] = simple_name
                item["mapped"] = "yes"
                return_results.append(item)
            else:
                item["mapped"] = "no"
                return_results.append(item)
        
        return return_results
