const authMiddleware = require("../middleware/auth.middleware.js");

module.exports = app => {
    const products = require("../controllers/products.controller.js");

    app.get("/total-products", authMiddleware.ensureLoggedIn, products.totalProducts);

    app.get("/all-products", authMiddleware.ensureLoggedIn, products.allProducts);

    app.post('/add-product', authMiddleware.ensureLoggedIn, products.addProducts);

    app.post('/edit-product', authMiddleware.ensureLoggedIn, products.editProducts);

    app.post('/delete-product', authMiddleware.ensureLoggedIn, products.deleteProducts);

    app.post('/bulk-add-hostnames', authMiddleware.ensureLoggedIn, products.bulkAddHostnames);

    app.post('/bulk-delete-hostnames', authMiddleware.ensureLoggedIn, products.bulkDeleteHostnames);

    app.get('/pie-data', authMiddleware.ensureLoggedIn, products.pieData);

    app.get('/timeline-data', authMiddleware.ensureLoggedIn, products.timelineData)

    app.get('/all-products-query', authMiddleware.ensureLoggedIn, products.allProductsQuery);

    app.get('/total-products-query', authMiddleware.ensureLoggedIn, products.totalProductsQuery);

    app.get('/pie-data-query', authMiddleware.ensureLoggedIn, products.pieDataQuery);

    app.get('/timeline-data-query', authMiddleware.ensureLoggedIn, products.timelineDataQuery);

    app.post('/crawlNow', authMiddleware.ensureLoggedIn, products.crawlAllNow);

    app.get('/crawl-time', authMiddleware.ensureLoggedIn, products.getCrawlTime);

    app.get('/recommend-time', authMiddleware.ensureLoggedIn, products.getRecommendTime);

};