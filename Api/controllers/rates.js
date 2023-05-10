const createRate = async (req, res) => {
    res.json({ message: "create rate" });
};

const getRates = async (req, res) => {
    res.json({ message: "get rates" });
}

const updateRate = async(req, res) => {
    res.json({ message: "update rate" });
}

const deleteRate = async(req, res) => {
    res.json({ message: "delete rate" });
}

module.exports = {
    createRate,
    getRates,
    updateRate,
    deleteRate,
};