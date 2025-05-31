import requests
from bs4 import BeautifulSoup
import argparse

# ArgParse setup
parser = argparse.ArgumentParser()
parser.add_argument('-t', metavar='TARGET', type = str, nargs = 1, help = "Search value", required=True)
args = parser.parse_args()
items = [[]] # Sorted by time

def get_stats():
    valid_entries = [item for item in items if isinstance(item, list) and len(item) >= 3]

    # Sort by price (index 1), converting price string to float
    sorted_data = sorted(valid_entries, key=lambda x: float(x[1].replace('$', '')))
    print(sorted_data)
    # IQR
    min_price = float(sorted_data[0][1].replace('$', ''))
    max_price = float(sorted_data[-1][1].replace('$', ''))
    print (max_price, min_price)
    return sorted_data

def get_sold_prices(url):
    try:
        response = requests.get(url)
        response.raise_for_status()
        html_content = response.text
    except requests.RequestException as e:
        print(f"Error fetching document: {e}")
        return None
    soup = BeautifulSoup(html_content, 'html.parser')
    sold_items_ul = soup.find('ul', class_='srp-results')
    for child in sold_items_ul.children:
  
        wrapper = child.find('div', class_='s-item__wrapper')
        if not wrapper:
            continue  # Skip if no wrapper found
        info = wrapper.find('div', class_='s-item__info')
        # Find date sold
        date_sold = info.find('div', class_='s-item__caption').div.span.span.text

        date = date_sold.strip("Sold: ")

        # Find title
        title_div = info.a.div
        title = title_div.span.text

        # Find price
        details = info.find('div', class_='s-item__details')
        primary_details = details.find('div', class_='s-item__details-section--primary')
        price_details = primary_details.find('div', class_='s-item__detail')
        price = price_details.span.span.text
        items.append([title, price, date])
        
        if "s-item__before-answer" in child['class'] :
            print("Reached REWRITE_START marker, stopping...")
            break

if __name__ == "__main__":
    search_value = args.t[0]
    print(f"Searching Sold Prices for: {search_value}")
    search_list = search_value.split(' ')
    url_base = "https://www.ebay.com/sch/i.html?_fsrp=1&rt=nc&_from=R40&_nkw="
    url = url_base + '+'.join(search_list) + "&_sacat=0&LH_Sold=1&_ipg=240"
    # Replace with your actual document URL
    result = get_sold_prices(url)
    get_stats()
    # if result:
    #     print(f"Final result: {result}")