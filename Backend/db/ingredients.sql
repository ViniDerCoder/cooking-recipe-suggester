CREATE TABLE IF NOT EXISTS ingredients (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT

    vegan BOOLEAN DEFAULT TRUE,
    vegetarian BOOLEAN DEFAULT TRUE,
    gluten_free BOOLEAN DEFAULT TRUE,
    dairy_free BOOLEAN DEFAULT TRUE,
    nut_free BOOLEAN DEFAULT TRUE,
    egg_free BOOLEAN DEFAULT TRUE,
    fish_free BOOLEAN DEFAULT TRUE,
    shellfish_free BOOLEAN DEFAULT TRUE,
    soy_free BOOLEAN DEFAULT TRUE,
    wheat_free BOOLEAN DEFAULT TRUE
);