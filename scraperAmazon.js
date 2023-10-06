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
    const url = "https://www.amazon.com.br/";

    await page.goto(url);

    await page.waitForSelector('#twotabsearchtextbox');
    await page.type('#twotabsearchtextbox', produto);

    await Promise.all([
      page.waitForNavigation(),
      page.click('#nav-search-submit-button'),
    ])

    await page.waitForSelector('.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis.puis-v1g4cn23aiw4pq21ytu1qia8qu3.s-latency-cf-section.s-card-border');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis');
      const lista = [];

      let id = 0;
      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.a-size-base-plus.a-color-base.a-text-normal');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.a-link-normal.s-no-outline');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
        const link = "https://www.amazon.com.br" + linkProduto;

        const precoBruto = produto.querySelector('.a-offscreen');
        const preco = precoBruto ? precoBruto.textContent.trim() : '';

        const imagemBruto = produto.querySelector('.s-image');
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