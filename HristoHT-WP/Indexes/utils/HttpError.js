const HttpError = (error, res) => {
    if (error.name && error.name === `CustomError`) {
        return res.status(error.status).send({ message: error.message });
    } else {
        return res.status(500).send({ message: error.message });
    }
}

module.exports = HttpError;