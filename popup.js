document.getElementById('scrapeButton').addEventListener('click', function () {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0]?.id, { action: 'scrape' });
    });
  } catch (error) { }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'displayData') {
    try {
      const resultList = document.getElementById('resultList');
      resultList.innerHTML = '';
      request.data.forEach(function (item) {
        const listItem = document.createElement('li');
        listItem.textContent = `${item.name} - Price: ${item.price}`;
        const image = document.createElement('img');
        image.src = item.image;
        listItem.appendChild(image);
        const link = document.createElement('a');
        link.href = item.url;
        link.setAttribute("target", "_blank")
        link.textContent = 'View on Amazon';
        listItem.appendChild(link);
        resultList.appendChild(listItem);
      });
    } catch (error) { }
  }
});
