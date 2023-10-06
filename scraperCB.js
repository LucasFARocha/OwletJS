const pup = require('puppeteer');

exports.scrapeCB = async function(produto){
    // Launch the browser and open a new blank page
    const browser = await pup.launch({
        headless: false,
        // executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
        // `headless: true` (default) enables old Headless;
        // `headless: 'new'` enables new Headless;
        // `headless: false` enables “headful” mode.
      });
    const page = await browser.newPage(); 
    const url = "https://www.casasbahia.com.br/";

    await page.goto(url);

    await page.waitForSelector('#search-form-input');
    await page.type('#search-form-input', produto);

    await Promise.all([
      page.waitForNavigation(),
      page.click('.css-e0dnmk.exbkjyj122'),
    ])

    await page.waitForSelector('.Item-sc-5fec12f4-0.cimFif.styles__ProductGridItem-sc-e7f28b60-1.dmPEmU');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.Item-sc-5fec12f4-0.cimFif.styles__ProductGridItem-sc-e7f28b60-1.dmPEmU');
      const lista = [];

      let id = 0;
      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.product-card__title');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.dsvia-link-overlay.css-1ogn60p');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
        const link = url + linkProduto;

        const precoBruto = produto.querySelector('.product-card__highlight-price');
        const preco = precoBruto ? precoBruto.textContent.trim() : '';

        const imagemBruto = produto.querySelector('.product-card__image');
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