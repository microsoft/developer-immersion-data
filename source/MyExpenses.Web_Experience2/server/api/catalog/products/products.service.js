'use strict';

let Catalog = require('../../../model/Catalog');

let Product = Catalog.Product;
let sequelize = Catalog.sequelize;

let buildProducts = (products, pageIndex, pageSize, baseUrl, counts) => {
    let vm = {};

    vm.PageIndex = pageIndex;
    vm.PageSize = pageSize;
    vm.TotaCount = counts;
    vm.TotalPages = Math.ceil(counts / pageSize);
    vm.HasPreviousPage = pageIndex > 0;
    vm.HasNextPage = ((pageIndex + 1) < vm.TotalPages);
    vm.Items = [];

    products.forEach((p) => {
        var moreInfo = parseAdditionalInformation(p);
       
        vm.Items.push({
            Id: p.id,
            Title: p.title,
            Price: p.price,
            ExternalPicture: moreInfo.picture,
            // PictureUrl: baseUrl + '/api/products/' + p.id + '/picture',
            Description: p.description,           
            Genre: moreInfo.genre,
            Developer: moreInfo.developer,
            Esrb: moreInfo.esrb
        });
    });

    return vm;
};

let getDeveloper = function (addInfo) {
    try {
        return addInfo.Data.Game.Developer;
    } catch (e) {
        return '';
    }
};

let getEsrb = function (addInfo) {
    try {
        return addInfo.Data.Game.ESRB;
    } catch (e) {
        return '';
    }
};

let getGenre = function (addInfo) {
    try {
        var genre = '';

        if (Array.isArray(addInfo.Data.Game.Genres.genre)) {

            addInfo.Data.Game.Genres.genre.forEach(function (g) {
                genre = genre + g + ', ';
            });

            genre = genre.substring(0, genre.length - 2);
        } else {
            genre = addInfo.Data.Game.Genres.genre;
        }

        return genre;
    } catch (e) {   
        return '';
    }
};

let getPic = function (addInfo) {
    try {
        return addInfo.Data.baseImgUrl + addInfo.Data.Game.Images.boxart['-thumb'];
    } catch (e) {
        return '';
    }
};

let parseAdditionalInformation = function (product) {

    var parsedAddInfo = {};
    if (product.additionalInformation) {
        var moreInfo = JSON.parse(product.additionalInformation);

        parsedAddInfo.genre = getGenre(moreInfo);
        parsedAddInfo.developer = getDeveloper(moreInfo);
        parsedAddInfo.esrb = getEsrb(moreInfo);
        parsedAddInfo.picture = getPic(moreInfo);

        return parsedAddInfo;
    } else {
        return '';
    }
};

let getProducts = function (filter, pageIndex, pageSize, baseUrl) {

    let offset = pageIndex * pageSize;

    var conditions = {
       
        attributes: { exclude: ['largePicture', 'thumbnailPicture'] },
        order: [[sequelize.col('title')]],
        offset: offset, // skip pages
        limit: pageSize // fecth pageSize
    };

    conditions.where = conditions.where || {};

    if (filter) {
        conditions.where.title = { $like: '%' + filter + '%' };
    }

    return Product.findAndCount(conditions).then((res) => {
        return buildProducts(res.rows, pageIndex, pageSize, baseUrl, res.count);
    });

};

let getPicture = function (productId, pType) {

    return Product.findOne({ where: [{ id: productId }] }).then(function (prod) {

        if (!prod)
            return null;
        
        var picType = pType ? pType : '1';
        if (picType == '1') {
            return prod.thumbnailPicture;
        } else {
            return prod.largePicture;
        }
    });
};

module.exports = {
    getProducts: getProducts,
    getPicture: getPicture
};
