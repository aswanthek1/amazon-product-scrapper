function getElementDetails(nameAttr, priceAttr, imgAttr) {
  const elementArray = []
  elementArray.push(document.querySelector(nameAttr).textContent.trim());
  elementArray.push(document.querySelector(priceAttr).textContent.trim());
  elementArray.push(document.querySelector(imgAttr).src);
  return elementArray;
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  try {
    if (request.action === 'scrape') {
      console.log(request.url, "action at conetn")
      // const name = document.querySelector('#productTitle').textContent.trim();
      // const price = document.querySelector('.a-price-whole').textContent.trim();
      // const image = document.querySelector('#landingImage').src;
      let name; let price; let image;

      if (request?.url?.includes('//www.amazon.in')) {
        // for amazon
        const elements = getElementDetails(`#productTitle`, `.a-price-whole`, `#landingImage`)
        name = elements[0]
        price = elements[1]
        image = elements[2]
      }
      else if (request?.url?.includes('//www.ebay.com/')) {
        // for ebay
        const elements = getElementDetails(`.x-item-title__mainTitle span`, `.x-price-primary .ux-textspans`, `.ux-image-carousel-item img`)
        name = elements[0]
        price = elements[1]
        image = elements[2]
      }
      else if(request?.url?.includes('//www.etsy.com')) {
        // for etsy
        const elements = getElementDetails(`#listing-page-cart .wt-mb-xs-1 h1`, `.wt-text-title-larger`, `.listing-page-image-carousel-component .carousel-image`)
        name = elements[0]
        price = elements[1]
        image = elements[2]
      }
      else if(request?.url?.includes('//www.walmart.com/')) {
        // for walmart
        const elements = getElementDetails(`#main-title`, `.lh-copy span span`, `div img.noselect`)
        name = elements[0]
        price = elements[1]
        image = elements[2]
      }
      const url = window.location.href;
      const data = [{ name, price, image, url }];

      // chrome.storage.local.get("scrappedProducts", (resp) => {
      //   if (resp.scrappedProducts && resp.scrappedProducts.length > 0) {
      //     const filterdData = resp.scrappedProducts?.filter((item) => (item.name !== data[0].name && item.price !== data[0].price))
      //     chrome.storage.local.set({ "scrappedProducts": [...filterdData, data[0]] })
      //   }
      //   else {
      //     chrome.storage.local.set({ "scrappedProducts": [data[0]] })
      //   }
      // })

      chrome.runtime.sendMessage({ action: 'displayData', data });
    }
  } catch (error) { console.log(error, 'at content') }
});
