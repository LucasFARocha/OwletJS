const api = require('./api-request/request')
const scraperAmazon = require('./scrapers/scraperAmazon');
// Kabum e muito lerda
// const scraperKabum = require('./scrapers/scraperKabum');
const scraperSub = require('./scrapers/scraperSub');
const scraperMagalu = require('./scrapers/scraperMagalu');
const scraperML = require('./scrapers/scraperMercadoLivre');
const scraperPontoFrio = require('./scrapers/scraperPontoFrio');
const scraperExtra = require('./scrapers/scraperExtra.js');
const scraperCB = require('./scrapers/scraperCB');

const createGroup = require('./createGroups');
const fs = require('fs/promises');

// Lista de produtos para pesquisar nas lojas
const pesquisa = ['Smartphone iPhone'];

async function app() {
  try {
    const encontrados = await Promise.all(
      pesquisa.map(async (produto) => {
        // Remova ou comente a chamada para o scraper da Amazon
        // return await scraperAmazon.scrape(produto);

        const resultados = [];

        // Adicione chamadas para os outros scrapers conforme necessário
        const produtosAmazon = await scraperAmazon.scrape(produto);
        resultados.push(...produtosAmazon);

        const produtosCB = await scraperCB.scrape(produto);
        resultados.push(...produtosCB);

        const produtosExtra = await scraperExtra.scrape(produto);
        resultados.push(...produtosExtra);

        const produtosMagalu = await scraperMagalu.scrape(produto);
        resultados.push(...produtosMagalu);

        const produtosML = await scraperML.scrape(produto);
        resultados.push(...produtosML);

        const produtosPontoFrio = await scraperPontoFrio.scrape(produto);
        resultados.push(...produtosPontoFrio);
        
        const produtosSub = await scraperSub.scrape(produto);
        resultados.push(...produtosSub);
        
        // Retorne os resultados dos outros scrapers
        return resultados;
      })
      //...produtosExtra, ...produtosMagalu, ...produtosML, produtosPontoFrio, ...produtosSub
    );

    const sliceSize = encontrados.length > 2 ? encontrados.length + 3 : encontrados.length + 2;
    const groups = createGroup.createProductGroups(encontrados.flat(), sliceSize);

    const groupProductFormatted = {};

        // Exibe os grupos resultantes
    for (const groupName in groups) {
      if (groups[groupName] && groups[groupName].products.length > 0) {
        const productsList = groups[groupName].products.map((product) => ({
          titulo: product.titulo,
          loja: product.loja,
          preco: product.preco,
          avaliacao: product.avaliacao,
          //avaliacao: product.avaliacao
        }));
        groupProductFormatted[groupName] = {
          products: productsList,
          totalPrice: groups[groupName].totalPrice,
          avgPrice: groups[groupName].avgPrice
        };
      }
    }

    const currentDate = new Date().toISOString().split('T')[0]; // Get the current date

    for (const groupName in groups) {
      if (groups[groupName] && groups[groupName].products.length > 0) {
        const group = groups[groupName];
        
        // Create the group data to save using the /groups endpoint
        const groupData = {
          grp_nome: groupName,
          grp_precomedio: group.avgPrice,
          ctg_id: 2, // Default category_id (You can modify this based on the group)
        };

        try {
          // Save the group data using the /groups endpoint
          const groupResponse = await api.request('http://localhost:3000/groups', 'POST', groupData);

          console.log("Group Response Data", groupResponse);

          const groupCurrent = await api.request('http://localhost:3000/groupsByName/'+groupName, 'GET');
            
          for (const product of group.products) {

              console.log("Product Data", product);
              // Fetch the group ID based on the group name
              // const groupId = await fetchGroupId(groupName); // Not needed anymore

              const productData = {
                pdt_descricao: product.titulo,
                pdt_preco: product.preco,
                pdt_imagem: product.imagem,
                pdt_avaliacao: product.avaliacao,
                pdt_adicionadoem: currentDate, // Set the added date to the current date
                pdt_alteradoem: currentDate, // Set the updated date to the current date
                pdt_link: product.link,
                for_id: product.id_fornecedor,
                grp_id: groupCurrent.grp_id, // Set the group ID based on the created group
              };

              try {
                const apiResponse = await api.request('http://localhost:3000/products', 'POST', productData);
                console.log(`Produto salvo na API:`, apiResponse);
              } catch (error) {
                console.log(`Erro ao salvar o produto na API:`, error);
              }
            }
           
        } catch (error) {
          console.log(`Erro ao criar o grupo:`, error);
        }
      }
    }

    // Save the product data and group information to files (if needed)
    
    fs.writeFile('./produtos.json', JSON.stringify(encontrados), err => err ? console.log(err): null);
    //console.log("Group Product Formatted:", groupProductFormatted);
    fs.writeFile('./groups.json', JSON.stringify(groupProductFormatted), err => err ? console.log(err): null);

    console.log("Operações concluídas com sucesso!");
  } catch (error) {
    console.log("Erro:", error);
  }
}

app();

//     // Exibe os grupos resultantes
//     for (const groupName in groups) {
//       if (groups[groupName] && groups[groupName].products.length > 0) {
//         const productsList = groups[groupName].products.map((product) => ({
//           titulo: product.titulo,
//           loja: product.loja,
//           preco: product.preco,
//           avaliacao: product.avaliacao,
//           //avaliacao: product.avaliacao
//         }));
//         groupProductFormatted[groupName] = {
//           products: productsList,
//           totalPrice: groups[groupName].totalPrice,
//           avgPrice: groups[groupName].avgPrice
//         };
//       }
//     }
//     await fs.writeFile('./produtos.json', JSON.stringify(encontrados.flat()));
//     console.log("Group Product Formatted:", groupProductFormatted);
//     await fs.writeFile('./groups.json', JSON.stringify(groupProductFormatted));

//     console.log("Operações concluídas com sucesso!");
//   } catch (error) {
//     console.log("Erro:", error);
//   }
// }





// for (let i= 0; i < encontrados.length; i++) {
//   const product = encontrados[i];

//   const productData = {
//     pdt_descricao: product.titulo,
//     pdt_preco: product.preco,
//     pdt_imagem: product.imagem,
//     pdt_avaliacao: 4.2,
//     pdt_adicionadoem: '2022-11-11',
//     pdt_alteradoem: '2022-11-11',
//     pdt_link: product.link,
//     for_id: product.id_fornecedor,
//     grp_id: 1, 
//   };

//   try {
//     const apiResponse = await api.request('http://localhost:3000/products', 'POST', productData);
//     console.log(`Produto ${i} salvo na API:`, apiResponse);
//   } catch (error) {
//     console.log(`Erro ao salvar produto ${i} na API:`, error);
//   }
// }
//   } catch (error) {
//     console.log("\n" + error);
//   }
// }



// async function app() {

//   try {

//     // Array para armazenar os resultados finais
//     const encontrados = [];


//     let sliceSize;

//     for (const produto of pesquisa) {
//       const sliceLength = produto.split(" ").length;



//       if (sliceLength <= 2) {
//         sliceSize = sliceLength + 2;
//       } else {
//         sliceSize = sliceLength + 3;
//       }

//       // const produtosCB = await scraperCB.scrape(produto);
//       // encontrados.push(...produtosCB);
     

//       const produtosAmazon = await scraperAmazon.scrape(produto);
//       encontrados.push(...produtosAmazon);

//       // const produtosKabum = await scraperKabum.scrape(produto);
//       // encontrados.push(...produtosKabum);

//       // const produtosPontoFrio = await scraperPontoFrio.scrape(produto);
//       // encontrados.push(...produtosPontoFrio);

//       // const produtosSub = await scraperSub.scrape(produto);
//       // encontrados.push(...produtosSub);

//       // const produtosExtra = await scraperExtra.scrape(produto);
//       // encontrados.push(...produtosExtra);

//       // const produtosMagalu = await scraperMagalu.scrape(produto);
//       // encontrados.push(...produtosMagalu);

//       // const produtosML = await scraperML.scrape(produto);
//       // encontrados.push(...produtosML);

//     }
//     const groups = createGroup.createProductGroups(encontrados, sliceSize);
//     const groupProductFormatted = {};

//     // Exibe os grupos resultantes
//     for (const groupName in groups) {
//       if (groups[groupName] && Array.isArray(groups[groupName]) && groups[groupName].length > 0) {
//         const productsList = groups[groupName].map((product) => ({
//           titulo: product.titulo,
//           loja: product.loja,
//           preco: product.preco,
//           avaliacao: product.avaliacao
//         }));
//         groupProductFormatted[groupName] = productsList;
//       }
//     }



//     fs.writeFile('./produtos.json', JSON.stringify(encontrados), err => err ? console.log(err) : null);

//     console.log("Group Product Formatted:", groupProductFormatted);

//     await new Promise((resolve) => {
//    fs.writeFile('./groups.json', JSON.stringify(groupProductFormatted), (err) => {
//       if (err) console.log(err);
//       resolve();
//    });
// });






