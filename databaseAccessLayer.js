const database = require('./databaseConnection');

async function getAllRestaurants() {
    let sqlQuery = `
        SELECT restaurant_id, name, description
        FROM restaurant;
    `;
    
    try {
        const results = await database.query(sqlQuery);
		console.log("Query results:", results);
        return results;
    }
    catch (err) {
        console.log("Error selecting from restaurant table");
        console.log(err);
        return null;
    }s
}

async function addRestaurant(postData) {
    let sqlInsert = `
        INSERT INTO restaurant (name, description)
        VALUES (:name, :description);
    `;
    let params = {
        name: postData.name,
        description: postData.description,
    };
    
    try {
        await database.query(sqlInsert, params);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function deleteRestaurant(restaurantId) {
    // First, delete all reviews associated with the restaurant
    let sqlDeleteReviews = `
        DELETE FROM review
        WHERE restaurant_id = :restaurantId
    `;
    let sqlDeleteRestaurant = `
        DELETE FROM restaurant
        WHERE restaurant_id = :restaurantId
    `;
    
    try {
        await database.query(sqlDeleteReviews, { restaurantId });
        await database.query(sqlDeleteRestaurant, { restaurantId });
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

async function getReviewsByRestaurant(restaurantId) {
    let sqlQuery = `
        SELECT review_id, reviewer_name, details, rating
        FROM review
        WHERE restaurant_id = :restaurantId;
    `;
    
    try {
        const results = await database.query(sqlQuery, { restaurantId });
        console.log(results);
        return results;
    }
    catch (err) {
        console.log("Error selecting from review table");
        console.log(err);
        return null;
    }
}

async function addReview(postData) {
    let sqlInsert = `
        INSERT INTO review (restaurant_id, reviewer_name, details, rating)
        VALUES (:restaurantId, :reviewerName, :details, :rating);
    `;

    let params = {
        restaurantId: postData.restaurantId,
        reviewerName: postData.reviewerName,
        details: postData.details,
        rating: postData.rating,
    };
    
    try {
        await database.query(sqlInsert, params);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}


async function deleteReview(reviewId) {
    let sqlDeleteReview = `
        DELETE FROM review
        WHERE review_id = :reviewId
    `;
    
    try {
        await database.query(sqlDeleteReview, { reviewId });
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { getAllRestaurants, addRestaurant, deleteRestaurant, getReviewsByRestaurant, addReview, deleteReview };
