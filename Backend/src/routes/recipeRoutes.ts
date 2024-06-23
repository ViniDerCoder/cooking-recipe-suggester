import express from 'express';
const router = express.Router();


router.use((req, res, next) => {
    //auth
    next();
});

router.get('/', async (req, res) => {
    res.send('List all recipes of the user');
});

//late feature
router.get('/search', async (req, res) => {
    res.send('Search for recipes by name, ingredients, etc.');
});

router.get('/:id', async (req, res) => {
    res.send('Get recipe by id: ' + req.params.id);
});

router.post('/', async (req, res) => {
    res.send('Create a new recipe in users collection');

    //units: NULL, 'cups', 'tablespoons', 'teaspoons', 'grams', 'kilograms', 'milliliters', 'liters', 'some', 'big', 'small', 'shot', 'pinch', 'drop', 'packet' 
});

router.put('/:id', async (req, res) => {
    res.send('Update a users recipe by id: ' + req.params.id);
});

router.delete('/:id', async (req, res) => {
    res.send('Delete a users recipe by id: ' + req.params.id);
});

export default router;