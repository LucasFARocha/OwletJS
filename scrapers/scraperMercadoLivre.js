const pup = require('puppeteer');

exports.scrape = async function(produto){
    // Launch the browser and open a new blank page
    const browser = await pup.launch({
      headless: 'new',
      // `headless: true` (default) enables old Headless;
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.
    });

    const page = await browser.newPage(); 
    const url = "https://www.mercadolivre.com.br/";

    await page.goto(url);

    await page.waitForSelector('#cb1-edit');
    await page.type('#cb1-edit', produto);

    await Promise.all([
      page.waitForNavigation(),
      page.click('.nav-search-btn'),
    ])

    await page.waitForSelector('.ui-search-result__wrapper');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.ui-search-result__wrapper');
      const lista = [];
      const loja = "Mercado Livre";

     
      let id = 0;
      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.ui-search-item__title');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.ui-search-item__group__element.ui-search-link');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
        const link = linkProduto;

        const reaisBruto = produto.querySelector('.andes-money-amount.ui-search-price__part.ui-search-price__part--medium.andes-money-amount--cents-superscript > .andes-money-amount__fraction');
        const centavosBruto = produto.querySelector('.andes-money-amount.ui-search-price__part.ui-search-price__part--medium.andes-money-amount--cents-superscript > .andes-money-amount__cents.andes-money-amount__cents--superscript-24');
        const reais = reaisBruto ? reaisBruto.textContent.trim().replace('.', '') : '';
        const centavos = centavosBruto ? centavosBruto.textContent.trim() : '';
        if(centavos)
        {
          precoString = reais + "." + centavos;
        }
        else
        {
          precoString = reais;
        }
        const preco = parseFloat(precoString);

        const imagemBruto = produto.querySelector('.ui-search-result-image__element');
        const imagem = imagemBruto ? imagemBruto.getAttribute('data-src') : '';

        const avaliacaoBruto = produto.querySelector('.ui-search-reviews > .ui-search-reviews__rating-number');
        const avaliacaoString = avaliacaoBruto ? avaliacaoBruto.textContent.trim() : '';
        const avaliacao = parseFloat(avaliacaoString.replace(',', '.'));
        
        const id_fornecedor = 13;
        
        id++;

        lista.push({
          id_fornecedor,
          id,
          loja,
          titulo,
          link,
          preco,
          imagem,
          avaliacao
        })

      })
      return lista;
    })

    await browser.close();

    return scrape;
  }