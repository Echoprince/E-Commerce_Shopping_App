const get404Error = (req, res, next) => {
return res.status(404)
.json({error: true, message: 'Sorry the page does not exist'})
}

module.exports = {get404Error}

