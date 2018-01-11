const axios = require("axios");
let searchID = "";

const getBalance = (req, res, next) => {
    //console.log(req.params)
    searchID = req.params.id
    axios.get(`https://cryptofresh.com/api/account/balances?account=${searchID}`).then(response => {
       // console.log(response.data)
        res.json(response.data)
    })
}

module.exports = {
    getBalance
}