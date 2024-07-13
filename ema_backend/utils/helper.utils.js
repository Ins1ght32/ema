const sql = require('../utils/db.utils.js');

const insertOrUpdateProductHostname = (productId, hostname) => {
    return new Promise((resolve, reject) => {
        // Process the hostname to get the hostnameId
        processHostname(hostname)
            .then(hostnameId => {
                // Then, check if a row already exists for the productId and hostnameId
                sql.query('SELECT * FROM products_hostname WHERE products_id = ? AND hostname_id = ?',
                    [productId, hostnameId],
                    (error, rows) => {
                        if (error) {
                            return reject(error);
                        }

                        // If a row already exists, skip inserting a new row
                        if (rows.length > 0) {
                            return resolve();
                        }

                        // Insert a new row if no row exists for the productId and hostnameId
                        sql.query('INSERT INTO products_hostname (products_id, hostname_id) VALUES (?, ?)',
                            [productId, hostnameId],
                            (error, res) => {
                                if (error) {
                                    return reject(error);
                                }
                                resolve();
                            });
                    });
            })
            .catch(error => {
                reject(error); // Forward any error from processHostname
            });
    });
};

const processHostname = (hostname) => {
    return new Promise((resolve, reject) => {
        sql.query('SELECT hostname_id FROM hostname WHERE hostname_name = ?',
            [hostname], (error, hostnameResults) => {
                if (error) {
                    return reject(error);
                }
                if (hostnameResults.length === 0) {
                    // Insert new hostname if it does not exist
                    sql.query('INSERT INTO hostname (hostname_name) VALUES (?)',
                        [hostname], (error, insertRes) => {
                            if (error) {
                                return reject(error);
                            }
                            const newHostnameId = insertRes.insertId;
                            resolve(newHostnameId);
                        });
                } else {
                    // Return existing hostname_id
                    resolve(hostnameResults[0].hostname_id);
                }
            });
    });
};

const editProduct = (data) => {
    if (!data) {
        return ({ error: 'No data provided' }, null);
        
    }

    const productName = data.product_name;
    const link = data.link;
    const category = data.category;
    const vendor = data.vendor;
    const version_number = data.version_number;
    const target_version = data.target_version;
    const hostnames = data.hostnames;
    const productId = data.products_id;

    console.log("Product ID: ", productId);

    sql.query('SELECT category_id FROM category WHERE category_name = ?',
        [category],
        (error, categoryResults) => {
            if (error) {
                return (error, null);
            }
            if (categoryResults.length === 0) {
                return ({ error: 'Category not found' }, null);
                
            }

            const categoryId = categoryResults[0].category_id;

            sql.query('SELECT vendor_id FROM vendor WHERE vendor_name = ?',
                [vendor],
                (error, vendorResults) => {
                    if (error) {
                        return (error, null);
                        
                    }

                    if (vendorResults.length === 0) {
                        return ({ error: 'Vendor not found' }, null);
                        
                    }

                    const vendorId = vendorResults[0].vendor_id;

                    sql.query('INSERT INTO products (products_id, name, eos_date, url, category_id, vendor_id, version_number, target_version) VALUES (?, ?, NULL, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), url = VALUES(url), category_id = VALUES(category_id), vendor_id = VALUES(vendor_id), version_number = VALUES(version_number), target_version = VALUES(target_version)',
                        [productId, productName, link, categoryId, vendorId, version_number, target_version],
                        (error, res) => {
                            if (error) {
                                return (error, null);
                                
                            }

                            const lastProductId = res.insertId || res.updateId;

                            sql.query('DELETE FROM products_hostname WHERE products_id = ?', [lastProductId], (error) => {
                                if (error) {
                                    return (error, null);
                                    
                                }

                                const processHostname = (hostname) => {
                                    return new Promise((resolve, reject) => {
                                        sql.query('SELECT hostname_id FROM hostname WHERE hostname_name = ?',
                                        [hostname], (error, hostnameResults) => {
                                            if (error) {
                                                return reject(error);
                                            }
                                            if (hostnameResults.length === 0) {
                                                // Insert new hostname if it does not exist
                                                sql.query('INSERT INTO hostname (hostname_name) VALUES (?)',
                                                [hostname], (error, insertRes) => {
                                                    if (error) {
                                                        return reject(error);
                                                    }
                                                    const newHostnameId = insertRes.insertId;
                                                    resolve(newHostnameId);
                                                });
                                            } else {
                                                // Return existing hostname_id
                                                resolve(hostnameResults[0].hostname_id);
                                            }
                                        });
                                    });
                                };
            
                                const productHostnameQueries = hostnames.map((hostname) => {
                                    return processHostname(hostname).then((hostnameId) => {
                                        return sql.promise().query('INSERT INTO products_hostname (products_id, hostname_id) VALUES (?, ?)',
                                        [lastProductId, hostnameId]);
                                    });
                                });

                                Promise.all(productHostnameQueries).then(() => {
                                    return (null, { message: "Product added/updated successfully" });
                                }).catch((error) => {
                                    console.error('Error inserting hostnames:', error);
                                    return (error, null);
                                });
                            });
                        }
                    );
                }
            );
        }
    );
};





module.exports = { 
    insertOrUpdateProductHostname,
    processHostname,
    editProduct
} 