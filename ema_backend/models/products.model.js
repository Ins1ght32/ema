const sql = require('../utils/db.utils.js');
const processor = require('../utils/helper.utils.js');
const { spawn } = require('child_process');
const path = require('path');

const Products = () => {
    ;
};

Products.totalDevices = (result) => {

    sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
        if (err) {  
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            console.log("Total Products Tracked: ", res.length);
            const totalProducts = res.length;
            result(null, totalProducts);
        }
    });
};

Products.totalDevicesQuery = (data, result) => {

    
    const categoryID = data.query.categoryID;
    const vendorID = data.query.vendorID;

    if (categoryID === 4 && vendorID != 4) {
        // query for all products under which vendor
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [vendorID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                console.log(res);
                const totalProducts = res.length;
                result(null, totalProducts);
            }
        });
    }

    else if (vendorID === 4 && categoryID != 4) {
        // query for all products under which category
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                console.log(res);
                const totalProducts = res.length;
                result(null, totalProducts);
            }
        });
    }

    else if (vendorID === 4 && categoryID === 4) {
        // admin, so query everything
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                console.log(res);
                const totalProducts = res.length;
                result(null, totalProducts);
            }
        });
    }

    else {
        // query specific types of products
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) AND (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID, vendorID], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            console.log(res);
            const totalProducts = res.length;
            result(null, totalProducts);
        }
    });
}
}

Products.allProducts = (result) => {

    sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
        if (err) {
            // console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            // console.log(res);
            result(null, res);
        }
    });

};

/*
Products.addProducts = (data, result) => {
    if (data) {
        const productName = data.product_name;
        const link = data.link;
        const category = data.category;
        const vendor = data.vendor;
        const version_number = data.version_number;
        const target_version = data.target_version;
        const hostnames = data.hostnames;
        const remarks = data.remarks;
        console.log(data)

        sql.query('SELECT category_id FROM category WHERE category_name = ?',
        [category],
        (error, categoryResults) => {
            if (error) {
                return result(error, null);
            }
            if (categoryResults.length === 0) {
                return result({ error: 'Category not found' }, null);
            }

            const categoryId = categoryResults[0].category_id;
            console.log("Category ID: ", categoryId);
        
            sql.query('SELECT vendor_id FROM vendor WHERE vendor_name = ?',
            [vendor],
            (error, vendorResults) => {
                if (error) {
                    return result(error, null);
                }

                if (vendorResults.length === 0) {
                    return result({ error: 'Vendor not found' }, null);
                }

                const vendorId = vendorResults[0].vendor_id;
                console.log("Vendor ID: ", vendorId);

                sql.query('INSERT INTO products (name, eos_date, url, category_id, vendor_id, version_number, target_version, contains_primary_source, do_not_crawl, remarks) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [productName, link, categoryId, vendorId, version_number, target_version, '6', 'no', remarks], (error, res) => {
                    if (error) {
                        return result(error, null);
                    }

                    const lastProductId = res.insertId;

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
                        // call python script here
                        const pythonvenv = path.resolve(__dirname, "../scripts/venv/Scripts/python.exe");
                        const scriptPath = path.resolve(__dirname, "../scripts/main.py");

                        // console.log("Python venv path:", pythonvenv);
                        // console.log("Script path:", scriptPath);

                        const idsArgument = "--ids";

                        const scriptDir = path.dirname(scriptPath);
                        process.chdir(scriptDir);
                        const crawlerProcess = spawn(pythonvenv, [scriptPath, idsArgument, lastProductId]);

                        crawlerProcess.stdout.on('data', (data) => {
                            console.log(`stdout: ${data}`);
                            // result(null, data.toString());
                        });

                        crawlerProcess.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                            // result(data.toString(), null);
                        });

                        crawlerProcess.on('close', (code) => {
                            console.log(`child process exited with code ${code}`);
                            result(null, data.toString());
                        });
                        // result(null, { message: "Product added successfully" });
                    })
                    .catch((error) => {
                        console.error('Error inserting hostnames:', error);
                        result(error, null);
                    });
                });
            });
        });
    }
};
*/


Products.addProducts = (data, result) => {
    if (data) {
        const productName = data.product_name;
        const link = data.link;
        const category = data.category;
        const vendor = data.vendor;
        const version_number = data.version_number;
        const target_version = data.target_version;
        const hostnames = data.hostnames;
        const remarks = data.remarks;
        console.log(data);

        sql.query('SELECT category_id FROM category WHERE category_name = ?',
            [category],
            (error, categoryResults) => {
                if (error) {
                    return result(error, null);
                }
                if (categoryResults.length === 0) {
                    return result({ error: 'Category not found' }, null);
                }

                const categoryId = categoryResults[0].category_id;
                console.log("Category ID: ", categoryId);

                sql.query('SELECT vendor_id FROM vendor WHERE vendor_name = ?',
                    [vendor],
                    (error, vendorResults) => {
                        if (error) {
                            return result(error, null);
                        }

                        if (vendorResults.length === 0) {
                            return result({ error: 'Vendor not found' }, null);
                        }

                        const vendorId = vendorResults[0].vendor_id;
                        console.log("Vendor ID: ", vendorId);

                        sql.query('INSERT INTO products (name, eos_date, url, category_id, vendor_id, version_number, target_version, contains_primary_source, do_not_crawl, remarks) VALUES (?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)', 
                        [productName, link, categoryId, vendorId, version_number, target_version, '6', 'no', remarks], (error, res) => {
                            if (error) {
                                return result(error, null);
                            }

                            const lastProductId = res.insertId;

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
                                // call python script here
                                const pythonvenv = path.resolve(__dirname, "../scripts/venv/Scripts/python.exe");
                                const scriptPath = path.resolve(__dirname, "../scripts/main.py");

                                const idsArgument = "--ids";

                                const scriptDir = path.dirname(scriptPath);
                                process.chdir(scriptDir);
                                const crawlerProcess = spawn(pythonvenv, [scriptPath, idsArgument, lastProductId]);

                                crawlerProcess.stdout.on('data', (data) => {
                                    console.log(`stdout: ${data}`);
                                });

                                crawlerProcess.stderr.on('data', (data) => {
                                    console.error(`stderr: ${data}`);
                                });

                                crawlerProcess.on('close', (code) => {
                                    console.log(`child process exited with code ${code}`);
                                    result(null, { message: "Product added successfully" });
                                });
                            })
                            .catch((error) => {
                                console.error('Error inserting hostnames:', error);
                                result(error, null);
                            });
                        });
                    });
                });
    }
}

/*
Products.editProducts = (data, result) => {
    if (data) {
        const productName = data.product_name;
        const link = data.link;
        const category = data.category;
        const vendor = data.vendor;
        const version_number = data.version_number;
        const target_version = data.target_version;
        const eos_date = new Date(data.eos_date);
        const contains_primary_source = data.contains_primary_source;
        const do_not_crawl = data.do_not_crawl;
        const remarks = data.remarks;
        const crawlNow = data.crawlNow;
        console.log("EOS DATE: ", eos_date);
        var hostnames = data.hostnames;
        if (hostnames.constructor == Array) {
            ;
        }
        else {
            hostnames = [hostnames];
        }
        const productId = data.products_id;

        console.log("Data: ", data);

        sql.query('SELECT category_id FROM category WHERE category_name = ?',
            [category],
            (error, categoryResults) => {
                if (error) {
                    result(error, null);
                    return;
                }
                if (categoryResults.length === 0) {
                    result({ error: 'Category not found' }, null);
                    return;
                }

                const categoryId = categoryResults[0].category_id;

                sql.query('SELECT vendor_id FROM vendor WHERE vendor_name = ?',
                    [vendor],
                    (error, vendorResults) => {
                        if (error) {
                            result(error, null);
                            return;
                        }

                        if (vendorResults.length === 0) {
                            result({ error: 'Vendor not found' }, null);
                            return;
                        }

                        const vendorId = vendorResults[0].vendor_id;

                        sql.query('INSERT INTO products (products_id, name, eos_date, url, category_id, vendor_id, version_number, target_version, contains_primary_source, do_not_crawl, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), url = VALUES(url), eos_date = VALUES(eos_date), category_id = VALUES(category_id), vendor_id = VALUES(vendor_id), version_number = VALUES(version_number), target_version = VALUES(target_version), contains_primary_source = VALUES(contains_primary_source), do_not_crawl = VALUES(do_not_crawl), remarks = VALUES(remarks)',
                            [productId, productName, eos_date, link, categoryId, vendorId, version_number, target_version, contains_primary_source, do_not_crawl, remarks],
                            (error, res) => {
                                if (error) {
                                    result(error, null);
                                    return;
                                }

                                // const lastProductId = res.insertId || res.updateId;
                                const lastProductId = productId;

                                sql.query('DELETE FROM products_hostname WHERE products_id = ?', [lastProductId], (error) => {
                                    if (error) {
                                        result(error, null);
                                        return;
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

                                        if (crawlNow === "yes") {
                                            // call python script here
                                            const pythonvenv = path.resolve(__dirname, "../scripts/venv/Scripts/python.exe");
                                            const scriptPath = path.resolve(__dirname, "../scripts/main.py");

                                            // console.log("Python venv path:", pythonvenv);
                                            // console.log("Script path:", scriptPath);

                                            const idsArgument = "--ids";

                                            const scriptDir = path.dirname(scriptPath);
                                            process.chdir(scriptDir);
                                            const crawlerProcess = spawn(pythonvenv, [scriptPath, idsArgument, lastProductId]);

                                            crawlerProcess.stdout.on('data', (data) => {
                                                console.log(`stdout: ${data}`);
                                                // result(null, data.toString());
                                            });

                                            crawlerProcess.stderr.on('data', (data) => {
                                                console.error(`stderr: ${data}`);
                                                // result(data.toString(), null);
                                            });

                                            crawlerProcess.on('close', (code) => {
                                                console.log(`child process exited with code ${code}`);
                                                result(null, data.toString());
                                            });
                                            // result(null, { message: "Product added successfully" });                                            
                                        }
                                        else {
                                            result(null, { message: "Product added/updated successfully" });
                                        }

                                        // result(null, { message: "Product added/updated successfully" });
                                    }).catch((error) => {
                                        console.error('Error inserting hostnames:', error);
                                        result(error, null);
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    }
};
*/

Products.editProducts = (data, result) => {
    if (data) {
        const productName = data.product_name;
        const link = data.link;
        const category = data.category;
        const vendor = data.vendor;
        const version_number = data.version_number;
        const target_version = data.target_version;
        const eos_date = new Date(data.eos_date);
        const contains_primary_source = data.contains_primary_source;
        const do_not_crawl = data.do_not_crawl;
        const remarks = data.remarks;
        const crawlNow = data.crawlNow;
        console.log("EOS DATE: ", eos_date);
        var hostnames = data.hostnames;
        if (hostnames.constructor == Array) {
            ;
        }
        else {
            hostnames = [hostnames];
        }
        const productId = data.products_id;

        console.log("Data: ", data);

        sql.query('SELECT category_id FROM category WHERE category_name = ?',
            [category],
            (error, categoryResults) => {
                if (error) {
                    result(error, null);
                    return;
                }
                if (categoryResults.length === 0) {
                    result({ error: 'Category not found' }, null);
                    return;
                }

                const categoryId = categoryResults[0].category_id;

                sql.query('SELECT vendor_id FROM vendor WHERE vendor_name = ?',
                    [vendor],
                    (error, vendorResults) => {
                        if (error) {
                            result(error, null);
                            return;
                        }

                        if (vendorResults.length === 0) {
                            result({ error: 'Vendor not found' }, null);
                            return;
                        }

                        const vendorId = vendorResults[0].vendor_id;

                        sql.query('INSERT INTO products (products_id, name, eos_date, url, category_id, vendor_id, version_number, target_version, contains_primary_source, do_not_crawl, remarks) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), url = VALUES(url), eos_date = VALUES(eos_date), category_id = VALUES(category_id), vendor_id = VALUES(vendor_id), version_number = VALUES(version_number), target_version = VALUES(target_version), contains_primary_source = VALUES(contains_primary_source), do_not_crawl = VALUES(do_not_crawl), remarks = VALUES(remarks)',
                            [productId, productName, eos_date, link, categoryId, vendorId, version_number, target_version, contains_primary_source, do_not_crawl, remarks],
                            (error, res) => {
                                if (error) {
                                    result(error, null);
                                    return;
                                }

                                // const lastProductId = res.insertId || res.updateId;
                                const lastProductId = productId;

                                sql.query('DELETE FROM products_hostname WHERE products_id = ?', [lastProductId], (error) => {
                                    if (error) {
                                        result(error, null);
                                        return;
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

                                        if (crawlNow === "yes") {
                                            // call python script here
                                            const pythonvenv = path.resolve(__dirname, "../scripts/venv/Scripts/python.exe");
                                            const scriptPath = path.resolve(__dirname, "../scripts/main.py");

                                            const idsArgument = "--ids";

                                            const scriptDir = path.dirname(scriptPath);
                                            process.chdir(scriptDir);
                                            const crawlerProcess = spawn(pythonvenv, [scriptPath, idsArgument, lastProductId]);

                                            crawlerProcess.stdout.on('data', (data) => {
                                                console.log(`stdout: ${data}`);
                                            });

                                            crawlerProcess.stderr.on('data', (data) => {
                                                console.error(`stderr: ${data}`);
                                            });

                                            crawlerProcess.on('close', (code) => {
                                                console.log(`child process exited with code ${code}`);
                                                result(null, { message: "Product updated successfully" });
                                            });
                                        }
                                        else {
                                            result(null, { message: "Product added/updated successfully" });
                                        }

                                    }).catch((error) => {
                                        console.error('Error inserting hostnames:', error);
                                        result(error, null);
                                    });
                                });
                            }
                        );
                    }
                );
            }
        );
    }
};

Products.deleteProducts = (data, result) => {
    if (data) {
        const productIds = data.id;
        console.log("product ids: ", productIds);

        sql.query('DELETE FROM products_hostname WHERE products_id IN (?)', [productIds], (error) => {
            if (error) {
                result(error, null);
                return;
            }
            
            sql.query('DELETE FROM products WHERE products_id IN (?)', [productIds], (error) => {
                if (error) {
                    result(error, null);
                    return;
                }

                result(null, {message: "Product and associated hostnames deleted successfully" });
            });
        });
    }
};

Products.bulkAddHostnames = (data, result) => {
    const hostnames = data.hostnames;
    const productIds = Array.from(data.selectedRowData);

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
            productIds.forEach(productId => {
                sql.query('SELECT * FROM products_hostname WHERE products_id = ? AND hostname_id = ?', [productId, hostnameId], (err, res) => {
                    if (res.length === 0) {
                        return sql.promise().query('INSERT INTO products_hostname (products_id, hostname_id) VALUES (?, ?)', [productId, hostnameId]);
                    }
                })
            });
        });
    });

    Promise.all(productHostnameQueries).then(() => {
        result(null, { message: "Hostname updated successfully" });
    }).catch((error) => {
        console.error('Error updating hostnames:', error);
        result(error, null);
    });
}

Products.bulkDeleteHostnames = (data, result) => {
    const hostnames = data.hostnames;
    const productIds = Array.from(data.selectedRowData);

    const processHostname = (hostname) => {
        return new Promise((resolve, reject) => {
            sql.query('SELECT hostname_id FROM hostname WHERE hostname_name = ?',
            [hostname], (error, hostnameResults) => {
                if (error) {
                    return reject(error);
                }
                if (hostnameResults.length === 0) {
                    /*
                    // Insert new hostname if it does not exist
                    sql.query('INSERT INTO hostname (hostname_name) VALUES (?)',
                    [hostname], (error, insertRes) => {
                        if (error) {
                            return reject(error);
                        }
                        const newHostnameId = insertRes.insertId;
                        resolve(newHostnameId);
                    });
                    */
                   resolve(null);
                    
                } else {
                    // Return existing hostname_id
                    resolve(hostnameResults[0].hostname_id);
                }
            });
        });
    };

    const productHostnameQueries = hostnames.map((hostname) => {
        return processHostname(hostname).then((hostnameId) => {
            if (hostnameId != null) {
                productIds.forEach(productId => {
                    sql.query('SELECT * FROM products_hostname WHERE products_id = ? AND hostname_id = ?', [productId, hostnameId], (err, res) => {
                        if (res.length >= 1) {
                            // return sql.promise().query('INSERT INTO products_hostname (products_id, hostname_id) VALUES (?, ?)', [productId, hostnameId]);
                            return sql.promise().query('DELETE FROM products_hostname WHERE products_id = ? AND hostname_id = ?', [productId, hostnameId]);
                        }
                    })
                });
            }
        });
    });


    Promise.all(productHostnameQueries).then(() => {    
        result(null, { message: "Hostnames deleted successfully" });
    }).catch((error) => {
        console.error('Error deleting hostnames:', error);
        result(error, null);
    });
}

Products.pieChartQuery = (data, result) => {
    const categoryID = data.query.categoryID;
    const vendorID = data.query.vendorID;
    console.log(`Category ID: ${categoryID}`);
    console.log(`Vendor ID: ${vendorID}`);
    // let sql_response;

    if (categoryID == 4 && vendorID != 4) {
        // query for all products under which vendor
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [vendorID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                const currentDate = new Date();
                const threeMonth = 7.884e+9;
                const sixMonth = 1.577e+10;
                const supportedDate = new Date("9999-12-31");
                // const cannotCrawlDate = new Date("1970-01-01");
                supportedDate.setHours(supportedDate.getHours() - 8);
                // cannotCrawlDate.setHours(cannotCrawlDate.getHours() - 8);
                const cannotCrawlDate = new Date("1969-12-31T16:30:00.000Z");
                const no_date = new Date("9998-12-31 00:00:00");
                let sixPlusCounter = 0;
                let minusZeroCounter = 0;
                let zeroToThreeCounter = 0;
                let threeToSixCounter = 0;
                let noDates = 0;
                let cannotCrawl = 0;
                let noUrl = 0;
    
                res.forEach(obj => {
                    const eosDate = new Date(obj.eos_date);
                    const url = obj.url;

                    
                    if (url === '') {
                        noUrl += 1;
                        return;
                    }

                    if (eosDate >= currentDate) {
                        if (eosDate - currentDate <= threeMonth) {
                            zeroToThreeCounter += 1;
                            return;
                        }
                        if (eosDate - currentDate <= sixMonth) {
                            threeToSixCounter += 1;
                            return;
                        }
                        if (eosDate.getTime() === supportedDate.getTime()) {
                            noDates += 1;
                            return;
                        }
                        if (eosDate.getTime() === no_date.getTime()) {
                            noDates += 1;
                            return
                        }
                        else {
                            sixPlusCounter += 1;
                            return
                        }
                    }


                    else if (eosDate.getTime() === cannotCrawlDate.getTime() && url != '') {
                        // console.log("HELLO")
                        // noDates += 1;
                        cannotCrawl += 1;
                        return 
                    }
                    else if (eosDate <= currentDate && eosDate.getTime() != cannotCrawlDate.getTime() && url != '') {
                        minusZeroCounter += 1;
                        
                    }
                })
    
                const PieChart = [
                    { label: 'EOS', value: minusZeroCounter},
                    { label: '0-3 months', value: zeroToThreeCounter},
                    { label: '3-6 months', value: threeToSixCounter},
                    { label: '6+ months', value: sixPlusCounter},
                    { label: 'No Dates', value: noDates + cannotCrawl + noUrl},
                    // { label: 'Cannot Crawl Dates', value: cannotCrawl},
                    { label: 'No URL', value: noUrl},
                    { label: 'Cannot Crawl Dates', value: cannotCrawl}
                ];


                result(PieChart);
            }
        });
    }

    else if (vendorID == 4 && categoryID != 4) {
        // query for all products under which category
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                const currentDate = new Date();
                const threeMonth = 7.884e+9;
                const sixMonth = 1.577e+10;
                const supportedDate = new Date("9999-12-31");
                // const cannotCrawlDate = new Date("1970-01-01");
                supportedDate.setHours(supportedDate.getHours() - 8);
                // cannotCrawlDate.setHours(cannotCrawlDate.getHours() - 8);
                const cannotCrawlDate = new Date("1969-12-31T16:30:00.000Z");
                const no_date = new Date("9998-12-31 00:00:00");
                let sixPlusCounter = 0;
                let minusZeroCounter = 0;
                let zeroToThreeCounter = 0;
                let threeToSixCounter = 0;
                let noDates = 0;
                let cannotCrawl = 0;
                let noUrl = 0;
    
                res.forEach(obj => {
                    const eosDate = new Date(obj.eos_date);
                    const url = obj.url;

                    
                    if (url === '') {
                        noUrl += 1;
                        return;
                    }

                    if (eosDate >= currentDate) {
                        if (eosDate - currentDate <= threeMonth) {
                            zeroToThreeCounter += 1;
                            return;
                        }
                        if (eosDate - currentDate <= sixMonth) {
                            threeToSixCounter += 1;
                            return;
                        }
                        if (eosDate.getTime() === supportedDate.getTime()) {
                            noDates += 1;
                            return;
                        }
                        if (eosDate.getTime() === no_date.getTime()) {
                            noDates += 1;
                            return
                        }
                        else {
                            sixPlusCounter += 1;
                            return
                        }
                    }


                    else if (eosDate.getTime() === cannotCrawlDate.getTime() && url != '') {
                        // console.log("HELLO")
                        // noDates += 1;
                        cannotCrawl += 1;
                        return 
                    }
                    else if (eosDate <= currentDate && eosDate.getTime() != cannotCrawlDate.getTime() && url != '') {
                        minusZeroCounter += 1;
                        
                    }
                })
    
                const PieChart = [
                    { label: 'EOS', value: minusZeroCounter},
                    { label: '0-3 months', value: zeroToThreeCounter},
                    { label: '3-6 months', value: threeToSixCounter},
                    { label: '6+ months', value: sixPlusCounter},
                    { label: 'No Dates', value: noDates + cannotCrawl + noUrl},
                    // { label: 'Cannot Crawl Dates', value: cannotCrawl},
                    { label: 'No URL', value: noUrl},
                    { label: 'Cannot Crawl Dates', value: cannotCrawl}
                ];


                result(PieChart);
            }
        });
    }

    else if (vendorID == 4 && categoryID == 4) {
        // admin, so query everything
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                // console.log(res);
                // result(null, res);
                const currentDate = new Date();
                const threeMonth = 7.884e+9;
                const sixMonth = 1.577e+10;
                const supportedDate = new Date("9999-12-31");
                // const cannotCrawlDate = new Date("1970-01-01");
                supportedDate.setHours(supportedDate.getHours() - 8);
                // cannotCrawlDate.setHours(cannotCrawlDate.getHours() - 8);
                const cannotCrawlDate = new Date("1969-12-31T16:30:00.000Z");
                const no_date = new Date("9998-12-31 00:00:00");
                let sixPlusCounter = 0;
                let minusZeroCounter = 0;
                let zeroToThreeCounter = 0;
                let threeToSixCounter = 0;
                let noDates = 0;
                let cannotCrawl = 0;
                let noUrl = 0;
    
                res.forEach(obj => {
                    const eosDate = new Date(obj.eos_date);
                    const url = obj.url;

                    
                    if (url === '') {
                        noUrl += 1;
                        return;
                    }

                    if (eosDate >= currentDate) {
                        if (eosDate - currentDate <= threeMonth) {
                            zeroToThreeCounter += 1;
                            return;
                        }
                        if (eosDate - currentDate <= sixMonth) {
                            threeToSixCounter += 1;
                            return;
                        }
                        if (eosDate.getTime() === supportedDate.getTime()) {
                            noDates += 1;
                            return;
                        }
                        if (eosDate.getTime() === no_date.getTime()) {
                            noDates += 1;
                            return;
                        }
                        else {
                            sixPlusCounter += 1;
                            return;
                        }
                    }


                    else if (eosDate.getTime() === cannotCrawlDate.getTime() && url != '') {
                        // console.log("HELLO")
                        // noDates += 1;
                        cannotCrawl += 1;
                        return 
                    }
                    else if (eosDate <= currentDate && eosDate.getTime() != cannotCrawlDate.getTime() && url != '') {
                        minusZeroCounter += 1;
                        
                    }
                })
    
                const PieChart = [
                    { label: 'EOS', value: minusZeroCounter},
                    { label: '0-3 months', value: zeroToThreeCounter},
                    { label: '3-6 months', value: threeToSixCounter},
                    { label: '6+ months', value: sixPlusCounter},
                    { label: 'No Dates', value: noDates + cannotCrawl+ noUrl},
                    // { label: 'Cannot Crawl Dates', value: cannotCrawl},
                    { label: 'No URL', value: noUrl},
                    { label: 'Cannot Crawl Dates', value: cannotCrawl}
                ];


                result(PieChart);
            }
        });
    }

    else {
        // query specific types of products
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) AND (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID, vendorID], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            // console.log(res);
            // result(null, res);
            const currentDate = new Date();
            const threeMonth = 7.884e+9;
            const sixMonth = 1.577e+10;
            const supportedDate = new Date("9999-12-31");
            // const cannotCrawlDate = new Date("1970-01-01");
            supportedDate.setHours(supportedDate.getHours() - 8);
            // cannotCrawlDate.setHours(cannotCrawlDate.getHours() - 8);
            const cannotCrawlDate = new Date("1969-12-31T16:30:00.000Z");
            const no_date = new Date("9998-12-31 00:00:00");
            let sixPlusCounter = 0;
            let minusZeroCounter = 0;
            let zeroToThreeCounter = 0;
            let threeToSixCounter = 0;
            let noDates = 0;
            let cannotCrawl = 0;
            let noUrl = 0;

            res.forEach(obj => {
                const eosDate = new Date(obj.eos_date);
                const url = obj.url;

                
                if (url === '') {
                    noUrl += 1;
                    return;
                }

                if (eosDate >= currentDate) {
                    if (eosDate - currentDate <= threeMonth) {
                        zeroToThreeCounter += 1;
                        return;
                    }
                    if (eosDate - currentDate <= sixMonth) {
                        threeToSixCounter += 1;
                        return;
                    }
                    if (eosDate.getTime() === supportedDate.getTime()) {
                        noDates += 1;
                        return;
                    }
                    if (eosDate.getTime() === no_date.getTime()) {
                        noDates += 1;
                        return
                    }
                    else {
                        sixPlusCounter += 1;
                        return
                    }
                }


                else if (eosDate.getTime() === cannotCrawlDate.getTime() && url != '') {
                    // console.log("HELLO")
                    // noDates += 1;
                    cannotCrawl += 1;
                    return 
                }
                else if (eosDate <= currentDate && eosDate.getTime() != cannotCrawlDate.getTime() && url != '') {
                    minusZeroCounter += 1;
                    
                }
            })

            const PieChart = [
                { label: 'EOS', value: minusZeroCounter},
                { label: '0-3 months', value: zeroToThreeCounter},
                { label: '3-6 months', value: threeToSixCounter},
                { label: '6+ months', value: sixPlusCounter},
                { label: 'No Dates', value: noDates + cannotCrawl + noUrl},
                // { label: 'Cannot Crawl Dates', value: cannotCrawl},
                { label: 'No URL', value: noUrl},
                { label: 'Cannot Crawl Dates', value: cannotCrawl}
            ];


            result(PieChart);
        }
    });
}

}


Products.pieChart = (result) => {

    sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            // console.log(res);
            // result(null, res);
            const currentDate = new Date();
            const threeMonth = 7.884e+9;
            const sixMonth = 1.577e+10;
            const supportedDate = new Date("9999-12-31");
            const cannotCrawlDate = new Date("1970-01-01");
            supportedDate.setHours(supportedDate.getHours() - 8);
            cannotCrawlDate.setHours(cannotCrawlDate.getHours() - 8);
            let sixPlusCounter = 0;
            let minusZeroCounter = 0;
            let zeroToThreeCounter = 0;
            let threeToSixCounter = 0;
            let noDates = 0;
            let cannotCrawl = 0;

            res.forEach(obj => {
                const eosDate = new Date(obj.eos_date);
                const url = obj.url;
                if (eosDate >= currentDate) {
                    if (eosDate - currentDate <= threeMonth) {
                        zeroToThreeCounter += 1;
                        return;
                    }
                    if (eosDate - currentDate <= sixMonth) {
                        threeToSixCounter += 1;
                        return;
                    }
                    if (eosDate.getTime() === supportedDate.getTime()) {
                        noDates += 1;
                        return;
                    }
                    if (eosDate.getTime() === cannotCrawlDate.getTime()) {
                        // noDates += 1;
                        cannotCrawl += 1;
                    }
                    else {
                        sixPlusCounter += 1;
                    }
                }
                else {
                minusZeroCounter += 1;
                }

                if (url === '') {
                    noUrl += 1;
                }
            })

            const PieChart = [
                { label: 'EOS', value: minusZeroCounter},
                { label: '0-3 months', value: zeroToThreeCounter},
                { label: '3-6 months', value: threeToSixCounter},
                { label: '6+ months', value: sixPlusCounter},
                { label: 'No Dates', value: noDates + cannotCrawl},
                // { label: 'Cannot Crawl Dates', value: cannotCrawl},
                { label: 'No URL', value: noUrl}
                // { label: 'Cannot Crawl Dates', value: cannotCrawl}
            ];

            // console.log(PieChart);
            result(PieChart);
        }
    });
}

Products.timelineData = (result) => {

    sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, p.version_number AS version_number FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            const eosCount = res.reduce((acc, product) => {
                const date = product.eos_date;
                const hostnames = product.all_hostnames.split(",");
                const hostnamesCount = hostnames.length;
            
                if (!acc[date]) {
                  acc[date] = { count: 0, products: [] };
                }

                acc[date].count += hostnamesCount;
                const productNameVersion = `${product.product_name} ${product.version_number}`
                acc[date].products.push(productNameVersion);
                return acc;
            }, {});
            
            const filteredDates = Object.keys(eosCount).filter(date => {
                const dateTimestamp = new Date(date).getTime()
                const invalidTimestamps = [
                    253402185600000,
                    0
                ]
                return !invalidTimestamps.includes(dateTimestamp);
            });

            const chartData = filteredDates.map(date => {
                const productEos = new Date(date).getTime();
                return {
                  name: eosCount[date].products,
                  data: [{
                    x: productEos,
                    y: eosCount[date].count,
                  }],
                };
              });
        result(chartData);
        }
    });
}

Products.timelineDataQuery = (data, result) => {

    const categoryID = data.query.categoryID;
    const vendorID = data.query.vendorID;
    const numProducts = data.query.numProducts;

    let sql_response;

    if (categoryID == 4 && vendorID != 4) {
        // query for all products under which vendor
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [vendorID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            } else {
                // console.log(res);
                const eosCount = res.reduce((acc, product) => {
                    const date = product.eos_date;
                    const hostnames = product.all_hostnames ? product.all_hostnames.split(",") : [];
                    const hostnamesCount = hostnames.length;
        
                    if (!acc[date]) {
                        acc[date] = { count: 0, categories: {} };
                    }
        
                    acc[date].count += hostnamesCount;
        
                    // Group products by category for color mapping
                    const categoryName = product.category_name.trim();
                    if (!acc[date].categories[categoryName]) {
                        acc[date].categories[categoryName] = [];
                    }
        
                    const productNameVersion = `${product.product_name} ${product.version_number}`;
                    acc[date].categories[categoryName].push({
                        product: productNameVersion,
                        count: hostnamesCount // Assuming you want to count hostnames per product here
                    });
        
                    return acc;
                }, {});
        
                const filteredDates = Object.keys(eosCount).filter(date => {
                    const dateTimestamp = new Date(date).getTime();
                    const invalidTimestamps = [
                        253402185600000,
                        0,
                        -27000000,
                        new Date('9998-12-31 00:00:00').getTime()
                    ];
                    return !invalidTimestamps.includes(dateTimestamp);
                });
        
                // Define color mapping for categories
                const categoryColors = {
                    'Server': '#FF5733',
                    'Network': '#33FF57',
                    'Applications': '#5733FF',
                    // Add more categories and colors as needed
                };
        
                // Prepare chart data with colors based on categories
                const categories = [...new Set(filteredDates.flatMap(date =>
                    Object.keys(eosCount[date].categories)
                ))];
        
                const chartData = categories.map(category => {
                    const categoryName = category.trim();
                    return {
                        name: categoryName,
                        color: categoryColors[categoryName] || '#AAAAAA', // Default color if category not found
                        data: filteredDates.flatMap(date => {
                            if (eosCount[date].categories[category]) {
                                return eosCount[date].categories[category].map(product => ({
                                    x: new Date(date).getTime(),
                                    y: product.count, // Ensure you're accessing the correct count here
                                    product: product.product,
                                    category: categoryName
                                }));
                            }
                            return [];
                        })
                    };
                });
        
                // Process chartData to ensure each category's data has unique points by date and count
        
                let limitedChartData = [];

                if (numProducts !== "all") {
                    // Flatten all data points across categories
                    const allDataPoints = chartData.flatMap(series => series.data);
        
                    // Sort all data points by date in ascending order, then by product name
                    allDataPoints.sort((a, b) => a.x - b.x);
        
                    // Get the exact numProducts data points
                    const limitedDataPoints = allDataPoints.slice(0, parseInt(numProducts));
        
                    // Create a map to store data points for each category
                    const categoryMap = new Map();
                    limitedDataPoints.forEach(point => {
                        const categoryKey = point.category;
                        if (!categoryMap.has(categoryKey)) {
                            categoryMap.set(categoryKey, []);
                        }
                        categoryMap.get(categoryKey).push(point);
                    });
        
                    // Reconstruct limitedChartData with unique data points
                    limitedChartData = Array.from(categoryMap.entries()).map(([category, data]) => ({
                        name: category,
                        color: categoryColors[category] || '#AAAAAA',
                        data: data
                    }));
                } else {
                    limitedChartData = chartData;
                }
        
                console.log('Chart Data:', limitedChartData); // Debug statement
        
                result(limitedChartData.flat()); // Flatten the array of arrays to pass to the component
            }
        });
    }

    else if (vendorID == 4 && categoryID != 4) {
        // query for all products under which category
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            } else {
                // console.log(res);
                const eosCount = res.reduce((acc, product) => {
                    const date = product.eos_date;
                    const hostnames = product.all_hostnames ? product.all_hostnames.split(",") : [];
                    const hostnamesCount = hostnames.length;
        
                    if (!acc[date]) {
                        acc[date] = { count: 0, categories: {} };
                    }
        
                    acc[date].count += hostnamesCount;
        
                    // Group products by category for color mapping
                    const categoryName = product.category_name.trim();
                    if (!acc[date].categories[categoryName]) {
                        acc[date].categories[categoryName] = [];
                    }
        
                    const productNameVersion = `${product.product_name} ${product.version_number}`;
                    acc[date].categories[categoryName].push({
                        product: productNameVersion,
                        count: hostnamesCount // Assuming you want to count hostnames per product here
                    });
        
                    return acc;
                }, {});
        
                const filteredDates = Object.keys(eosCount).filter(date => {
                    const dateTimestamp = new Date(date).getTime();
                    const invalidTimestamps = [
                        253402185600000,
                        0,
                        -27000000,
                        new Date('9998-12-31 00:00:00').getTime()
                    ];
                    return !invalidTimestamps.includes(dateTimestamp);
                });
        
                // Define color mapping for categories
                const categoryColors = {
                    'Server': '#FF5733',
                    'Network': '#33FF57',
                    'Applications': '#5733FF',
                    // Add more categories and colors as needed
                };
        
                // Prepare chart data with colors based on categories
                const categories = [...new Set(filteredDates.flatMap(date =>
                    Object.keys(eosCount[date].categories)
                ))];
        
                const chartData = categories.map(category => {
                    const categoryName = category.trim();
                    return {
                        name: categoryName,
                        color: categoryColors[categoryName] || '#AAAAAA', // Default color if category not found
                        data: filteredDates.flatMap(date => {
                            if (eosCount[date].categories[category]) {
                                return eosCount[date].categories[category].map(product => ({
                                    x: new Date(date).getTime(),
                                    y: product.count, // Ensure you're accessing the correct count here
                                    product: product.product,
                                    category: categoryName
                                }));
                            }
                            return [];
                        })
                    };
                });
        
                // Process chartData to ensure each category's data has unique points by date and count
        
                let limitedChartData = [];

                if (numProducts !== "all") {
                    // Flatten all data points across categories
                    const allDataPoints = chartData.flatMap(series => series.data);
        
                    // Sort all data points by date in ascending order, then by product name
                    allDataPoints.sort((a, b) => a.x - b.x);
        
                    // Get the exact numProducts data points
                    const limitedDataPoints = allDataPoints.slice(0, parseInt(numProducts));
        
                    // Create a map to store data points for each category
                    const categoryMap = new Map();
                    limitedDataPoints.forEach(point => {
                        const categoryKey = point.category;
                        if (!categoryMap.has(categoryKey)) {
                            categoryMap.set(categoryKey, []);
                        }
                        categoryMap.get(categoryKey).push(point);
                    });
        
                    // Reconstruct limitedChartData with unique data points
                    limitedChartData = Array.from(categoryMap.entries()).map(([category, data]) => ({
                        name: category,
                        color: categoryColors[category] || '#AAAAAA',
                        data: data
                    }));
                } else {
                    limitedChartData = chartData;
                }
        
                console.log('Chart Data:', limitedChartData); // Debug statement
        
                result(limitedChartData.flat()); // Flatten the array of arrays to pass to the component
            }
        });
    }

    else if (vendorID == 4 && categoryID == 4) {
        // admin, so query everything
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            } else {
                // console.log(res);
                const eosCount = res.reduce((acc, product) => {
                    const date = product.eos_date;
                    const hostnames = product.all_hostnames ? product.all_hostnames.split(",") : [];
                    const hostnamesCount = hostnames.length;
        
                    if (!acc[date]) {
                        acc[date] = { count: 0, categories: {} };
                    }
        
                    acc[date].count += hostnamesCount;
        
                    // Group products by category for color mapping
                    const categoryName = product.category_name.trim();
                    if (!acc[date].categories[categoryName]) {
                        acc[date].categories[categoryName] = [];
                    }
        
                    const productNameVersion = `${product.product_name} ${product.version_number}`;
                    acc[date].categories[categoryName].push({
                        product: productNameVersion,
                        count: hostnamesCount // Assuming you want to count hostnames per product here
                    });
        
                    return acc;
                }, {});
        
                const filteredDates = Object.keys(eosCount).filter(date => {
                    const dateTimestamp = new Date(date).getTime();
                    const invalidTimestamps = [
                        253402185600000,
                        0,
                        -27000000,
                        new Date('9998-12-31 00:00:00').getTime()
                    ];
                    return !invalidTimestamps.includes(dateTimestamp);
                });
        
                // Define color mapping for categories
                const categoryColors = {
                    'Server': '#FF5733',
                    'Network': '#33FF57',
                    'Applications': '#5733FF',
                    // Add more categories and colors as needed
                };
        
                // Prepare chart data with colors based on categories
                const categories = [...new Set(filteredDates.flatMap(date =>
                    Object.keys(eosCount[date].categories)
                ))];
        
                const chartData = categories.map(category => {
                    const categoryName = category.trim();
                    return {
                        name: categoryName,
                        color: categoryColors[categoryName] || '#AAAAAA', // Default color if category not found
                        data: filteredDates.flatMap(date => {
                            if (eosCount[date].categories[category]) {
                                return eosCount[date].categories[category].map(product => ({
                                    x: new Date(date).getTime(),
                                    y: product.count, // Ensure you're accessing the correct count here
                                    product: product.product,
                                    category: categoryName
                                }));
                            }
                            return [];
                        })
                    };
                });
        
                // Process chartData to ensure each category's data has unique points by date and count
        
                let limitedChartData = [];

                if (numProducts !== "all") {
                    // Flatten all data points across categories
                    const allDataPoints = chartData.flatMap(series => series.data);
        
                    // Sort all data points by date in ascending order, then by product name
                    allDataPoints.sort((a, b) => a.x - b.x);
        
                    // Get the exact numProducts data points
                    const limitedDataPoints = allDataPoints.slice(0, parseInt(numProducts));
        
                    // Create a map to store data points for each category
                    const categoryMap = new Map();
                    limitedDataPoints.forEach(point => {
                        const categoryKey = point.category;
                        if (!categoryMap.has(categoryKey)) {
                            categoryMap.set(categoryKey, []);
                        }
                        categoryMap.get(categoryKey).push(point);
                    });
        
                    // Reconstruct limitedChartData with unique data points
                    limitedChartData = Array.from(categoryMap.entries()).map(([category, data]) => ({
                        name: category,
                        color: categoryColors[category] || '#AAAAAA',
                        data: data
                    }));
                } else {
                    limitedChartData = chartData;
                }
        
                console.log('Chart Data:', limitedChartData); // Debug statement
        
                result(limitedChartData.flat()); // Flatten the array of arrays to pass to the component
            }
        });      
    }

    else {
        // query specific types of products
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) AND (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID, vendorID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            } else {
                // console.log(res);
                const eosCount = res.reduce((acc, product) => {
                    const date = product.eos_date;
                    const hostnames = product.all_hostnames ? product.all_hostnames.split(",") : [];
                    const hostnamesCount = hostnames.length;
        
                    if (!acc[date]) {
                        acc[date] = { count: 0, categories: {} };
                    }
        
                    acc[date].count += hostnamesCount;
        
                    // Group products by category for color mapping
                    const categoryName = product.category_name.trim();
                    if (!acc[date].categories[categoryName]) {
                        acc[date].categories[categoryName] = [];
                    }
        
                    const productNameVersion = `${product.product_name} ${product.version_number}`;
                    acc[date].categories[categoryName].push({
                        product: productNameVersion,
                        count: hostnamesCount // Assuming you want to count hostnames per product here
                    });
        
                    return acc;
                }, {});
        
                const filteredDates = Object.keys(eosCount).filter(date => {
                    const dateTimestamp = new Date(date).getTime();
                    const invalidTimestamps = [
                        253402185600000,
                        0,
                        -27000000,
                        new Date('9998-12-31 00:00:00').getTime()
                    ];
                    return !invalidTimestamps.includes(dateTimestamp);
                });
        
                // Define color mapping for categories
                const categoryColors = {
                    'Server': '#FF5733',
                    'Network': '#33FF57',
                    'Applications': '#5733FF',
                    // Add more categories and colors as needed
                };
        
                // Prepare chart data with colors based on categories
                const categories = [...new Set(filteredDates.flatMap(date =>
                    Object.keys(eosCount[date].categories)
                ))];
        
                const chartData = categories.map(category => {
                    const categoryName = category.trim();
                    return {
                        name: categoryName,
                        color: categoryColors[categoryName] || '#AAAAAA', // Default color if category not found
                        data: filteredDates.flatMap(date => {
                            if (eosCount[date].categories[category]) {
                                return eosCount[date].categories[category].map(product => ({
                                    x: new Date(date).getTime(),
                                    y: product.count, // Ensure you're accessing the correct count here
                                    product: product.product,
                                    category: categoryName
                                }));
                            }
                            return [];
                        })
                    };
                });
        
                // Process chartData to ensure each category's data has unique points by date and count
        
                let limitedChartData = [];

                if (numProducts !== "all") {
                    // Flatten all data points across categories
                    const allDataPoints = chartData.flatMap(series => series.data);
        
                    // Sort all data points by date in ascending order, then by product name
                    allDataPoints.sort((a, b) => a.x - b.x);
        
                    // Get the exact numProducts data points
                    const limitedDataPoints = allDataPoints.slice(0, parseInt(numProducts));
        
                    // Create a map to store data points for each category
                    const categoryMap = new Map();
                    limitedDataPoints.forEach(point => {
                        const categoryKey = point.category;
                        if (!categoryMap.has(categoryKey)) {
                            categoryMap.set(categoryKey, []);
                        }
                        categoryMap.get(categoryKey).push(point);
                    });
        
                    // Reconstruct limitedChartData with unique data points
                    limitedChartData = Array.from(categoryMap.entries()).map(([category, data]) => ({
                        name: category,
                        color: categoryColors[category] || '#AAAAAA',
                        data: data
                    }));
                } else {
                    limitedChartData = chartData;
                }
        
                console.log('Chart Data:', limitedChartData); // Debug statement
        
                result(limitedChartData.flat()); // Flatten the array of arrays to pass to the component
            }
        });
    }

    // console.log("Hello");
    // console.log(sql_response);

}


// to be used after user management implemented
Products.allProductsQuery = (data, result) => {

    const categoryID = data.query.categoryID;
    const vendorID = data.query.vendorID;

    if (categoryID == 4 && vendorID != 4) {
        // query for all products under which vendor
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source, p.do_not_crawl, p.remarks FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [vendorID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                console.log(res);
                result(null, res);
            }
        });
    }

    else if (vendorID == 4 && categoryID != 4) {
        // query for all products under which category
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source, p.do_not_crawl, p.remarks FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID], (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                console.log(res);
                result(null, res);
            }
        });
    }

    else if (vendorID == 4 && categoryID == 4) {
        // admin, so query everything
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source, p.do_not_crawl, p.remarks FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }
            else {
                // console.log(res);
                result(null, res);
            }
        });
    }

    else {
        // query specific types of products
        sql.query("SELECT p.products_id,p.name AS product_name,p.eos_date,p.url,GROUP_CONCAT(h.hostname_name) AS all_hostnames,c.category_name, v.vendor_name, p.version_number, p.target_version, p.contains_primary_source, p.do_not_crawl, p.remarks FROM products p LEFT JOIN products_hostname ph ON p.products_id = ph.products_id LEFT JOIN hostname h ON ph.hostname_id = h.hostname_id LEFT JOIN category c ON p.category_id = c.category_id LEFT JOIN vendor v ON p.vendor_id = v.vendor_id WHERE (c.category_id = ?) AND (v.vendor_id = ?) GROUP BY p.products_id, p.name, p.eos_date, p.url, c.category_name;", [categoryID, vendorID], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            console.log(res);
            result(null, res);
        }
    });
}
};

Products.crawlAllNow = (data, result) => {

    if (data) {
        const ids = data.ids;

        const pythonvenv = path.resolve(__dirname, "../scripts/venv/Scripts/python.exe");
        const scriptPath = path.resolve(__dirname, "../scripts/main.py");
    
        // console.log("Python venv path:", pythonvenv);
        // console.log("Script path:", scriptPath);
    
        const idsArgument = "--ids";
    
        const scriptDir = path.dirname(scriptPath);
        process.chdir(scriptDir);
        const crawlerProcess = spawn(pythonvenv, [scriptPath, idsArgument, ids]);
    
        crawlerProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            // result(null, data.toString());
        });
    
        crawlerProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            // result(data.toString(), null);
        });
    
        crawlerProcess.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            result(null, data.toString());
        });
    }

}

Products.getCrawlTime = (result) => {
    sql.query("SELECT crawl_time from crawl_times", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        else {
            console.log(res);
            result(null, res);
        }
    });
};

Products.allAssetsQuery = (data, result) => {

    const categoryID = data.query.categoryID;
    const vendorID = data.query.vendorID;

}


module.exports = Products;