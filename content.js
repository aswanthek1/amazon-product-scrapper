
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    try {
        if (request.action === 'scrape') {
          const name = document.querySelector('#productTitle').textContent.trim();
          const price = document.querySelector('.a-price-whole').textContent.trim();
          const image = document.querySelector('#landingImage').src;
          const url = window.location.href;
          const data = [{ name, price, image, url }];
          chrome.runtime.sendMessage({ action: 'displayData', data });
        }
    } catch (error) {}
  });
  