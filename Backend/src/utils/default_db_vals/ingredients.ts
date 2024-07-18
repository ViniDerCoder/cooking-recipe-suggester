const defaultIngredients = [
    {
        name: 'Tomate',
        id: 'e61ef851-0723-579d-a56c-0c303e5797a6',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Zwiebel',
        id: '47913170-679e-50f1-9787-62a0b569c450',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Knoblauchzehe',
        id: 'a8aaa241-adbe-5b47-9bc8-21b5b7a3b3fe',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Salz',
        id: 'd384450a-9d32-50c4-b645-472c743ce4b2',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Pfeffer',
        id: '5a9499e0-b9cf-56c0-bb32-57324b035652',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Olivenöl',
        id: '7d50e9be-6190-5fa9-93ec-ba649c9386f2',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Butter',
        id: '2bbdf9d3-c824-5127-8e97-92b52cfb2c3b',
        vegan: false,
        vegetarian: true,
        gluten_free: true,
        dairy_free: false,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Mehl',
        id: 'f6cf563b-3ee7-597b-92f8-86e7002e07c7',
        vegan: true,
        vegetarian: true,
        gluten_free: false,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Zucker',
        id: '522bb110-95e6-5d03-b34c-aaf80d43fa64',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Milch',
        id: '5ba7659b-590b-52a6-b653-fe6985a3a1c6',
        vegan: false,
        vegetarian: true,
        gluten_free: true,
        dairy_free: false,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Ei',
        id: '51c918fb-d5b8-5f73-8dce-2f5b06b2018b',
        vegan: false,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: false,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Lachs',
        id: 'ac853dc4-48b5-525e-8953-c8f88a1eda85',
        vegan: false,
        vegetarian: false,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: false,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Garnelen',
        id: '71d67921-3b43-5fc1-a7cf-c886fda4d0fa',
        vegan: false,
        vegetarian: false,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: false,
        shellfish_free: false,
        soy_free: true
    },
    {
        name: 'Sojasauce',
        id: '2fbc284c-f7c2-5efe-bfc1-875a8fdbf0a6',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: false
    },
    {
        name: 'Reis',
        id: 'a6b5c8d7-e2a3-4f8e-8c6b-715a3e5f3b7d',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Weißzucker',
        id: 'f1a4b7c8-6d9e-4b9c-8e7f-5a1b6c3d2e8f',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },    
    {
        name: 'Erdnussbutter',
        id: '1b9e50b1-7e8c-4d9c-99d3-8a5b19b8d37f',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: false,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Mandeln',
        id: '17a6c5a5-5c62-4811-8e39-ff1b7e327739',
        vegan: true,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: false,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Honig',
        id: '06d5cddc-0e6c-4144-b6ae-1a98b63c25a1',
        vegan: false,
        vegetarian: true,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    },
    {
        name: 'Hähnchenbrust',
        id: '7d5f5b94-0728-4a5d-8a45-fc20737f2919',
        vegan: false,
        vegetarian: false,
        gluten_free: true,
        dairy_free: true,
        nut_free: true,
        egg_free: true,
        fish_free: true,
        shellfish_free: true,
        soy_free: true
    }
]

import query from '../query.js';

export async function insertIngredientDefaults() {
    // Insert default ingredients
    for (const ingredient of defaultIngredients) {
        const params = [
            ingredient.id,
            ingredient.name,
            ingredient.vegan,
            ingredient.vegetarian,
            ingredient.gluten_free,
            ingredient.dairy_free,
            ingredient.nut_free,
            ingredient.egg_free,
            ingredient.fish_free,
            ingredient.shellfish_free,
            ingredient.soy_free
        ];
        const q = ''
        + 'INSERT INTO '
        + 'cooking_recipe_suggester.ingredients '
        + '(id, name, vegan, vegetarian, gluten_free, dairy_free, nut_free, egg_free, fish_free, shellfish_free, soy_free) '
        + 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        + 'IF NOT EXISTS';

        const result = await query(q, params)
    }
}
