'use strict';

let Catalog = require('../../../model/Catalog');
let https = require('https');
let Product = Catalog.Product;

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
            PictureUrl: baseUrl + '/api/products/' + p.id + '/picture',
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

let parseAdditionalInformation = function (product) {

    var parsedAddInfo = {};
    if (product.additionalInformation) {
        var moreInfo = JSON.parse(product.additionalInformation);

        parsedAddInfo.genre = getGenre(moreInfo);
        parsedAddInfo.developer = getDeveloper(moreInfo);
        parsedAddInfo.esrb = getEsrb(moreInfo);

        return parsedAddInfo;
    } else {
        return '';
    }
};

let getProducts = function (filter, pageIndex, pageSize, baseUrl) {

    let offset = pageIndex * pageSize;
    // Search filter. '*' means to search everything in the index.
    let search = filter ? filter : '*';
    // Path that will be built depending on the arguments passed.
    let searchPath = '/indexes/products/docs?api-version=2015-02-28&$top=' + pageSize + '&search=' + search;
    // Request needed to get the total number of documents available, so pagination works as expected.
    let totalCountPath = '/indexes/products/docs/$count?api-version=2015-02-28';

    if (offset > 0) {
        searchPath += '&$skip=' + offset;
    }

    return azureSearchRequest(totalCountPath).then(count => {
        return azureSearchRequest(searchPath).then(responseString => {
            var responseObject = JSON.parse(responseString);
            // We map the values not to alter the buildProducts function.
            var mappedResponse = responseObject.value.map((val) => ({
                id: val.Id,
                title: val.Title,
                price: val.Price,
                description: val.Description
            }));
            return buildProducts(mappedResponse, pageIndex, pageSize, baseUrl, parseInt(count,10));
        });
    });
};

let azureSearchRequest = function (requestPath) {
    var options = {
        hostname: '{YOUR_AZURE_SEARCH_NAME}.search.windows.net',
        method: 'GET',
        path: requestPath,
        headers: {
            'api-key': '{YOUR_AZURE_SEARCH_KEY}',
            'Content-Type': 'application/json'
        },
    };

    // Request to get the number of elements.

    let deferred = new Promise((resolve, reject) => {
        var req = https.request(options, function (res) {
            res.setEncoding('utf-8');

            var responseString = '';

            res.on('data', function (data) {
                responseString += data;
            });

            res.on('end', function () {
                console.log(responseString);
                resolve(responseString);
            });
        });

        req.on('error', function (e) {
            reject(e);
            console.error(e);
        });

        req.end();
    });

    return deferred;
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
