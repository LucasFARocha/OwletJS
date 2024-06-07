const pup = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pup.use(StealthPlugin())

exports.scrape = async function(produto){

  

    // Launch the browser and open a new blank page
    const browser = await pup.launch({
        headless: 'new',
        // `headless: true` (default) enables old Headless;
        // `headless: 'new'` enables new Headless;
        // `headless: false` enables “headful” mode.
        executablePath: require('puppeteer').executablePath(),
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

    await page.waitForSelector('.inStockCard__Wrapper-sc-8xyl4s-0');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.inStockCard__Wrapper-sc-8xyl4s-0');
      const lista = [];
      const loja = "Submarino";

      let id = 0;

      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.product-name__Name-sc-1jrnqy1-0');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.inStockCard__Link-sc-8xyl4s-1');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
        const link = "https://www.submarino.com.br" + linkProduto;

        const precoBruto = produto.querySelector('.src__Text-sc-154pg0p-0.price__PromotionalPrice-sc-i1illp-1.BCJl.price-info__ListPriceWithMargin-sc-z0kkvc-2');
        const precoString = precoBruto ? precoBruto.textContent.substring(3, precoBruto.length) : '';
        const preco = parseFloat(precoString.replace('.', '').replace(',', '.'));

        const imagemBruto = produto.querySelector('.src__LazyImage-sc-xr9q25-0.fSBXxM');
        const imagem = imagemBruto ? imagemBruto.getAttribute('src') : '';

        const id_fornecedor = 8;

        id++;

        lista.push({
          id_fornecedor,
          id,
          loja,
          titulo,
          link,
          preco,
          imagem,
          //avaliacao
        })

      })
      return lista;
    })

    await browser.close();

    return scrape;
  }