import requests
from bs4 import BeautifulSoup
import pandas as pd
import re
import time
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

class LinkedInScraper:
    def __init__(self, use_selenium=True):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        self.use_selenium = use_selenium
        if use_selenium:
            self._setup_selenium()

    def _setup_selenium(self):
        """Initialize the Selenium WebDriver with Chrome options."""
        chrome_options = Options()
        chrome_options.add_argument("--headless")  # Run in headless mode
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument(f"user-agent={self.headers['User-Agent']}")
        
        self.driver = webdriver.Chrome(options=chrome_options)
        
    def search_companies(self, keyword, location=None, industry=None, company_size=None, limit=10):
        """Search for companies on LinkedIn using keywords and filters."""
        base_url = "https://www.linkedin.com/search/results/companies/"
        params = {
            "keywords": keyword,
        }
        
        if location:
            params["location"] = location
        if industry:
            params["industry"] = industry
        if company_size:
            params["companySize"] = company_size
            
        # The actual implementation would use LinkedIn's search API or parse search results
        # For demo purposes, return a sample list of company LinkedIn URLs
        sample_companies = [
            {"name": f"{keyword} Technologies Inc.", "linkedin_url": "https://www.linkedin.com/company/sample1"},
            {"name": f"{keyword} Solutions LLC", "linkedin_url": "https://www.linkedin.com/company/sample2"},
            {"name": f"{keyword} Global Services", "linkedin_url": "https://www.linkedin.com/company/sample3"},
            {"name": f"{keyword} Innovations", "linkedin_url": "https://www.linkedin.com/company/sample4"},
            {"name": f"{keyword} Systems", "linkedin_url": "https://www.linkedin.com/company/sample5"},
        ]
        
        return sample_companies[:limit]
    
    def scrape_company_profile(self, linkedin_url):
        """Extract company information from a LinkedIn company page."""
        if not self.use_selenium:
            # In a production environment, implement proper authentication and API usage
            print(f"Simulating scrape of {linkedin_url}")
            # Return mock data for demonstration
            return self._generate_mock_company_data(linkedin_url)
        
        try:
            self.driver.get(linkedin_url)
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".org-top-card"))
            )
            
            # Extract company info
            company_data = {}
            
            # Company name
            try:
                company_data['name'] = self.driver.find_element(By.CSS_SELECTOR, ".org-top-card__primary-content h1").text.strip()
            except:
                company_data['name'] = "Unknown"
            
            # About section / Description
            try:
                company_data['about'] = self.driver.find_element(By.CSS_SELECTOR, ".org-about-us-organization-description__text").text.strip()
            except:
                company_data['about'] = ""
            
            # Company website
            try:
                company_data['website'] = self.driver.find_element(By.CSS_SELECTOR, ".org-about-us-company-module__website a").get_attribute("href")
            except:
                company_data['website'] = ""
            
            # Industry
            try:
                company_data['industry'] = self.driver.find_element(By.CSS_SELECTOR, ".org-about-us-company-module__industry").text.strip()
            except:
                company_data['industry'] = ""
            
            # Company size
            try:
                company_data['size'] = self.driver.find_element(By.CSS_SELECTOR, ".org-about-us-company-module__company-staff-count-range").text.strip()
            except:
                company_data['size'] = ""
            
            # Headquarters
            try:
                company_data['headquarters'] = self.driver.find_element(By.CSS_SELECTOR, ".org-about-us-company-module__headquarters").text.strip()
            except:
                company_data['headquarters'] = ""
            
            # Find potential contact emails in the page content
            page_source = self.driver.page_source
            company_data['potential_emails'] = self._extract_emails(page_source)
            
            # Find social media links
            company_data['social_media'] = self._extract_social_media_links(page_source)
            
            # Collect employee data (first 3-5 key employees)
            company_data['key_employees'] = self._extract_key_employees()
            
            return company_data
            
        except TimeoutException:
            print(f"Timeout while loading {linkedin_url}")
            return {"error": "Timeout", "url": linkedin_url}
        except Exception as e:
            print(f"Error scraping {linkedin_url}: {str(e)}")
            return {"error": str(e), "url": linkedin_url}
    
    def _extract_emails(self, text):
        """Extract email addresses from text."""
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = re.findall(email_pattern, text)
        return list(set(emails))  # Remove duplicates
    
    def _extract_social_media_links(self, text):
        """Extract social media links from text."""
        social_media = {
            'twitter': None,
            'facebook': None,
            'instagram': None
        }
        
        twitter_pattern = r'https?://(?:www\.)?twitter\.com/[a-zA-Z0-9_]+'
        facebook_pattern = r'https?://(?:www\.)?facebook\.com/[a-zA-Z0-9./?=_-]+'
        instagram_pattern = r'https?://(?:www\.)?instagram\.com/[a-zA-Z0-9_.]+'
        
        twitter_matches = re.findall(twitter_pattern, text)
        facebook_matches = re.findall(facebook_pattern, text)
        instagram_matches = re.findall(instagram_pattern, text)
        
        if twitter_matches:
            social_media['twitter'] = twitter_matches[0]
        if facebook_matches:
            social_media['facebook'] = facebook_matches[0]
        if instagram_matches:
            social_media['instagram'] = instagram_matches[0]
            
        return social_media
    
    def _extract_key_employees(self):
        """Extract key employees from the company page."""
        if not self.use_selenium:
            return []
            
        try:
            # This would navigate to the "People" tab and extract employee information
            # For demonstration, return mock data
            return [
                {"name": "John Smith", "title": "CEO", "linkedin_url": "https://linkedin.com/in/johnsmith"},
                {"name": "Sarah Johnson", "title": "CTO", "linkedin_url": "https://linkedin.com/in/sarahjohnson"},
                {"name": "Michael Brown", "title": "VP of Sales", "linkedin_url": "https://linkedin.com/in/michaelbrown"}
            ]
        except:
            return []
    
    def _generate_mock_company_data(self, linkedin_url):
        """Generate mock company data for demonstration purposes."""
        company_name = linkedin_url.split('/')[-1].replace('sample', 'Tech Company ')
        return {
            'name': company_name,
            'about': f"{company_name} is a leading provider of innovative solutions in the technology industry.",
            'website': f"https://www.{company_name.lower().replace(' ', '')}.com",
            'industry': "Information Technology & Services",
            'size': "51-200 employees",
            'headquarters': "San Francisco, CA",
            'potential_emails': [f"contact@{company_name.lower().replace(' ', '')}.com", 
                                f"info@{company_name.lower().replace(' ', '')}.com"],
            'social_media': {
                'twitter': f"https://twitter.com/{company_name.lower().replace(' ', '')}",
                'facebook': f"https://facebook.com/{company_name.lower().replace(' ', '')}",
                'instagram': None
            },
            'key_employees': [
                {"name": "John Smith", "title": "CEO", "linkedin_url": "https://linkedin.com/in/johnsmith"},
                {"name": "Sarah Johnson", "title": "CTO", "linkedin_url": "https://linkedin.com/in/sarahjohnson"}
            ]
        }
    
    def enrich_company_data(self, company_data):
        """Enrich company data with additional information from other sources."""
        # In a production system, this would call APIs like Clearbit, Hunter.io, etc.
        # For demonstration, just add a few calculated fields
        
        if 'name' in company_data and 'industry' in company_data:
            # Add company age estimation (mock)
            company_data['estimated_age'] = "5-10 years"
            
            # Add funding status estimation (mock)
            company_data['funding_status'] = "Series B"
            
            # Generate standardized email formats
            if 'website' in company_data and company_data['website']:
                domain = company_data['website'].replace('https://', '').replace('http://', '').replace('www.', '')
                domain = domain.split('/')[0]
                
                company_data['email_formats'] = [
                    f"firstname@{domain}",
                    f"firstname.lastname@{domain}",
                    f"firstinitial.lastname@{domain}"
                ]
                
            # Add lead quality score (0-100)
            # In a real implementation, this would use a scoring algorithm
            company_data['lead_quality_score'] = 85
        
        return company_data
    
    def export_to_csv(self, companies_data, filename="linkedin_leads.csv"):
        """Export the scraped data to a CSV file."""
        df = pd.DataFrame(companies_data)
        df.to_csv(filename, index=False)
        print(f"Data exported to {filename}")
        return filename
        
    def export_to_json(self, companies_data, filename="linkedin_leads.json"):
        """Export the scraped data to a JSON file."""
        with open(filename, 'w') as f:
            json.dump(companies_data, f, indent=4)
        print(f"Data exported to {filename}")
        return filename
    
    def close(self):
        """Close the Selenium WebDriver."""
        if self.use_selenium and hasattr(self, 'driver'):
            self.driver.quit()