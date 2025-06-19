const axios = require('axios')
const config = require('../config/environment');
class SearchController {
    static async search(req, res){
        try{
            const token = req.body.token
            const search_q = req.body.q
            const category_id = req.body.category_id
            const limit = req.body.limit

            const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?
            q=${search_q}&
            category_id=${category_id}&
            limit = ${limit}`
            const response = await axios.get(url, {
                headers: {
                    'Authorization' : `Bearer ${token}`,
                    'X-EBAY-C-MARKETPLACE-ID' : 'EBAY_US'
                }
            })
            const data = response.data
            res.json(data)
            if (!data.itemSummaries || data.itemSummaries.length === 0) {
                return res.status(404).json({ error: 'No search results found' });
            }
        } catch(error) {
            console.error('Error getting search results: ', error)
            res.status(500).send('Error executing search')
        }
    }
       
}

module.exports = SearchController;