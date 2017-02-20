'use strict';
let sequelizeMaster = require('./db/db.sequelize').sequelizeMaster;
let sequelize = require('./db/db.sequelize').sequelize;
let sequelizeDWH = require('./db/db.sequelize').sequelizeDWH;



var scriptExecuter = require('./executer').scriptExecuter;
var multipleScriptExecuter = require('./executer').multipleScriptExecuter;


var dns = require('dns');


let scriptCreation = 'scripts/CreateExpensesDatabase.sql';
let scriptTablesCreation = 'scripts/CreateExpensesTables.sql';

let scriptCreationBig = 'scripts/DWHDatabaseCreationScript.sql';
let scriptTablesCreationBig = 'scripts/DWHDatabaseTablesCreationScript.sql';
let scriptInsertionBig = 'scripts/DWHPopulateDataScript.sql';

let scriptsInsertion = [
'scripts/Team.sql',
'scripts/Employee.sql',
'scripts/ProductCategory.sql',
'scripts/Product.sql', 
'scripts/CostCenter.sql', 
'scripts/ExpenseReportSmall.sql', 
'scripts/ExpenseCategory.sql', 
'scripts/ExpenseSmall.sql', 
'scripts/SuspiciousExpenseSmall.sql', 
'scripts/BuyerCategory.sql', 
'scripts/EmployeePurchase.sql', 
'scripts/PurchaseOrder.sql', 
'scripts/PurchaseOrderItem.sql', 
'scripts/Picture.sql', 
'scripts/PermissionMap.sql'
];

let scriptsInsertionBig = scriptsInsertion.slice();
scriptsInsertionBig.push(scriptInsertionBig)

function promiseDelay(delay) {
    return new Promise(function(resolve, reject){
        setTimeout(resolve, delay);
    });
}

function retry(operation, delay) {
    return operation() // run the operation
        .catch(function(reason) { // if it fails
            console.log("Database still down.  Retrying in " + delay + " milliseconds.");
            return promiseDelay(delay) // delay 
               // retry with same time
               .then(retry.bind(null, operation, delay)); 
    });
}

 var callbackDatabaseCreation = function() { 
        sequelizeMaster.close();
        sequelize.authenticate()
            .then(function(err) {
              scriptExecuter(scriptTablesCreation, callbackCreation, sequelize)
            });  
 };

var callbackDatabaseCreationBig = function() { 
        sequelizeMaster.close();
        sequelizeDWH.authenticate()
            .then(function(err) {
              scriptExecuter(scriptTablesCreationBig, callbackCreationBig, sequelizeDWH)
            });  
 };

 var callbackCreationBig = function() { 
         console.log("Finished Creation.");
         console.log("Starting BIG Insertion. This may take a while.");
         multipleScriptExecuter(scriptsInsertionBig, callBackInsertion, sequelizeDWH);
 };

 var callbackCreation = function() { 
        console.log("Finished Creation.");
        multipleScriptExecuter(scriptsInsertion, callBackInsertion, sequelize)
         
 };

 var callBackInsertion = function() { 
        console.log("Finished Insertion.");
        console.log("");
        process.exit();  
 };




var execute = function(key) {

    dns.lookup(sequelize.config.host, function(err, result) {
        console.log("Trying to connect to host: [" + result + "]");
    });

    return sequelizeMaster.authenticate()
            .then(function(err) {
                console.log("Connected to database.");
                if(key == 1){
                    scriptExecuter(scriptCreation, callbackDatabaseCreation, sequelizeMaster);
                }

                if(key == 2){
                    scriptExecuter(scriptCreationBig, callbackDatabaseCreationBig, sequelizeMaster);
                }
            });  
};

var menuPrinter = function (){
console.log(" ");
console.log("MyExpenses Seed Data loader");
console.log("===========================");
console.log(" ");
console.log("Please select Seed method:");
console.log(" ");
console.log("  1.- General (fast) data load.");
console.log("  2.- ColumnStore Index (huge & slow) data load.");
console.log(" ");
console.log(" ");
console.log("Enter 1 or 2 method:");

    var stdin = process.openStdin();
    stdin.addListener("data", function(key) {

console.log("You entered: " + key.toString());

    if(key != 1 && key != 2 ) {
    console.log("Please, enter 1 or 2");
    }
    execute(key);
  });

};

if (process.argv.length === 3){
    var option = process.argv[2];
    console.log("Executing with parameters: " + option);

    retry(execute.bind(null, option), 30000)
        .timeout(300000);

} else {
    menuPrinter();
}



















