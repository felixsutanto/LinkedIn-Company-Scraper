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

- `chrome_extension/search-results.html` & `search-results.js`  
  Display search results in a new tab.

- `chrome_extension/leads.html` & `leads.js`  
  Manage captured leads: view, export, clear.

- `chrome_extension/images/`  
  Stores icons referenced in `manifest.json` and `popup.html`.

---

## 🚀 How to Use

### 🔧 Python Scraper

1. Navigate to the `linkedin_scraper` folder:
   ```bash
   cd linkedin_scraper
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the CLI tool:
   ```bash
   python cli.py --keyword "YourKeyword" --limit 5 --output json
   ```

   Optional flags:
   - `--location "YourLocation"` to narrow results
   - `--output csv/json` to select output format

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
