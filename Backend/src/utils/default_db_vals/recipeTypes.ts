const defaultTypes = [
    {
        id: 'e6f5a76f-9420-5e99-9cf2-5b4a12186c9e',
        name: 'Frühstück'
    },
    {
        id: 'ee9ecd2a-79ee-53d6-9589-a71e5f17ba11',
        name: 'Desert'
    },
    {
        id: '149ba261-3f93-53b7-a9b4-4407daed3b84',
        name: 'Snack'
    },
    {
        id: 'd163f21e-cd55-5706-bd79-c1b5a496612c',
        name: 'Getränk'
    },
    {
        id: '24779ca0-687e-521e-bbd4-d3f9c996ddb2',
        name: 'Appetizer'
    },
    {
        id: 'ea0bc553-7d33-581a-ad72-08c81c41751d',
        name: 'Hauptgericht'
    },
    {
        id: 'a7c71004-2ec0-5343-aacb-45e909d1a056',
        name: 'Salat'
    },
    {
        id: '48657636-1cd0-5b90-a416-b6f48154d2ed',
        name: 'Gebäck'
    }
];

import query from '../query.js';

export async function insertRecipeTypeDefaults() {
    // Insert default ingredients
    for (const type of defaultTypes) {
        const params = [
            type.id,
            type.name
        ];
        const q = ''
        + 'INSERT INTO '
        + 'cooking_recipe_suggester.recipe_types '
        + '(id, name) '
        + 'VALUES (?, ?) '
        + 'IF NOT EXISTS';

        const result = await query(q, params)
    }
}