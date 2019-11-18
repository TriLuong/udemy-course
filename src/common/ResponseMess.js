function ResponseError(res, code, message) {
  res.status(code).send({ code, message });
}

function ResponseSuccess(res, data) {
  res.send(data);
}

module.exports = { ResponseError, ResponseSuccess };
