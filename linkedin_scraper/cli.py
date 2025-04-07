import argparse
import time
from scraper import LinkedInScraper  # Import from scraper.py

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='LinkedIn Company Scraper')
    parser.add_argument('--keyword', type=str, required=True, help='Keyword to search for companies')
    parser.add_argument('--location', type=str, help='Filter by location')
    parser.add_argument('--industry', type=str, help='Filter by industry')
    parser.add_argument('--limit', type=int, default=10, help='Maximum number of companies to scrape')
    parser.add_argument('--output', type=str, default='csv', choices=['csv', 'json'], help='Output format')
    
    args = parser.parse_args()
    
    scraper = LinkedInScraper(use_selenium=False)  # Change to True for real scraping

    try:
        print(f"Searching for companies matching: {args.keyword}")
        companies = scraper.search_companies(
            keyword=args.keyword,
            location=args.location,
            industry=args.industry,
            limit=args.limit
        )
        
        results = []
        for company in companies:
            print(f"Scraping: {company['name']}")
            company_data = scraper.scrape_company_profile(company['linkedin_url'])
            enriched_data = scraper.enrich_company_data(company_data)
            results.append(enriched_data)
            time.sleep(2)
        
        if args.output == 'csv':
            scraper.export_to_csv(results)
        else:
            scraper.export_to_json(results)

    finally:
        scraper.close()