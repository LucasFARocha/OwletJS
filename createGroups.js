// const natural = require('natural');
// const fs = require('fs');

// exports.createProductGroups = function (products, sliceSize) {
//   const productGroups = {};
//   const tokenizer = new natural.WordTokenizer();

//   const lojas = ['Amazon', 'Submarino', 'Magalu']; // Lista de lojas

//   for (const product of products) {
//     if (product.titulo) {
//       const titleWords = tokenizer.tokenize(product.titulo).slice(0, sliceSize);

//       // Adiciona o produto a grupos existentes, se possível
//       let addedToExistingGroup = false;

//       for (const groupName in productGroups) {
//         const groupTitleWords = tokenizer.tokenize(groupName).slice(0, sliceSize);
//         const intersection = getIntersection(titleWords, groupTitleWords);
//         const union = getUnion(titleWords, groupTitleWords);

//         const similarity = intersection.length / union.length;

//         if (similarity > 0.6 && !productGroups[groupName].some(prod => prod.loja === product.loja)) {
//           productGroups[groupName].push(product);
//           addedToExistingGroup = true;
//           break;
//         }
//       }

//       // Se o produto não foi adicionado a nenhum grupo existente, tenta adicionar a um novo grupo
//       if (!addedToExistingGroup) {
//         let addedToNewGroup = false;

//         for (const groupName in productGroups) {
//           const groupTitleWords = tokenizer.tokenize(groupName).slice(0, sliceSize);
//           const intersection = getIntersection(titleWords, groupTitleWords);
//           const union = getUnion(titleWords, groupTitleWords);

//           const similarity = intersection.length / union.length;

//           if (similarity > 0.6 && lojas.every(loja => productGroups[groupName].some(prod => prod.loja === loja))) {
//             productGroups[groupName].push(product);
//             addedToNewGroup = true;
//             break;
//           }
//         }

//         // Se o produto não foi adicionado a nenhum grupo, cria um novo grupo com o produto
//         if (!addedToNewGroup) {
//           const groupName = titleWords.join(" ");
//           productGroups[groupName] = [product];
//           console.log("New Group Created:", groupName);
//         }
//       }
//     }
//   }

//   console.log("Product Groups:", productGroups);

//   return productGroups;
// };

// function getIntersection(arr1, arr2) {
//   return arr1.filter(value => arr2.includes(value));
// }

// function getUnion(arr1, arr2) {
//   return [...new Set([...arr1, ...arr2])];
// }

// Restante do seu código...

  
  // Restante do seu código...
  
  // createGroups.js


                                                    //O ORIGINAL É ESSE 07/11

// const natural = require('natural');
// const stopword = require('stopword');
// const tokenizer = new natural.WordTokenizer();

// exports.createProductGroups = function (products, sliceSize) {
//   const productGroups = {};

//   for (const product of products) {
//     if (product.titulo) {
//       // Tokenização, remoção de stopwords e lematização
//       const titleWords = tokenizer.tokenize(product.titulo.toLowerCase());
//       const filteredWords = stopword.removeStopwords(titleWords);
//       const lemmatizedWords = filteredWords.map(word => natural.PorterStemmer.stem(word));

//       const foundGroup = findGroup(productGroups, lemmatizedWords, sliceSize, product);

//       if (!foundGroup) {
//         const groupName = lemmatizedWords.join(" ");
//         productGroups[groupName] = [product];
//         console.log("New Group Created:", groupName);
//       }
//     }
//   }

//   console.log("Product Groups:", productGroups);

//   return productGroups;
// };

// function findGroup(productGroups, titleWords, sliceSize, product) {
//   for (const groupName in productGroups) {
//     const groupWords = groupName.split(" ");
//     const intersection = getIntersection(titleWords, groupWords);
//     const union = getUnion(titleWords, groupWords);

//     const similarity = intersection.length / union.length;

//     if (similarity > 0.7) {
//       productGroups[groupName].push(product);
//       console.log("Added to Group:", groupName);
//       return true;
//     }
//   }

//   return false;
// }

// function getIntersection(arr1, arr2) {
//   return arr1.filter(value => arr2.includes(value));
// }

// function getUnion(arr1, arr2) {
//   return Array.from(new Set([...arr1, ...arr2]));
// };


// 19/11 ORIGINAL 

// const natural = require('natural');
// const stopword = require('stopword');
// const tokenizer = new natural.WordTokenizer();

// exports.createProductGroups = function (products, sliceSize) {
//   const productGroups = {};

//   for (const product of products) {
//     if (product.titulo) {
//       // Tokenização, remoção de stopwords e lematização
//       const titleWords = tokenizer.tokenize(product.titulo.toLowerCase());
//       const filteredWords = stopword.removeStopwords(titleWords);
//       const lemmatizedWords = filteredWords.map(word => natural.PorterStemmer.stem(word));

       

      

//       const foundGroup = findGroup(productGroups, lemmatizedWords, sliceSize, product);

//       if (!foundGroup) {
//         const groupName = lemmatizedWords.join(" ");
//         productGroups[groupName] = {
//           products: [product],
//           totalPrice: product.preco,
//           avgPrice: product.preco,
//         };
//         console.log("New Group Created:", groupName);
//       }
//     }
//   }

//   // Adiciona o preço médio para cada grupo
//   for (const groupName in productGroups) {
//     const group = productGroups[groupName];
//     const numProducts = group.products.length;

//     if (numProducts > 1) {
//       group.avgPrice = parseFloat((group.totalPrice / numProducts).toFixed(2));
//     }
//   }

//   console.log("Product Groups:", productGroups);

//   return productGroups;
// };

// function findGroup(productGroups, titleWords, sliceSize, product) {
//   for (const groupName in productGroups) {
//     const groupWords = groupName.split(" ");
//     const intersection = getIntersection(titleWords, groupWords);
//     const union = getUnion(titleWords, groupWords);

    

//     const similarity = intersection.length / union.length;

//     if (similarity > 0.8 ) {
//       productGroups[groupName].products.push(product);
//       productGroups[groupName].totalPrice += product.preco;
//       console.log("Added to Group:", groupName);
//       return true;
//     }
        
//   }

//   return false;

// }

// function getIntersection(arr1, arr2) {
//   return arr1.filter(value => arr2.includes(value));
// }

// function getUnion(arr1, arr2) {
//   return Array.from(new Set([...arr1, ...arr2]));
// };


const natural = require('natural');
const stopword = require('stopword');
const tokenizer = new natural.WordTokenizer();

exports.createProductGroups = function (products, sliceSize) {
  const productGroups = {};

  for (const product of products) {
    if (product.titulo) {
      // Tokenization, removal of stopwords, and lemmatization
      const titleWords = tokenizer.tokenize(product.titulo.toLowerCase());
      const filteredWords = stopword.removeStopwords(titleWords);
      const lemmatizedWords = filteredWords.map(word => natural.PorterStemmer.stem(word));

      const foundGroup = findGroup(productGroups, lemmatizedWords, sliceSize, product);

      if (!foundGroup) {
        const groupName = lemmatizedWords.join(" ");
        productGroups[groupName] = {
          products: [product],
          totalPrice: product.preco,
          avgPrice: product.preco,
        };
        console.log("New Group Created:", groupName);
      }
    }
  }

  // Remove groups with only one product
  for (const groupName in productGroups) {
    const group = productGroups[groupName];
    const numProducts = group.products.length;

    if (numProducts <= 1) {
      delete productGroups[groupName];
      console.log("Removed Group with one product:", groupName);
    } else {
      // Add average price for groups with more than one product
      group.avgPrice = parseFloat((group.totalPrice / numProducts).toFixed(2));
    }
  }

  console.log("Product Groups:", productGroups);

  return productGroups;
};

function findGroup(productGroups, titleWords, sliceSize, product) {
  for (const groupName in productGroups) {
    const groupWords = groupName.split(" ");
    const intersection = getIntersection(titleWords, groupWords);
    const union = getUnion(titleWords, groupWords);

    const similarity = intersection.length / union.length;

    if (similarity > 0.8 ) {
      productGroups[groupName].products.push(product);
      productGroups[groupName].totalPrice += product.preco;
      console.log("Added to Group:", groupName);
      return true;
    }
  }

  return false;
}

function getIntersection(arr1, arr2) {
  return arr1.filter(value => arr2.includes(value));
}

function getUnion(arr1, arr2) {
  return Array.from(new Set([...arr1, ...arr2]));
};

  // const natural = require('natural');


  // exports.createProductGroups = function (products, sliceSize) {
  //   const productGroups = {};
  //   const tokenizer = new natural.WordTokenizer();

  //   for (const product of products) {
  //     if (product.titulo) {
  //       const titleWords = tokenizer.tokenize(product.titulo).slice(0, sliceSize);
  //       let foundGroup = false;

  //       for (const groupName in productGroups) {
  //         const groupTitleWords = tokenizer.tokenize(groupName).slice(0, sliceSize);
  //         const intersection = getIntersection(titleWords, groupTitleWords);
  //         const union = getUnion(titleWords, groupTitleWords);

  //         const similarity = intersection.length / union.length;

  //         if (similarity > 0.6) {
  //           productGroups[groupName].push(product);
  //           foundGroup = true;
  //           break;
  //         }
  //       }

  //       if (!foundGroup) {
  //         const groupName = titleWords.join(" ");
  //         productGroups[groupName] = [product];
  //         console.log("New Group Created:", groupName);
  //       }
  //     }
  //   }

  //   console.log("Product Groups:", productGroups);

  //   return productGroups;

  // };

  
  