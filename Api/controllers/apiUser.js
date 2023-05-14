// create crud controller for apiUser and res.send the controller function name
const createApiUser = async (req, res) => {
    res.json({ msg: "createApiUser" });
};

const getApiUsers = async (req, res) => {
    res.json({ msg: "getApiUsers" });
};

const getApiUser = async (req, res) => {
    res.json({ msg: "getApiUser" });
};

const updateApiUser = async (req, res) => {
    res.json({ msg: "updateApiUser" });
};

const deleteApiUser = async (req, res) => {
    res.json({ msg: "deleteApiUser" });
};

module.exports = {
    createApiUser,
    getApiUsers,
    getApiUser,
    updateApiUser,
    deleteApiUser,
};
