'use strict';

let sequelize = require('../../db/db.sequelize');

let Product = sequelize.import('./Product');

let ProductCategory = sequelize.import('./ProductCategory');

Product.belongsTo(ProductCategory);
ProductCategory.hasMany(Product);

module.exports = {
    Product: Product,
    ProductCategory: ProductCategory,
    sequelize: sequelize
};