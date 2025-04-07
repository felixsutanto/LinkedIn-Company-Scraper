document.addEventListener('DOMContentLoaded', function() {
  const resultsContainer = document.getElementById('results');
  
  // Load search results
  chrome.storage.local.get(['searchResults'], function(result) {
    const companies = result.searchResults || [];
    
    if (companies.length === 0) {
      resultsContainer.innerHTML = `
        <div class="no-results">
          <h2>No companies found</h2>
          <p>Try adjusting your search criteria and try again.</p>
        </div>
      `;
      return;
    }
    
    // Display each company
    companies.forEach(company => {
      const resultCard = document.createElement('div');
      resultCard.className = 'result-card';
      
      resultCard.innerHTML = `
        <div class="company-info">
          <div class="company-name">${company.name}</div>
          <div class="company-details">
            ${company.industry || 'Industry not specified'} · ${company.location || 'Location not specified'}
          </div>
        </div>
        <a href="${company.linkedin_url}" target="_blank" class="capture-btn">
          View Profile
        </a>
      `;
      
      resultsContainer.appendChild(resultCard);
    });
  });
});