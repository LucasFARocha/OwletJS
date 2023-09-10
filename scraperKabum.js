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
    const url = "https://www.kabum.com.br/";

    await page.goto(url);

    await page.waitForSelector('#input-busca');
    await page.type('#input-busca', produto);

    await Promise.all([
      page.waitForNavigation(),
      await page.keyboard.press('Enter'),
    ])

    await page.waitForSelector('.sc-d55b419d-7.bwqahi.productCard');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.sc-d55b419d-7.bwqahi.productCard');
      const lista = [];

      let id = 0;
      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.sc-d79c9c3f-0.nlmfp.sc-d55b419d-16.giuuaP.nameCard');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.sc-d55b419d-10.dUPmeM.productLink');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
        const link = "https://www.kabum.com.br" + linkProduto;

        const precoBruto = produto.querySelector('.sc-3b515ca1-2.chPrxA.priceCard');
        const preco = precoBruto ? precoBruto.textContent.trim() : '';

        const imagemBruto = produto.querySelector('.imageCard');
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