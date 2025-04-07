document.addEventListener('DOMContentLoaded', function() {
  const leadsContainer = document.getElementById('leadsContainer');
  const totalSpan = document.getElementById('total');
  const exportBtn = document.getElementById('exportBtn');
  const clearBtn = document.getElementById('clearBtn');
  
  // Load all leads
  chrome.storage.local.get(['leads'], function(result) {
    const leads = result.leads || [];
    totalSpan.textContent = leads.length;
    
    if (leads.length === 0) {
      leadsContainer.innerHTML = `
        <div class="no-leads">
          <h2>No leads captured yet</h2>
          <p>Use the CaptureLeads extension on LinkedIn company pages to gather leads.</p>
        </div>
      `;
      return;
    }
    
    // Create table
    const table = document.createElement('table');
    
    // Add table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Company Name</th>
        <th>Industry</th>
        <th>Size</th>
        <th>Location</th>
        <th>Website</th>
        <th>Lead Quality</th>
      </tr>
    `;
    table.appendChild(thead);
    
    // Add table body
    const tbody = document.createElement('tbody');
    
    leads.forEach(lead => {
      const tr = document.createElement('tr');
      
      // Determine quality score class
      let qualityClass = 'medium';
      if (lead.lead_quality_score >= 80) {
        qualityClass = 'high';
      } else if (lead.lead_quality_score < 60) {
        qualityClass = 'low';
      }
      
      tr.innerHTML = `
        <td>${lead.name || 'Unknown'}</td>
        <td>${lead.industry || 'N/A'}</td>
        <td>${lead.size || 'N/A'}</td>
        <td>${lead.headquarters || 'N/A'}</td>
        <td>${lead.website ? `<a href="${lead.website}" target="_blank">${lead.website}</a>` : 'N/A'}</td>
        <td><span class="quality-score ${qualityClass}">${lead.lead_quality_score || 'N/A'}</span></td>
      `;
      
      tbody.appendChild(tr);
    });
    
    table.appendChild(tbody);
    leadsContainer.appendChild(table);
  });
  
  // Export to CSV
  exportBtn.addEventListener('click', function() {
    chrome.storage.local.get(['leads'], function(result) {
      const leads = result.leads || [];
      if (leads.length === 0) return;
      
      // Convert leads to CSV
      let csv = 'Company Name,Website,Industry,Size,Headquarters,Lead Quality Score\n';
      leads.forEach(lead => {
        csv += `"${lead.name || ''}","${lead.website || ''}","${lead.industry || ''}","${lead.size || ''}","${lead.headquarters || ''}","${lead.lead_quality_score || ''}"\n`;
      });
      
      // Create download link
      const blob = new Blob([csv], {type: 'text/csv'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'linkedin_leads.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  });
  
  // Clear all leads
  clearBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all leads?')) {
      chrome.storage.local.set({leads: []}, function() {
        window.location.reload();
      });
    }
  });
});