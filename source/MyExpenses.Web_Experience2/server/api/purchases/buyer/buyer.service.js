'use strict';

let employeeQueryService = require('../../../querys/query.employee.js');

let Purchase = require('../../../model/Purchase');
let Catalog = require('../../../model/Catalog');

let Product = Catalog.Product;

let EmployeePurchase = Purchase.EmployeePurchase;
let BuyerCategory = Purchase.BuyerCatergory;
let PurchaseOrder = Purchase.PurchaseOrder;
let PurcharseOrderItem = Purchase.PurchaseOrderItem;
let AccountMovement = Purchase.AccountMovement;
let sequelize = Purchase.sequelize;

let messages = require('../../../locales/messages');
let ApplicationError = require('../../../error/ApplicationError');

let getCompanyPointsEmployee = function (email) {

    return employeeQueryService.getEmployeeByUserName(email).then(function (employee) {

        if (!employee)
            throw new ApplicationError(messages.EmployeeNotExist, 400);

        return EmployeePurchase.findOne({ where: { employeeId: employee.id } }).then(function (emplPurchase) {
            if (!emplPurchase)
                return { CurrentCompanyPoints: 0 };

            return { CurrentCompanyPoints: emplPurchase.points };
            
        });
    });

};

let purcharseGift = function (userName, purchase) {

    var prodId = parseInt(purchase.productId, 10);

    if (!prodId) {
        throw new ApplicationError(messages.InvalidProductId, 400);
    }

    return employeeQueryService.getEmployeeByUserName(userName).then(function (employee) {
        if (!employee)
            throw new ApplicationError(messages.EmployeeNotExist, 400);

        return Product.findById(prodId).then(function (product) {
            if (!product) {
                throw new ApplicationError(messages.InvalidProductId, 400);
            }

            return EmployeePurchase.findOne({ where: { employeeId: employee.id }, include: [BuyerCategory] }).then(function (emplPurchase) {
                if (!emplPurchase)
                    throw new ApplicationError(messages.NoPoints);

                var reason = 'Purchased ' + purchase.units + ' unit(s) of ' + product.title + '. Unit price:' + product.price;
                var points = product.price * parseInt(purchase.units, 10);

                if (points < 0)
                    throw new ApplicationError(messages.CantAddNegativePointsIntoAccount);

                if (emplPurchase.points < points) {
                    throw new ApplicationError(messages.NotEnoughPointInAccount);
                }

                let accountMovement = {
                    movement: -points,
                    notes: reason,
                    movementDate: Date.now(),
                    employeeId: employee.id
                };

                return sequelize.transaction(function (t) {

                    emplPurchase.points = emplPurchase.points - points;

                    return emplPurchase.save({ transaction: t }).then(function () {

                        return AccountMovement.create(accountMovement, { transaction: t }).then(function () {

                            return PurchaseOrder.create({
                                employeeId: employee.id
                            }, { transaction: t }).then(function (po) {

                                return PurcharseOrderItem.create({
                                    purchaseHistoryId: po.id,
                                    productId: product.id,
                                    productName: product.title,
                                    price: product.price,
                                    itemsNumber: parseInt(purchase.units, 10),
                                    purchaseDate: Date.now(),
                                }, { transaction: t });
                            });
                        });
                    });

                });

            });

        });

    });
   
};

module.exports = {
    getCompanyPointsEmployee: getCompanyPointsEmployee,
    purcharseGift: purcharseGift
};
