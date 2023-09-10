const scraperAmazon = require('./scraperAmazon');
const scraperKabum = require('./scraperKabum');
const fs = require('fs');

// Lista de produtos para pesquisar na Amazon
const pesquisa = ['notebook','mousepad'];

app();

async function app() {
    try{
      // Array para armazenar os resultados finais
      const encontrados = [];
  
      for(const produto of pesquisa)
      {
        //Declara produtos como o resultado da função de scraping
        const produtosAmazon = await scraperAmazon.scrape(produto);
        // Adiciona os produtos encontrados ao array final
        encontrados.push(...produtosAmazon);

        const produtosKabum = await scraperKabum.scrape(produto);
        encontrados.push(...produtosKabum);
      }
      
      //console.log(encontrados);
      fs.writeFile('./produtos.json', JSON.stringify(encontrados), err => err ? console.log(err): null);

    }catch(error){
      console.log("\n" + error);
    }
  }






  //   await Promise.all([
  //       page.waitForNavigation(),
  //       page.click('#nav-search-submit-button'),
  //       // console.log('Pesquisei')
  //   ])

  //   //const ignore = ".puis-label-popover.puis-sponsored-label-text";

  //   await page.waitForSelector('.a-size-base-plus.a-color-base.a-text-normal');
  //   const titulo = await page.$eval('.a-size-base-plus.a-color-base.a-text-normal', element => element.innerText);
  //   const reais = await page.$eval('.a-offscreen', element => element.innerText); 
  //   //const cents = await page.$eval('.a-price-fraction', element => element.innerText); 

  //   //const preco = "R$" + reais;
    
  //   // console.log(titulo);
  //   // console.log(reais);



  // //   await Promise.all([
  // //     page.waitForNavigation(),
  // //     page.click('.s-pagination-separator'),
  // //     console.log('Fui para a próxima página')
  // // ])




  // //   await Promise.all([
  // //     page.waitForNavigation(),
  // //     page.click('.s-image'),
  // //     console.log('Entrei')
  // // ])
  //   //new Promise(r => setTimeout(r, 5000));
  
  //   await browser.close();
  










// const express = require('express');
// //const { default: puppeteer } = require('puppeteer');
// const puppeteer = require('puppeteer');

// const app = express();
// const port = 3000;

// const amazonURLBase = 'https://www.amazon.com.br/s?k=';
// const amazonURL = 'https://www.amazon.com.br';

// // Lista de produtos para pesquisar na Amazon
// const produtosParaPesquisar = ['motorola 64gb 8gb ram', 'mistborn'];

// app.get('/buscarProdutos', async (req, res) => {
//   try {
//     // Array para armazenar os resultados finais
//     const produtosEncontrados = [];

//     // Loop para pesquisar cada produto da lista
//     for (const produto of produtosParaPesquisar) {
//       const products = await scrapeAmazonProducts(produto);

//       // Adiciona os produtos encontrados ao array final
//       produtosEncontrados.push(...products);
//     }

//     // Retorna o resultado da pesquisa em formato JSON
//     res.json(produtosEncontrados);
//   } catch (error) {
//     // Se ocorrer um erro, envia uma resposta com status 500 e mensagem de erro
//     res.status(500).json({ error: 'Ocorreu um erro ao buscar os produtos na Amazon.' });
//   }
// });

// async function scrapeAmazonProducts(nomeProduto) {
//   const browser = await puppeteer.launch({headless: false});
//   const page = await browser.newPage();

//   const url = amazonURLBase + encodeURIComponent(nomeProduto);

//   await page.goto(url, { waitUntil: 'domcontentloaded' });
//   await page.waitForSelector('.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis.puis-v1g4cn23aiw4pq21ytu1qia8qu3.s-latency-cf-section.s-card-border');

//   // Executa o script no contexto da página para extrair os produtos
//   const products = await page.evaluate(() => {
//     const productElements = document.querySelectorAll('.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis.puis-v1g4cn23aiw4pq21ytu1qia8qu3.s-latency-cf-section.s-card-border');
//     const productsList = [];

//     productElements.forEach((product) => {
//       const titleElement = product.querySelector('.a-size-base-plus.a-color-base.a-text-normal');
//       const title = titleElement ? titleElement.textContent.trim() : '';

//       const linkElement = product.querySelector('.a-link-normal.s-no-outline');
//       const link = linkElement ? linkElement.getAttribute('href') : '';
//       //const linkConcat = amazonURL + link;

//       const priceElement = product.querySelector('.a-offscreen');
//       const price = priceElement ? priceElement.textContent.trim() : '';

//       const imageElement = product.querySelector('.s-image');
//       const image = imageElement ? imageElement.getAttribute('src') : '';

//       productsList.push({
//         title,
//         link,
//         price,
//         image,
//       });
//     });

//     return productsList;
//   });

//   await browser.close();

//   // Retorna os produtos extraídos
//   return products;
// }

// app.listen(port, () => {
//   console.log(`Servidor rodando em http://localhost:${port}`);
// });