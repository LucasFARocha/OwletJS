const pup = require('puppeteer');

exports.scrape = async function(produto){
    // Launch the browser and open a new blank page
    const browser = await pup.launch({
        headless: false,
        // `headless: true` (default) enables old Headless;
        // `headless: 'new'` enables new Headless;
        // `headless: false` enables “headful” mode.
      });
    const page = await browser.newPage(); 
    const url = "https://www.submarino.com.br/";

    await page.goto(url);

    await page.waitForSelector('.search__InputUI-sc-k1smv5-2.lbsTPL');
    await page.type('.search__InputUI-sc-k1smv5-2.lbsTPL', produto);

    await Promise.all([
      page.waitForNavigation(),
      page.click('.search__SearchButtonUI-sc-k1smv5-4.gigKIz'),
    ])

    await page.waitForSelector('.inStockCard__Wrapper-sc-1ngt5zo-0.iRvjrG');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.inStockCard__Wrapper-sc-1ngt5zo-0.iRvjrG');
      const lista = [];

      let id = 0;
      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.product-name__Name-sc-1shovj0-0.htEpFr');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.inStockCard__Link-sc-1ngt5zo-1.JOEpk');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
        const link = url + linkProduto;

        const precoBruto = produto.querySelector('.src__Text-sc-154pg0p-0.price__PromotionalPrice-sc-h6xgft-1.ctBJlj.price-info__ListPriceWithMargin-sc-1xm1xzb-2.liXDNM');
        const preco = precoBruto ? precoBruto.textContent.trim() : '';

        const imagemBruto = produto.querySelector('.src__LazyImage-sc-xr9q25-0.fSBXxM');
        const imagem = imagemBruto ? imagemBruto.getAttribute('src') : '';

        id++;

        lista.push({
          id,
          titulo,
          link,
          preco,
          imagem
        })

      })
      return lista;
    })

    await browser.close();

    return scrape;
  }