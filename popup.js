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

        const addToCartButton = document.createElement('button');
        addToCartButton.id = 'addToCartButton'
        addToCartButton.innerText = 'Add to Cart'

        checkProductInCart(item, addToCartButton) /// for changing button text according to item's existence in cart

        addToCartButton.style.float = 'right'
        listItem.appendChild(addToCartButton);

        resultList.appendChild(listItem);

        addToCartButton.addEventListener("click", () => {
          addToCartFn(addToCartButton, item)

        })

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
      if (resp.scrappedProducts?.length > 0) {
        const heading = document.createElement('h3')
        heading.textContent = 'Cart Items'
        heading.classList.add('heading_class')
        cartList.appendChild(heading);

        const clearAllButton = document.createElement('button');
        clearAllButton.innerText = 'Clear Cart';
        clearAllButton.style.marginBottom = '20px';
        cartList.appendChild(clearAllButton);
        clearAllButton.addEventListener("click", async () => {
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
            chrome.storage.local.set({ "scrappedProducts": resp.scrappedProducts })
            if (resp?.scrappedProducts?.length === 0) {
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


function addToCartFn(addToCartButton, item) {
  chrome.storage.local.get("scrappedProducts", async (resp) => {
    let productExists = false;
    if (resp?.scrappedProducts?.length > 0) {
      for (let data of resp.scrappedProducts) {
        if (data.name === item.name) {
          productExists = true
          break;
        }
        else {
          productExists = false
        }
      }
    }
    else {
      productExists = false
    }

    if (resp.scrappedProducts && resp.scrappedProducts.length > 0) {
      if (!productExists) {
        // if product does not exists in cart we should add it to cart else remove it from cart
        chrome.storage.local.set({ "scrappedProducts": [...resp.scrappedProducts, item] })
        addToCartButton.innerText = 'Remove product from Cart'
      }
      else {
        const filterdData = resp.scrappedProducts.filter((data) => data.name !== item.name);
        chrome.storage.local.set({ "scrappedProducts": filterdData })
        addToCartButton.innerText = 'Add to Cart'
      }

    }
    else {
      if (!productExists) {
        chrome.storage.local.set({ "scrappedProducts": [item] })
        addToCartButton.innerText = 'Remove product from Cart'
      }
      else {
        chrome.storage.local.clear();
        addToCartButton.innerText = 'Add to Cart'
      }
    }
  })
}

function checkProductInCart(item, addToCartButton = null) {
  let productExists = false;
  /// for changing button text according to item's existence in cart
  chrome.storage.local.get("scrappedProducts", (resp) => {
    if (resp?.scrappedProducts?.length > 0) {
      for (let data of resp.scrappedProducts) {
        if (data.name === item.name) {
          productExists = true
          addToCartButton.innerText = 'Remove product from Cart'
          break;
        }
        else {
          productExists = false
          addToCartButton.innerText = 'Add to Cart'
        }
      }
    }
    else {
      productExists = false
    }
  })
  return productExists
}


function createNoItemTemplate(cartList) {
  // for creating no items template
  const heading = document.createElement('h3')
  heading.style.textAlign = 'center'
  heading.style.marginBottom = '20px'
  heading.textContent = 'Cart Products'
  const listItem = document.createElement('li');
  listItem.textContent = `No produts in the cart.`;
  listItem.prepend(heading)
  cartList.appendChild(listItem);
}
