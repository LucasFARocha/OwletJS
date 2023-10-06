const natural = require('natural')

exports.createProductGroups = function (products) {
  console.log("Entrou na função createProductGroups");
  const productGroups = {};
  const tokenizer = new natural.WordTokenizer();

  for (const product of products) {
    if (product.titulo) {
      const titleWords = tokenizer.tokenize(product.titulo).slice(0, 4);
      let foundGroup = false;

      for (const groupName in productGroups) {
        const groupTitleWords = tokenizer.tokenize(groupName).slice(0, 4);
        const intersection = getIntersection(titleWords, groupTitleWords);
        const union = getUnion(titleWords, groupTitleWords);

        const similarity = intersection.length / union.length;

        if (similarity > 0.6) {
          productGroups[groupName].push(product.titulo);
          foundGroup = true;
          break;
        }
      }

      if (!foundGroup) {
        const groupName = titleWords.join(" ");
        productGroups[groupName] = [product.titulo];
        console.log("New Group Created:", groupName);
      }
    }
  }

  console.log("Product Groups:", productGroups);

  return productGroups;
}

function getIntersection(arr1, arr2) {
  return arr1.filter(value => arr2.includes(value));
}

function getUnion(arr1, arr2) {
  return [...new Set([...arr1, ...arr2])];
}