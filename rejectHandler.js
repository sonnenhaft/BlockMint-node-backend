module.exports = fn => async (req, res) => {
    try {
        await fn(req, res)
    } catch (error) {
        res.status(500).send(error)
    }
};