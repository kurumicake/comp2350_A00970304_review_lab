const router = require('express').Router();
const dbModel = require('../databaseAccessLayer'); // Adjusted to use require for consistency

// Display all restaurants
router.get('/', async (req, res) => {
    console.log("Home page hit");
    try {
        // Assuming getAllRestaurants() returns an array where the first element is the rows
        const result = await dbModel.getAllRestaurants();
        const restaurants = result[0]; // Extract the rows assuming result is [rows, fields]
        res.render('index', { restaurants }); // Pass the rows to the EJS template
    } catch (err) {
        console.error("Error reading from database", err);
        res.render('error', { message: 'Error reading from database' });
    }
});

// Add a new restaurant
router.post('/addRestaurant', async (req, res) => {
    console.log("Add restaurant form submit");
    try {
        const success = await dbModel.addRestaurant(req.body);
        if (success) {
            res.redirect("/");
        } else {
            console.error("Error writing to database");
            res.render('error', { message: "Error writing to database" });
        }
    } catch (err) {
        console.error("Error writing to database", err);
        res.render('error', { message: "Error writing to database" });
    }
});

// Delete a restaurant and its reviews
router.get('/deleteRestaurant', async (req, res) => {
    console.log("Delete restaurant request");
    let restaurantId = req.query.id;
    if (restaurantId) {
        try {
            const success = await dbModel.deleteRestaurant(restaurantId);
            if (success) {
                res.redirect("/");
            } else {
                console.error("Error deleting from database");
                res.render('error', { message: 'Error deleting from database' });
            }
        } catch (err) {
            console.error("Error deleting from database", err);
            res.render('error', { message: 'Error deleting from database' });
        }
    }
});

module.exports = router;
