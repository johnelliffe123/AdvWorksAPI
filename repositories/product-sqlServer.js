// Load SQL Server module
let sqlServer = require("mssql");

// Load SQL Server module
let db = require("../helpers/sqlserver");

const allProductCols =
  "productID, name, productNumber, color, standardCost, listPrice, modifiedDate";
const insertProductCols =
  "name, productNumber, color, standardCost, listPrice, modifiedDate";

// Product repository using SQL Server
let repo = {};

// Get all products from SQL Server
repo.get = function (resolve, reject) {
  // Create SQL statement to submit
  let sql = `SELECT ${allProductCols}
        FROM dbo.Product
        ORDER BY name, listPrice`;

  // Submit SELECT query
  db.submit(
    sql,
    null,
    function (data) {
      // SUCCESS: Invoke resolve() callback
      // Return data from first
      // recordset in the result set
      resolve(data.recordset);
    },
    function (err) {
      // ERROR: Invoke reject() callback
      reject(err);
    }
  );
};

// Retrieve a single product
repo.getById = function (id, resolve, reject) {
  // Create SQL statement to submit
  let sql = `SELECT ${allProductCols}
      FROM dbo.Product 
      WHERE ProductID = @ProductID`;

  // Create parameter array
  let params = [
    {
      name: "ProductID",
      type: sqlServer.Int,
      value: id,
    },
  ];

  // Submit SELECT query
  db.submit(
    sql,
    params,
    function (data) {
      // SUCCESS: Invoke resolve() callback
      if (data.recordset.length) {
        // Return product object from first
        // recordset in the result set
        resolve(data.recordset);
      } else {
        // Record not found
        resolve(undefined);
      }
    },
    function (err) {
      // ERROR: Invoke reject() callback
      reject(err);
    }
  );
};

// Search for one or many products
repo.search = function (search, resolve, reject) {
  if (search) {
    // Create SQL statement to submit
    let sql = `exec dbo.Product_Search @Name, @ListPrice`;

    // Create parameter array
    let params = [
      {
        name: "Name",
        type: sqlServer.NVarChar,
        value: search.name,
      },
      {
        name: "ListPrice",
        type: sqlServer.Decimal,
        value: search.listPrice,
      },
    ];

    // Submit SELECT query
    db.submit(
      sql,
      params,
      function (data) {
        // SUCCESS: Invoke resolve() callback
        // Return product data from first
        // recordset in the result set
        resolve(data.recordset);
      },
      function (err) {
        // ERROR: Invoke reject() callback
        reject(err);
      }
    );
  }
};

// Create parameters for INSERT and UPDATE
repo.createParams = function (product, id) {
  // Create parameter array
  let params = [
    {
      name: "Name",
      type: sqlServer.NVarChar,
      value: product.name,
    },
    {
      name: "ProductNumber",
      type: sqlServer.NVarChar,
      value: product.productNumber,
    },
    {
      name: "Color",
      type: sqlServer.NVarChar,
      value: product.color,
    },
    {
      name: "StandardCost",
      type: sqlServer.Decimal,
      value: product.standardCost,
    },
    {
      name: "ListPrice",
      type: sqlServer.Decimal,
      value: product.listPrice,
    },
    {
      name: "ModifiedDate",
      type: sqlServer.DateTime,
      value: new Date().toISOString(),
    },
  ];

  if (id) {
    params.push({
      name: "ProductID",
      type: sqlServer.Int,
      value: id,
    });
  }

  return params;
};

// Insert a product into SQL Server
repo.insert = function (newData, resolve, reject) {
  // Create SQL statement to submit
  let sql = `INSERT INTO dbo.Product
      (${insertProductCols})
  VALUES
    (@Name,@ProductNumber,@Color, @StandardCost,@ListPrice,@ModifiedDate);
  SELECT ${allProductCols}
     FROM dbo.Product
     WHERE ProductID = SCOPE_IDENTITY();`;

  // Create parameter array
  let params = repo.createParams(newData, null);

  // Submit SELECT query
  db.submit(
    sql,
    params,
    function (data) {
      // SUCCESS: Invoke resolve() callback
      if (data.rowsAffected[0] == 1) {
        // Return product object from first
        // recordset in the result set
        resolve(data.recordset);
      } else {
        // Record not found
        resolve(undefined);
      }
    },
    function (err) {
      // ERROR: Invoke reject() callback
      reject(err);
    }
  );
};

// Update a product in SQL Server
repo.update = function (changedData, id, resolve, reject) {
  // Create SQL statement to submit
  let sql = `UPDATE dbo.Product
      SET Name = @Name
          ,ProductNumber = @ProductNumber
          ,Color = @Color
          ,StandardCost = @StandardCost
          ,ListPrice = @ListPrice
          ,ModifiedDate = @ModifiedDate
    WHERE ProductID = @ProductID;
    SELECT ${allProductCols}
        FROM dbo.Product
        WHERE ProductID = @ProductID;`;

  // Create parameter array
  let params = repo.createParams(changedData, id);

  // Submit SELECT query
  db.submit(
    sql,
    params,
    function (data) {
      // SUCCESS: Invoke resolve() callback
      if (data.rowsAffected[0] == 1) {
        // Return product object from first
        // recordset in the result set
        resolve(data.recordset);
      } else {
        // Record not found
        resolve(undefined);
      }
    },
    function (err) {
      // ERROR: Invoke reject() callback
      reject(err);
    }
  );
};

// Delete a product in SQL Server
repo.delete = function (id, resolve, reject) {
  // Create SQL statement to submit
  let sql = `DELETE FROM dbo.Product
  WHERE ProductID = @ProductID;`;

  // Create parameter array
  let params = [
    {
      name: "ProductID",
      type: sqlServer.Int,
      value: id,
    },
  ];

  // Submit SELECT query
  db.submit(
    sql,
    params,
    function (data) {
      // SUCCESS: Invoke resolve() callback
      if (data.rowsAffected[0] == 1) {
        // Return a numeric value
        resolve(1);
      } else {
        // Record not found
        resolve(undefined);
      }
    },
    function (err) {
      // ERROR: Invoke reject() callback
      reject(err);
    }
  );
};

module.exports = repo;
