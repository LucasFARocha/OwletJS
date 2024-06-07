// const pup = require('puppeteer-extra');
// //const { plugin } = require('puppeteer-with-fingerprints');
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// pup.use(StealthPlugin())
// const {executablePath} = require('puppeteer'); 
// exports.scrape = async function(produto){

//     // Launch the browser and open a new blank page
//     const browser = await pup.launch({
//         headless: false,
//         // `headless: true` (default) enables old Headless;
//         // `headless: 'new'` enables new Headless;
//         // `headless: false` enables “headful” mode.
//         executablePath: executablePath()
//       }).then(async browser => { 
//         const page = await browser.newPage(); 
//         const url = "https://www.amazon.com.br/";

//         await page.goto(url);

//         await page.waitForSelector('#twotabsearchtextbox');
//         await page.type('#twotabsearchtextbox', produto);

//         await Promise.all([
//           page.waitForNavigation(),
//           page.click('#nav-search-submit-button'),
//         ])

//         await page.waitForSelector('.puis-card-container.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis');
        
//         const scrape = await page.evaluate(() => {
//           const elementos = document.querySelectorAll('.puis-card-container.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis');
//           const lista = [];
//           const loja = "Amazon";

//           let id = 0;
//           elementos.forEach((produto) => {
            
//             const tituloBruto = produto.querySelector('.a-size-base-plus.a-color-base.a-text-normal');
//             const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
            
//             const linkBruto = produto.querySelector('.a-link-normal.s-no-outline');
//             const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
//             const link = "https://www.amazon.com.br" + linkProduto;

//             const precoBruto = produto.querySelector('.a-offscreen');
//             const preco = precoBruto ? precoBruto.textContent.trim() : '';

//             const imagemBruto = produto.querySelector('.s-image');
//             const imagem = imagemBruto ? imagemBruto.getAttribute('src') : '';

//             id++;

//             lista.push({
//               id,
//               loja,
//               titulo,
//               link,
//               preco,
//               imagem
//             })

//           })
//           return lista;
//         })

//         await browser.close();

          // return scrape;
//       });
    
//   }

const pup = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pup.use(StealthPlugin())

exports.scrape = async function (produto) {
  try {
    const browser = await pup.launch({
      headless: false,
      executablePath: require('puppeteer').executablePath(),
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

    await page.waitForSelector('.puis-card-container.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis');

    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.puis-card-container.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis');
      const lista = [];
      const loja = "Amazon";


      let id = 0;
      elementos.forEach((produto) => {

        const existePreco = produto.querySelector('.a-offscreen');
        // checa se o preco do produto e 0
        if(existePreco!="0")
        {
          // checa se o produto nao esta em estoque
          if(existePreco==null)
          {
            const precoBruto = produto.querySelector('.a-section.a-spacing-none.a-spacing-top-mini > .a-row.a-size-base.a-color-secondary > .a-color-base');
            // caso nao esteja, procura pela secao "mais ofertas" da Amazon
            if(precoBruto)
            {
              const precoString = precoBruto ? precoBruto.textContent.substring(3, precoBruto.length) : '';
              preco = parseFloat(precoString.replace('.', '').replace(',', '.'));
            }
          }
          // se estiver em estoque, pega as informacoes normalmente
          else
          {
            const tituloBruto = produto.querySelector('.a-size-base-plus.a-color-base.a-text-normal');
            titulo = tituloBruto ? tituloBruto.textContent.trim() : '';

            const linkBruto = produto.querySelector('.a-link-normal.s-no-outline');
            const linkProduto = linkBruto ? linkBruto.getAttribute('href') : '';
            link = "https://www.amazon.com.br" + linkProduto;

            const precoString = existePreco ? existePreco.textContent.substring(3, existePreco.length) : '';
            preco = parseFloat(precoString.replace('.', '').replace(',', '.')); 
            
            const imagemBruto = produto.querySelector('.s-image');
            imagem = imagemBruto ? imagemBruto.getAttribute('src') : '';

            const avaliacaoBruto = produto.querySelector('.a-icon-alt');
            const avaliacaoString = avaliacaoBruto ? avaliacaoBruto.textContent.substring(0, 3) : '';
            avaliacao = parseFloat(avaliacaoString.replace(',', '.'));
            // se avaliacao for null, mostrar "avaliacao indisponivel" no site

            id_fornecedor = 7;

            id++;
          }
        }

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
    });

    await browser.close();
    return scrape;

  } catch (error) {
    console.error('Erro no scraping:', error.message);
    return [];
  }
}

