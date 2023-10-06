 const scraperAmazon = require('./scraperAmazon');
// const scraperKabum = require('./scraperKabum');
// const scraperSub = require('./scraperSub');
 const scraperMagalu = require('./scraperMagalu');
// const scraperCB = require('./scraperCB');

const createGroup = require('./createGroups');
const fs = require('fs');

// Lista de produtos para pesquisar na Amazon
const pesquisa = ['Notebook Alienware'];

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

        // const produtosKabum = await scraperKabum.scrape(produto);
        // encontrados.push(...produtosKabum);

        // const produtosSub = await scraperSub.scrape(produto);
        // encontrados.push(...produtosSub);

         const produtosMagalu = await scraperMagalu.scrape(produto);
         encontrados.push(...produtosMagalu);

        // const produtosCB = await scraperCB.scrapeCB(produto);
        // encontrados.push(...produtosCB);
      }
      const groups = createGroup.createProductGroups(encontrados);
      const groupProductFormatted = {};

       // Exibe os grupos resultantes
        for (const groupName in groups) 
        {
          const productsList = groups[groupName].join(" / ");
          groupProductFormatted[groupName] = productsList;
        }

        //console.log(encontrados);
        fs.writeFile('./produtos.json', JSON.stringify(encontrados), err => err ? console.log(err): null);
        
        console.log("Group Product Formatted:", groupProductFormatted);
        fs.writeFile('./groups.json', JSON.stringify(groupProductFormatted), err => err ? console.log(err): null);

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

// const scraperAmazon = require('./scraperAmazon');
// const fs = require('fs');
// const createGroup = require('./createGroups');

// const app = express();
// const port = 3000;

// //const amazonURLBase = 'https://www.amazon.com.br/s?k=';

// // Lista de produtos para pesquisar na Amazon
// const produtosParaPesquisar = ['Smartphone motorola'];

// app.get('/buscarProdutos', async (req, res) => {
//   try {
//     // Array para armazenar os resultados finais
//     const produtosEncontrados = [];

//     // Loop para pesquisar cada produto da lista
//     for (const produto of produtosParaPesquisar) {
//       const products = await scraperAmazon.scrape(produto);

//       // Adiciona os produtos encontrados ao array final
//       produtosEncontrados.push(...products);
//     }

//     const groups = createGroup.createProductGroups(produtosEncontrados);
//     const groupProductFormatted = {};

//       // Exibe os grupos resultantes
//       for (const groupName in groups)
//       {
//         const productsList = groups[groupName].join(" / ");
//         groupProductFormatted[groupName] = productsList;
//       }

//     //console.log(encontrados);
//     fs.writeFile('./produtos.json', JSON.stringify(produtosEncontrados), err => err ? console.log(err): null);
//     console.log("Group Product Formatted:", groupProductFormatted);
//     fs.writeFile('./groups.json', JSON.stringify(groupProductFormatted), err => err ? console.log(err): null);

//     // Retorna o resultado da pesquisa em formato JSON
//     res.json(produtosEncontrados);
//   } catch (error) {
//     // Se ocorrer um erro, envia uma resposta com status 500 e mensagem de erro
//     res.status(500).json(error);
//     console.log(error);
//   }
// });

// async function scrapeAmazonProducts(nomeProduto) {
//   const browser = await puppeteer.launch({headless: false});
//   const page = await browser.newPage();

//   const url = amazonURLBase + encodeURIComponent(nomeProduto);

//   await page.goto(url, { waitUntil: 'domcontentloaded' });
//   await page.waitForSelector('.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis');

//   // Executa o script no contexto da página para extrair os produtos
//   const products = await page.evaluate(() => {
//     const productElements = document.querySelectorAll('.s-card-container.s-overflow-hidden.aok-relative.puis-expand-height.puis-include-content-margin.puis');
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