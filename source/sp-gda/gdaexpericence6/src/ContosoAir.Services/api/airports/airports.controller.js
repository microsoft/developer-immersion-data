const data = require('./airports.data');

let get = (req, res) => {
    res.send(data);
};

let getSingle = (req, res) => {
    let airports = data.filter(airport => airport.code === req.params.id);
    if (airports.length > 0) {
        return res.send(airports[0]);
    }

    res.send(404);
};

module.exports = {
    get: get,
    getSingle: getSingle
};

