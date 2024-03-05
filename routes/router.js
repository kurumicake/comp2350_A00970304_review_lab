const router = require('express').Router();
const dbModel = require('../databaseAccessLayer');

// Display all restaurants with links to view their reviews
router.get('/', async (req, res) => {
    console.log("Home page hit");
    try {
        const result = await dbModel.getAllRestaurants();
        const restaurants = result[0];
        res.render('index', { restaurants });
    } catch (err) {
        console.error("Error reading from database", err);
        res.render('error', { message: 'Error reading from database' });
    }
});

// Display reviews for a specific restaurant
router.get('/reviews', async (req, res) => {
    const restaurantId = req.query.restaurantId;
    if (!restaurantId) {
        return res.status(400).send('Restaurant ID is required');
    }

    try {
        const [reviews] = await dbModel.getReviewsByRestaurant(restaurantId); // Destructure to get just the results
        console.log(reviews); // Should log the array of TextRow objects
        res.render('reviews', { reviews, restaurantId });
    } catch (err) {
        console.error("Error reading reviews from database", err);
        res.render('error', { message: 'Error reading reviews from database' });
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
router.get('/deleteRestaurant/:restaurantId', async (req, res) => {
    console.log("Delete restaurant request");
    const { restaurantId } = req.params;
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
});

// Add a new review for a restaurant
router.post('/addReview/:restaurantId', async (req, res) => {
    console.log("Add review form submit");
    const { restaurantId } = req.params;
    try {
        const success = await dbModel.addReview(req.body, restaurantId);
        if (success) {
            res.redirect(`/reviews/${restaurantId}`);
        } else {
            console.error("Error writing to database");
            res.render('error', { message: "Error writing to database" });
        }
    } catch (err) {
        console.error("Error writing to database", err);
        res.render('error', { message: "Error writing to database" });
    }
});

// Delete a review
router.get('/deleteReview/:reviewId/:restaurantId', async (req, res) => {
    console.log("Delete review request");
    const { reviewId, restaurantId } = req.params;
    try {
        const success = await dbModel.deleteReview(reviewId);
        if (success) {
            res.redirect(`/reviews/${restaurantId}`);
        } else {
            console.error("Error deleting review from database");
            res.render('error', { message: 'Error deleting review from database' });
        }
    } catch (err) {
        console.error("Error deleting review from database", err);
        res.render('error', { message: 'Error deleting review from database' });
    }
});

module.exports = router;
