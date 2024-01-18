document.getElementById('scrapeButton').addEventListener('click', function () {
  try {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0]?.id, { action: 'scrape', url: tabs[0].url });
    });
  } catch (error) { }
});


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'displayData') {
    try {
      const cartList = document.getElementById('cartList');
      cartList.style.display = 'none';
      const resultList = document.getElementById('resultList');
      resultList.style.display = 'block'
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
        link.textContent = 'View Product';
        listItem.appendChild(link);
        resultList.appendChild(listItem);
      });
    } catch (error) { }
  }
});


document.getElementById('showCartButton').addEventListener('click', function () {
  try {
    const resultList = document.getElementById('resultList');
    resultList.style.display = 'none'
    const cartList = document.getElementById('cartList');
    cartList.style.display = 'block';
    cartList.innerHTML = '';
    chrome.storage.local.get("scrappedProducts", (resp) => {
      if(resp.scrappedProducts?.length > 0) {
        const heading = document.createElement('h3')
        heading.textContent = 'Cart Items'
        heading.classList.add('heading_class')
        cartList.appendChild(heading);

        const clearAllButton = document.createElement('button');
        clearAllButton.innerText = 'Clear Cart';
        clearAllButton.style.marginBottom = '20px';
        cartList.appendChild(clearAllButton);
        clearAllButton.addEventListener("click", () => {
          cartList.innerHTML = ''
          chrome.storage.local.clear()
          createNoItemTemplate(cartList)
        })

          resp.scrappedProducts.forEach((item, index) => {
          const listItem = document.createElement('li');
          listItem.textContent = `${item.name} - Price: ${item.price}`;
          const image = document.createElement('img');
          image.src = item.image;
          listItem.appendChild(image);
          const link = document.createElement('a');
          link.href = item.url;
          link.setAttribute("target", "_blank")
          link.textContent = 'View Product';
          listItem.appendChild(link);

          const clearButton = document.createElement('button');
          clearButton.id = 'clearButton'
          clearButton.innerHTML = 'Remove'
          clearButton.style.float = 'right'
          listItem.appendChild(clearButton);
          listItem.id = `${index}`
          cartList.appendChild(listItem);

          clearButton.addEventListener("click", () => {
            resp.scrappedProducts.splice(index, 1)
            const removedProduct = document.getElementById(`${index}`)
            cartList.removeChild(removedProduct)
            chrome.storage.local.set({ "scrappedProducts": resp.scrappedProducts})
            if(resp?.scrappedProducts?.length === 0) {
              clearAllButton.style.display = 'none';
              heading.style.display = 'none'
              createNoItemTemplate(cartList)
            }
          })
      })
      }
      else {
        createNoItemTemplate(cartList)
      }
    })
  } catch (error) { }
});


function createNoItemTemplate(cartList) {
  const heading = document.createElement('h3')
  heading.style.textAlign = 'center'
  heading.style.marginBottom = '20px'
  heading.textContent = 'Cart Products'
  const listItem = document.createElement('li');
  listItem.textContent = `No produts in the cart.`;
  listItem.prepend(heading)
  cartList.appendChild(listItem);
}
