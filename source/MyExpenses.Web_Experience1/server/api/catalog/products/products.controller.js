'use strict';

var productService = require('./products.service');

const restify = require('restify');

let getProducts = function (req, res, next) {

    let filter = req.query.filter;

    let base_url = req.root_url;

    let pageIndex = parseInt(req.query.pageIndex || '0', 10);

    let pageSize = parseInt(req.query.pageSize || '10', 10);

    productService.getProducts(filter, pageIndex, pageSize, base_url)
        .then(products => {

            if (Array.isArray(products) && products.length === 0) {
                res.send(new restify.NotFoundError());
                next();
            }

            res.json(products);
        })
        .catch(err => {
            console.log(err);
            res.send(500, err);
            next();
        });
};

let getPicture = function (req, res, next) {

    let productId = req.params.productId;

    let pictureType = req.query.pictureType || '1';

    if (!productId) {
        res.send(new restify.BadRequestError('Invalid product id'));
        next();
        return;
    }

    productService.getPicture(productId, pictureType)
        .then(picture => {

            if (!picture || picture == '' || picture == null) {
                res.send(new restify.NotFoundError());
                next();
            } else {
                res.writeHead(200, { 'Content-Type': 'image/jpeg' });
                res.end(picture);
                next();
            }
        })
        .catch(err => {
            console.log(err);
            res.send(500, err);
            next();
        });
};

module.exports = {
    getProducts: getProducts,
    getPicture: getPicture
};
