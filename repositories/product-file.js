// Load the node file system module
const fs = require("fs");

// Path/file name to the product data
const DATA_FILE = "./db/product.json";

// Product repository object
let repo = (exports = module.exports = {});

// Retrieve an array of product objects
repo.get = function (resolve, reject) {
  // Read from the file
  fs.readFile(DATA_FILE, function (err, data) {
    if (err) {
      // ERROR: invoke reject() callback
      reject(err);
    } else {
      // SUCCESS: Convert data to JSON
      let products = JSON.parse(data);
      // Invoke resolve() callback
      resolve(products);
    }
  });
};

// Retrieve a single product object
repo.getById = function (id, resolve, reject) {
  fs.readFile(DATA_FILE, function (err, data) {
    if (err) {
      // ERROR: invoke reject() callback
      reject(err);
    } else {
      // SUCCESS: Convert data to JSON
      let products = JSON.parse(data);
      // Find the row by productID
      let product = products.find((row) => row.productID == id);
      // Invoke resolve() callback
      // product is 'undefined' if not found
      resolve(product);
    }
  });
};

// Search for one or many products
repo.search = function (search, resolve, reject) {
  if (search) {
    fs.readFile(DATA_FILE, function (err, data) {
      if (err) {
        // ERROR: invoke reject() callback
        reject(err);
      } else {
        // SUCCESS: Convert data to JSON
        let products = JSON.parse(data);
        // Perform the search
        products = products.filter(
          (row) =>
            (search.name
              ? row.name.toLowerCase().indexOf(search.name.toLowerCase()) >= 0
              : true) &&
            (search.listPrice
              ? parseFloat(row.listPrice) > parseFloat(search.listPrice)
              : true)
        );
        // Invoke resolve() callback
        // Empty array if no records match
        resolve(products);
      }
    });
  }
};
