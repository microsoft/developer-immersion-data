// private variable's Declaration
var request = require('request');
var config = require('../../config');

var data = '';
var result;
const arr = [];

// Get Azure function url from config file 
var azure_fuction_dealsUrl = config.AZURE_FUNCTION_DEALS_URL;

// functions declaration

// Get data from azure function
let get = (req, res) => {
    request(azure_fuction_dealsUrl, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = body;
            res.send(data);
        }
        else {
            res.send(error);
        }
    })
};

let getSingle = (req, res) => {
    let deals = data.filter(deal => deal.id === req.params.id);
    if (deals.length > 0) {
        return res.send(deals[0]);
    }
    res.send(404);
};

module.exports = {
    get: get,
    getSingle: getSingle
};