'use strict';

let sequelize = require('../../db/db.sequelize');

let EmployeePurchase = sequelize.import('./EmployeePurchase');

let BuyerCatergory = sequelize.import('./BuyerCategory');

let Employee = sequelize.import('../Expenses/Employee');
let AccountMovement = sequelize.import('./AccountMovement');

let PurchaseOrder = sequelize.import('./PurchaseOrder');
let PurchaseOrderItem = sequelize.import('./PurchaseOrderItem');

EmployeePurchase.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasOne(EmployeePurchase, { foreignKey: 'employeeId' });

EmployeePurchase.belongsTo(BuyerCatergory, { foreignKey: 'buyerCategoryId' });

PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'purchaseHistoryId' });
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'purchaseHistoryId' });

PurchaseOrder.belongsTo(Employee, { foreignKey: 'employeeId' });
Employee.hasMany(PurchaseOrder, { foreignKey: 'employeeId' });

module.exports = {
    EmployeePurchase: EmployeePurchase,
    BuyerCatergory: BuyerCatergory,
    Employee: Employee,
    AccountMovement: AccountMovement,
    PurchaseOrder: PurchaseOrder,
    PurchaseOrderItem: PurchaseOrderItem,
    sequelize: sequelize
};

