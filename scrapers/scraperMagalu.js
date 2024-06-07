const pup = require('puppeteer');

exports.scrape = async function(produto){
    // Launch the browser and open a new blank page
    const browser = await pup.launch({
        headless: 'new',
        //headless: true // (default) enables old Headless;
        //headless: new //enables new Headless;
        // `headless: false` enables “headful” mode.
      });
    const page = await browser.newPage(); 
    const url = "https://www.magazineluiza.com.br/";

    await page.goto(url);

    await page.waitForSelector('#input-search');
    await page.type('#input-search', produto);

    await Promise.all([
      page.waitForNavigation(),
      page.click('.sc-eqUAAy.IubVJ'),
    ])

    await page.waitForSelector('.sc-APcvf.eJDyHN');
    
    const scrape = await page.evaluate(() => {
      const elementos = document.querySelectorAll('.sc-APcvf.eJDyHN');
      const lista = [];
      const loja = "Magazine Luiza";


      let id = 0;
      elementos.forEach((produto) => {
        
        const tituloBruto = produto.querySelector('.sc-eWzREE.uaEbk');
        const titulo = tituloBruto ? tituloBruto.textContent.trim(): '';
        
        const linkBruto = produto.querySelector('.sc-eBMEME');
        // const linkBruto = produto.querySelector('.sc-dxlmjS.gjCMbP');
        const linkProduto = linkBruto ? linkBruto.getAttribute('href'): '';


        const link = "https://www.magazineluiza.com.br" + linkProduto;
        
        const precoBruto = produto.querySelector('.sc-kpDqfm.eCPtRw.sc-hoLEA.kXWuGr');
        const precoString = precoBruto ? precoBruto.textContent.substring(3, precoBruto.length) : '';
        const preco = parseFloat(precoString.replace('.', '').replace(',', '.'));

        const imagemBruto = produto.querySelector('.sc-cWSHoV.bLJsBf');
        const imagem = imagemBruto ? imagemBruto.getAttribute('src') : '';

        const id_fornecedor = 12;
        id++;

        lista.push({
          id_fornecedor,
          id,
          loja,
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