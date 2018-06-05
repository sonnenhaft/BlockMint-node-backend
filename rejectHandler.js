module.exports = (fn, param) => async (req, res) => {
    if (!req.params[param]) {
        res.send(404)
    } else {
        try {
            await fn(req, res)
        } catch (error) {
            res.status(500).send(error)
        }
    }
};