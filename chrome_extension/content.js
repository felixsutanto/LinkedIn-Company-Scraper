chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'captureCompanyData') {
    // Extract company data from the LinkedIn page
    const companyData = extractCompanyData();
    sendResponse({success: true, data: companyData});
  }
  return true;
});

function extractCompanyData() {
  // Get company name
  let companyName = '';
  const nameElement = document.querySelector('.org-top-card-summary__title');
  if (nameElement) {
    companyName = nameElement.textContent.trim();
  } else {
    const altNameElement = document.querySelector('h1.org-top-card__primary-content');
    if (altNameElement) {
      companyName = altNameElement.textContent.trim();
    }
  }
  
  // Get company website
  let website = '';
  const websiteElement = document.querySelector('a[data-control-name="page_details_module_website_external_link"]');
  if (websiteElement) {
    website = websiteElement.href;
  }
  
  // Get company industry
  let industry = '';
  const industryElements = document.querySelectorAll('.org-page-details__definition-text');
  industryElements.forEach(element => {
    const prevElement = element.previousElementSibling;
    if (prevElement && prevElement.textContent.includes('Industry')) {
      industry = element.textContent.trim();
    }
  });
  
  // Get company size
  let size = '';
  const sizeElements = document.querySelectorAll('.org-page-details__definition-text');
  sizeElements.forEach(element => {
    const prevElement = element.previousElementSibling;
    if (prevElement && prevElement.textContent.includes('Company size')) {
      size = element.textContent.trim();
    }
  });
  
  // Get headquarters
  let headquarters = '';
  const hqElements = document.querySelectorAll('.org-page-details__definition-text');
  hqElements.forEach(element => {
    const prevElement = element.previousElementSibling;
    if (prevElement && prevElement.textContent.includes('Headquarters')) {
      headquarters = element.textContent.trim();
    }
  });
  
  // Get about/description
  let about = '';
  const aboutElement = document.querySelector('.org-about-us-organization-description__text');
  if (aboutElement) {
    about = aboutElement.textContent.trim();
  }
  
  // Simulate enrichment with a quality score
  const lead_quality_score = calculateLeadScore(
    companyName, industry, size, headquarters, website
  );
  
  return {
    name: companyName,
    website: website,
    industry: industry,
    size: size,
    headquarters: headquarters,
    about: about,
    lead_quality_score: lead_quality_score,
    captured_at: new Date().toISOString()
  };
}

function calculateLeadScore(name, industry, size, location, website) {
  // A simple algorithm to score lead quality (0-100)
  let score = 50; // Base score
  
  // Add points for completeness
  if (name) score += 10;
  if (industry) score += 10;
  if (size) score += 10;
  if (location) score += 5;
  if (website) score += 15;
  
  // Industry-specific adjustments (in a real app, this would be configurable)
  const highValueIndustries = ['software', 'technology', 'finance', 'healthcare', 'saas'];
  if (industry && highValueIndustries.some(ind => industry.toLowerCase().includes(ind))) {
    score += 10;
  }
  
  // Company size adjustments
  if (size) {
    if (size.includes('10,001+') || size.includes('5,001-10,000')) {
      score -= 5; // Enterprise might be harder to sell to
    } else if (size.includes('51-200') || size.includes('201-500')) {
      score += 5; // Mid-size companies often make good targets
    }
  }
  
  // Cap the score at 100
  return Math.min(score, 100);
}