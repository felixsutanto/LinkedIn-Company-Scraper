# LinkedIn Scraper & Chrome Extension

This repository contains a Python-based LinkedIn company scraper and a companion Chrome Extension to search, extract, and manage company data from LinkedIn.

---

## 📁 File Breakdown

### 🔍 LinkedIn Scraper (Python)

- `linkedin_scraper/scraper.py`  
  Contains the `LinkedInScraper` class with methods for:
  - Setting up Selenium
  - Scraping company profiles
  - Extracting emails/socials
  - Enriching data
  - Exporting to CSV/JSON

- `linkedin_scraper/cli.py`  
  CLI tool to run the scraper with custom arguments.

- `linkedin_scraper/requirements.txt`  
  Required Python dependencies:
  ```text
  requests
  beautifulsoup4
  pandas
  selenium
  ```

- `linkedin_scraper/README.md`  
  (Optional) Additional documentation and usage notes.

### 🧩 Chrome Extension

- `chrome_extension/manifest.json`  
  Extension metadata, permissions, and configuration.

- `chrome_extension/background.js`  
  Initializes local storage and handles install events.

- `chrome_extension/content.js`  
  Extracts company data from LinkedIn pages when triggered.

- `chrome_extension/popup.html`  
  User interface for the popup.

- `chrome_extension/popup.js`  
  Handles UI logic and actions (search, capture, export).

- `chrome_extension/search-results.html` & `chrome_extension/search-results.js`  
  Display search results in a new tab.

- `chrome_extension/leads.html` & `chrome_extension/leads.js`  
  Manage captured leads: view, export, clear.

- `chrome_extension/images/`  
  Stores icons referenced in `manifest.json` and `popup.html`.

---

## ⚗️ Demo Mode vs Real Scraping

> **Note:** This project runs in **Demo Mode** by default to stay compliant with LinkedIn’s [Terms of Service](https://www.linkedin.com/legal/user-agreement).

### ✅ What’s Demo Mode?
- **Python Scraper**: Returns mock company data instead of accessing live LinkedIn.
- **Chrome Extension**: Uses client-side JavaScript to extract data *only* from the currently loaded company profile page, and simulates search results using static HTML (mocked search).

---

## 🚀 How to Use

### 🔧 Python Scraper

1. **Navigate to the `linkedin_scraper` folder:**
   ```bash
   cd linkedin_scraper
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the CLI tool (Mock Mode):**
   ```bash
   python cli.py --keyword "YourKeyword" --limit 5 --output json
   ```
   *Mock mode uses dummy data. Real scraping is disabled by default to comply with LinkedIn's Terms of Service.*

### Switching to Real Mode (with Selenium)

**Note:** Real scraping of LinkedIn violates their [Terms of Service](https://www.linkedin.com/legal/user-agreement), so mock/demo mode is safer unless you're testing privately.

#### Step-by-Step to Switch to Real LinkedIn Scraping:
1. **Login to LinkedIn (Optional but Recommended):**  
   LinkedIn throttles unauthenticated users. Use cookies/session or login via Selenium.

2. **Use Selenium to Search Companies:**  
   Update the `LinkedInScraper` class’s `search_companies` method to:
   - Open LinkedIn’s search URL:
     ```
     https://www.linkedin.com/search/results/companies/?keywords=<your-query>
     ```
   - Wait for the page to load and scroll for additional results.
   - Parse each company block to extract the company name and URL.

3. **Example Scraping Logic in Selenium:**
   ```python
   from selenium import webdriver
   from selenium.webdriver.common.by import By
   from selenium.webdriver.chrome.options import Options
   import time

   class LinkedInScraper:
       def __init__(self, use_selenium=False):
           self.use_selenium = use_selenium
           if use_selenium:
               options = Options()
               options.add_argument("--start-maximized")
               self.driver = webdriver.Chrome(options=options)

       def search_companies(self, keyword, limit=3):
           results = []
           search_url = f"https://www.linkedin.com/search/results/companies/?keywords={keyword}"
           self.driver.get(search_url)
           time.sleep(3)  # wait for page to load

           # Scroll to load more results
           for _ in range(3):
               self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
               time.sleep(2)

           companies = self.driver.find_elements(By.CLASS_NAME, 'entity-result__title-text')[:limit]

           for company in companies:
               try:
                   name = company.text.strip()
                   link = company.find_element(By.TAG_NAME, 'a').get_attribute('href')
                   results.append({"name": name, "url": link})
               except Exception as e:
                   print(f"Error parsing company: {e}")

           return results
   ```

4. **In Your CLI (`cli.py`):**  
   Ensure that you instantiate the scraper with Selenium enabled:
   ```python
   scraper = LinkedInScraper(use_selenium=True)
   ```

### 🌐 Chrome Extension

1. Open Google Chrome and go to:
   ```
   chrome://extensions/
   ```

2. Enable **Developer mode** (top-right).

3. Click **Load unpacked** and select the `chrome_extension` folder.

4. The extension will appear in your toolbar. Click it to:
   - Search companies
   - Capture profile data
   - Export leads

---

## ⚠️ Disclaimer

This project is intended for **educational and personal portfolio use only**.  
Scraping LinkedIn may violate their [Terms of Service](https://www.linkedin.com/legal/user-agreement). Use responsibly and ethically.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ✨ Credits

Developed by Felix Sutanto – Feel free to contribute or fork!
```
