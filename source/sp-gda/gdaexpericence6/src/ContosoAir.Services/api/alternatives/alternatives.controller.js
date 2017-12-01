const data = require('./alternatives.data');

let get = (req, res) => {
    const protocol = `http${process.env.isLocal ? '' : 's'}`;

    for (let key in data) {
        let item = data[key];
        if (typeof data[key] === 'string') {
            data[key] = data[key].replace('$', `${protocol}://${req.headers.host}`);
        } else {
            for (let subkey in data[key]) {
                let item = data[key][subkey];
                if (typeof data[key][subkey].image === 'string') {
                    data[key][subkey].image = data[key][subkey].image.replace('$', `${protocol}://${req.headers.host}`);
                }
            }
        }
    }
    res.send(data);
};

module.exports = {
    get: get
};

