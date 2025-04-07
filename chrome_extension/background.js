chrome.runtime.onInstalled.addListener(function() {
  // Initialize storage
  chrome.storage.local.get(['leads'], function(result) {
    if (!result.leads) {
      chrome.storage.local.set({leads: []});
    }
  });
});