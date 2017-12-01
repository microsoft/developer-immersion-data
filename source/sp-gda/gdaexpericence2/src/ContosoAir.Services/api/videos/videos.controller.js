const data = require('./videos.data');

let get = (req, res) => {
    data.links.barcelona = process.env.BARCELONA_VIDEO || data.links.barcelona;

    res.send(data);
};

module.exports = {
    get: get
};

