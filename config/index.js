if (process.env.NODE_ENV === 'production') {
    console.log("pr");
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}