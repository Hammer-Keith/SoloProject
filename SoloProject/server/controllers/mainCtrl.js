const axios = require("axios");
let searchID = "";

const getBalance = (req, res, next) => {
    searchID = req.params.userNameInput
    axios.get(`https://cryptofresh.com/api/account/balances?account=${searchID}`).then(response => {
        res.json(response.data)
    })
}

module.exports = {
    getBalance
}