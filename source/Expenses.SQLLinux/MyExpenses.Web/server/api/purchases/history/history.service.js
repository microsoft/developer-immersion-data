'use strict';
let employeeQueryService = require('../../../querys/query.employee.js');

let Purchase = require('../../../model/Purchase');

let PurchaseOrder = Purchase.PurchaseOrder;
let PurcharseOrderItem = Purchase.PurchaseOrderItem;

let sequelize = Purchase.sequelize;

const messages = require('../../../locales/messages');

let ApplicationError = require('../../../error/ApplicationError');

let getPurchasesHistory = function (buyerEmail) {

    return employeeQueryService.getEmployeeByUserName(buyerEmail).then(function (employee) {

        if (!employee)
            throw new ApplicationError(messages.EmployeeNotExist, 400);

        return PurchaseOrder.findAll(
            {
                where: { employeeId: employee.id },
                include: [PurcharseOrderItem],
                raw: true,
                order: sequelize.literal('[PurchaseOrderItems].PurchaseDate desc')
            }).then(function (rows) {
                var res = [];
                rows.forEach(function (po) {
                    var poi = {};
                    poi.Date = po['PurchaseOrderItems.purchaseDate'];
                    poi.Price = po['PurchaseOrderItems.price'];
                    poi.ProductName = po['PurchaseOrderItems.productName'];
                    poi.Quantity = po['PurchaseOrderItems.itemsNumber'];
                    res.push(poi);
                });

                return res;
               
            });
       
    });
};

module.exports = {
    getPurchasesHistory: getPurchasesHistory
};