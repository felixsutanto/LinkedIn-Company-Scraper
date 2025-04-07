document.addEventListener('DOMContentLoaded', function() {
  const captureBtn = document.getElementById('captureBtn');
  const status = document.getElementById('status');
  const leadCount = document.getElementById('leadCount');
  const leadCountDiv = document.querySelector('.lead-count');
  const actionRow = document.querySelector('.action-row');
  const exportCsvBtn = document.getElementById('exportCsv');
  const viewLeadsBtn = document.getElementById('viewLeads');
  const clearLeadsBtn = document.getElementById('clearLeads');
  const filtersToggle = document.getElementById('filtersToggle');
  const filtersDiv = document.getElementById('filters');
  const searchBtn = document.getElementById('searchBtn');
  
  // Check if we're on LinkedIn
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const url = tabs[0].url;
    const isLinkedInCompany = url.includes('linkedin.com/company/');
    
    document.getElementById('notLinkedIn').style.display = isLinkedInCompany ? 'none' : 'block';
    document.getElementById('linkedInPage').style.display = isLinkedInCompany ? 'block' : 'none';
    
    // Update lead count
    chrome.storage.local.get(['leads'], function(result) {
      const leads = result.leads || [];
      leadCount.textContent = leads.length;
      if (leads.length > 0) {
        leadCountDiv.style.display = 'flex';
        actionRow.style.display = 'flex';
      }
    });
  });
  
  // Toggle filters
  filtersToggle.addEventListener('click', function() {
    if (filtersDiv.style.display === 'none') {
      filtersDiv.style.display = 'block';
      filtersToggle.textContent = '▲ Hide Search Filters';
    } else {
      filtersDiv.style.display = 'none';
      filtersToggle.textContent = '▼ Show Search Filters';
    }
  });
  
  // Capture data from current page
  captureBtn.addEventListener('click', function() {
    captureBtn.disabled = true;
    status.textContent = 'Capturing data...';
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: 'captureCompanyData'}, function(response) {
        if (response && response.success) {
          // Save the captured lead
          chrome.storage.local.get(['leads'], function(result) {
            const leads = result.leads || [];
            leads.push(response.data);
            
            chrome.storage.local.set({leads: leads}, function() {
              status.textContent = 'Company data captured successfully!';
              leadCount.textContent = leads.length;
              leadCountDiv.style.display = 'flex';
              actionRow.style.display = 'flex';
              captureBtn.disabled = false;
            });
          });
        } else {
          status.textContent = 'Error: Could not capture data.';
          captureBtn.disabled = false;
        }
      });
    });
  });
  
  // Search for companies
  searchBtn.addEventListener('click', function() {
    const keyword = document.getElementById('keyword').value;
    const location = document.getElementById('location').value;
    const industry = document.getElementById('industry').value;
    const companySize = document.getElementById('companySize').value;
    
    if (!keyword) {
      status.textContent = 'Please enter keywords to search.';
      return;
    }
    
    searchBtn.disabled = true;
    status.textContent = 'Searching for companies...';
    
    // In a real implementation, this would call your backend API
    // For demo, we'll simulate a search response
    setTimeout(() => {
      const mockCompanies = [
        {
          name: keyword + ' Technologies Inc.',
          linkedin_url: 'https://www.linkedin.com/company/sample1',
          industry: 'Technology',
          location: location || 'San Francisco, CA'
        },
        {
          name: keyword + ' Solutions',
          linkedin_url: 'https://www.linkedin.com/company/sample2',
          industry: 'Software',
          location: location || 'New York, NY'
        },
        {
          name: keyword + ' Group',
          linkedin_url: 'https://www.linkedin.com/company/sample3',
          industry: 'Consulting',
          location: location || 'Chicago, IL'
        }
      ];
      
      // Display search results in a new tab
      chrome.storage.local.set({searchResults: mockCompanies}, function() {
        chrome.tabs.create({url: 'search-results.html'});
        searchBtn.disabled = false;
        status.textContent = '';
      });
    }, 1500);
  });
  
  // Export to CSV
  exportCsvBtn.addEventListener('click', function() {
    chrome.storage.local.get(['leads'], function(result) {
      const leads = result.leads || [];
      if (leads.length === 0) {
        status.textContent = 'No leads to export.';
        return;
      }
      
      // Convert leads to CSV
      let csv = 'Company Name,Website,Industry,Size,Headquarters,Lead Quality Score\n';
      leads.forEach(lead => {
        csv += `"${lead.name}","${lead.website || ''}","${lead.industry || ''}","${lead.size || ''}","${lead.headquarters || ''}","${lead.lead_quality_score || ''}"\n`;
      });
      
      // Create download link
      const blob = new Blob([csv], {type: 'text/csv'});
      const url = URL.createObjectURL(blob);
      
      chrome.downloads.download({
        url: url,
        filename: 'linkedin_leads.csv',
        saveAs: true
      });
      
      status.textContent = 'Exporting...';
      setTimeout(() => {
        status.textContent = '';
      }, 2000);
    });
  });
  
  // View leads
  viewLeadsBtn.addEventListener('click', function() {
    chrome.tabs.create({url: 'leads.html'});
  });
  
  // Clear all leads
  clearLeadsBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all leads?')) {
      chrome.storage.local.set({leads: []}, function() {
        leadCount.textContent = '0';
        leadCountDiv.style.display = 'none';
        actionRow.style.display = 'none';
        status.textContent = 'All leads cleared.';
        setTimeout(() => {
          status.textContent = '';
        }, 2000);
      });
    }
  });
});