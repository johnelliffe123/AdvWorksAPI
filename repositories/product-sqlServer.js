// Load SQL Server module
let sqlServer = require("mssql");

// Product repository using SQL Server
let repo = {};

const connectionString =
  "Server=Localhost,1433;Database=AdvWorksProducts;User Id=AWPUser;Password=AWPUser123;Encrypt=false";
const selectCols =
  "productID, name, productNumber, color, standardCost, listPrice, modifiedDate";

// Retrieve set of products from SQL Server
repo.get = async function (resolve, reject) {
  // The SQL statement to submit
  let sql = `SELECT ${selectCols} 
              FROM dbo.Product
              ORDER BY name, listPrice`;

  try {
    // Connect to SQL Server
    await sqlServer.connect(connectionString);
    // Submit the SQL query
    const result = await sqlServer.query(sql);
    // SUCCESS: Invoke resolve() callback
    // Return first recordset
    resolve(result.recordset);
  } catch (err) {
    // ERROR: Invoke reject() callback
    reject(err);
  }
};

module.exports = repo;
