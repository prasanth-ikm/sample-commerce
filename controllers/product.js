const ProductTable = require("../models/product");
const { responseHandler } = require("./response");

exports.addProduct = async (req, res) => {
    try {
        let data = new ProductTable(req.body)
        await data.save();
        responseHandler.success(res, data, "Product Added Successfully", 200)

    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
};

exports.updateProduct = async (req, res) => {
    try {
        let data = await ProductTable.updateMany({ _id: req.params.id }, {
            $set: { ...req.body }
        })
        responseHandler.success(res, data, "Product Updated Successfully", 200)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.listAllProduct = async (req, res) => {
    try {
        const { size = 10, page = 0, total } = req.query;
        let data = await ProductTable.find().sort({ "created": -1 });
        responseHandler.paginated(res,
            data,
            { size, page, total: data?.length || total },
            'Fetched success',
            200)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.listByCategory = async (req, res) => {
    try {
        if (req.params) {
            const { mainCategory = '' } = req.params;
            const { size = 10, page = 0, total } = req.query;
            if (mainCategory) {
                let data = await ProductTable.find({ mainCategory: mainCategory }).sort({ "created": -1 });
                responseHandler.paginated(
                    res,
                    data,
                    { size, page, total: data?.length || total },
                    'Fetched success',
                    200
                )
            } else responseHandler.error(res, 'Params missing', 500)
        } else responseHandler.error(res, 'Params missing', 500)
    } catch (err) {
        if (err) {
            responseHandler.error(res, err.message, 500)
        }
    }
}

exports.getById = async (req, res) => {
    if (req.params.id && req.params.id !== "undefined") {
        try {
            let data = await ProductTable.findById({ _id: req.params.id })
            responseHandler.success(res, data, "Product Updated Successfully", 200)
        } catch (err) {
            if (err) {
                responseHandler.error(res, err.message, 500)
            }
        }
    }
}
exports.getByCode = async (req, res) => {
    if (req.params.code && req.params.code !== "undefined") {
        try {
            let data = await ProductTable.find({ productCode: req.params.code })
            responseHandler.success(res, data, "Product Updated Successfully", 200)
        } catch (err) {
            if (err) {
                responseHandler.error(res, err.message, 500)
            }
        }
    }
}