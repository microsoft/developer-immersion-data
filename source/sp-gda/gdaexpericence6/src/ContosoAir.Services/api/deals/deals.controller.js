const data = require('./deals.data');

let get = (req, res) => {
    res.send(data);
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

