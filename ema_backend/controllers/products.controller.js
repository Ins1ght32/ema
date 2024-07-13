const Products = require('../models/products.model.js');

exports.totalProducts = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.totalDevices( (err, data)  => {

        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            res.json({ total_devices: data });
        };

    });

};

exports.allProducts =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.allProducts( (err, data) => {

        if (err) {
            // console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            res.json(data);
        }
    });

};

exports.addProducts = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const requestBody = req.body;
    let responseSent = false;

    Products.addProducts(requestBody, (err, data) => {

        if (err) {
            console.log(err);
            if (!responseSent) {
                res.status(500).send({
                    message: 'Error occured'
                });
                responseSent = true;
            }
            
        }

        else if (data) {
            console.log(data);
            if (!responseSent) {
                res.json(data);
                responseSent = true;
            }
            // res.json(data);
        }
    });
};

exports.editProducts = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const requestBody = req.body;

    Products.editProducts(requestBody, (err, data) => {

        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            console.log(data);
            res.json(data);
        }
    });
};

exports.deleteProducts = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const requestBody = req.body;

    Products.deleteProducts(requestBody, (err, data) => {

        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            console.log(data);
            res.json(data);
        }
    });
};

exports.bulkAddHostnames = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const requestBody = req.body;

    Products.bulkAddHostnames(requestBody, (err, data) => {

        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            console.log(data);
            res.json(data);
        }
    });
}

exports.bulkDeleteHostnames = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const requestBody = req.body;

    Products.bulkDeleteHostnames(requestBody, (err, data) => {

        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            // console.log(data);
            res.json(data);
        }
    });
}

exports.pieData = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.pieChart((data) => {
        if (data) {
            // console.log(data);
            res.json(data);
        }
    })
};

exports.timelineData = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.timelineData((data) => {
        if (data) {
            res.json(data);
        }
    })
};

exports.allProductsQuery = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.allProductsQuery(req, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            res.json(data);
        }
    });
};

exports.totalProductsQuery = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.totalProductsQuery(req, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            res.json(data);
        }
    });
};

exports.pieDataQuery = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.pieChartQuery(req, (data) => {
        if (data) {
            res.json(data);
        }
    });
};

exports.timelineDataQuery = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.timelineDataQuery(req, (data) => {
        if (data) {
            res.json(data);
        }
    })
};

exports.crawlAllNow = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const requestBody = req.body;
    let responseSent = false;

    Products.crawlAllNow(requestBody, (err, data) => {
        if (err) {
            console.log(err);
            if(!responseSent) {
                res.status(500).send({
                    message: 'Error occured'
                });
                responseSent = true;
            }
        }
        else if (data) {
            if (!responseSent) {
                res.json(data);
                responseSent = true;
            }
        }
    })
}

exports.getCrawlTime =  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.getCrawlTime( (err, data) => {

        if (err) {
            console.log(err);
            res.status(500).send({
                message: 'Error occured'
            });
        }

        if (data) {
            res.json(data);
        }
    });

};

exports.allAssetsQuery = async (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Products.allAssetsQuery(req, (data) => {
        if (data) {
            res.json(data);
        }
    })
}
