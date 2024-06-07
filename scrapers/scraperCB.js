const pup = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pup.use(StealthPlugin())

exports.scrape = async function(produto){
    // Launch the browser and open a new blank page
    const browser = await pup.launch({
        headless: false,
        executablePath: require('puppeteer').executablePath(),
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
      page.click('.search__icon'),
    ])

    await page.waitForSelector('.dsvia-link-box.dsvia-product-card.css-1kfhk5w');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.dsvia-link-box.dsvia-product-card.css-1kfhk5w');
      const lista = [];
      const loja = "Casas Bahia";
      let id = 0;
      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.product-card__title');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.dsvia-link-overlay.css-1ogn60p');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
        const link = linkProduto;

        const precoBruto = produto.querySelector('.product-card__highlight-price');
        const precoString = precoBruto ? precoBruto.textContent.substring(3, precoBruto.length) : '';
        const preco = parseFloat(precoString.replace('.', '').replace(',', '.'));
        // se o preco for null, mostrar "produto indisponivel" no site

        const imagemBruto = produto.querySelector('.product-card__image');
        const imagem = imagemBruto ? imagemBruto.getAttribute('src') : '';
        const id_fornecedor = 10;
        
        const avaliacaoBruto = produto.querySelector('.dsvia-rating > .css-1vmkvrm');
        const avaliacaoString = avaliacaoBruto ? avaliacaoBruto.textContent.split(" ", 1)[0] : '';
        const avaliacao = parseFloat(avaliacaoString);

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