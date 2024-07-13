module.exports = app => {
    const products = require("../controllers/products.controller.js");

    app.get("/total-products", products.totalProducts);

    app.get("/all-products", products.allProducts);

    app.post('/add-product', products.addProducts);

    app.post('/edit-product', products.editProducts);

    app.post('/delete-product', products.deleteProducts);

    app.post('/bulk-add-hostnames', products.bulkAddHostnames);

    app.post('/bulk-delete-hostnames', products.bulkDeleteHostnames);

    app.get('/pie-data', products.pieData);

    app.get('/timeline-data', products.timelineData)

    app.get('/all-products-query', products.allProductsQuery);

    app.get('/total-products-query', products.totalProductsQuery);

    app.get('/pie-data-query', products.pieDataQuery);

    app.get('/timeline-data-query', products.timelineDataQuery);

    app.post('/crawlNow', products.crawlAllNow);

    app.get('/crawl-time', products.getCrawlTime);

    app.get('/all-assets', products.allAssetsQuery);

};