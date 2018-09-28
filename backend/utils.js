module.exports = instanse => (Object.assign({},
    ...Object.keys(instanse._doc).map(key => ({
            [key.includes('_') ? key.substr(1) : key]: instanse[key]
        })
    )));
