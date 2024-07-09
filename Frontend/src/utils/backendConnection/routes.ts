import { BackendConnection } from "./base";

abstract class Auth {
    static async validate(token: string) {
        return await BackendConnection.get('auth', undefined, { }, token);
    }

    static async login(email: string, emailVerificationCode: string) {
        return await BackendConnection.post('auth/login', undefined, { email, emailVerificationCode }, undefined);
    }

    static async sendLoginValidationEmail(email: string) {
        return await BackendConnection.post('auth/login/validate-email', undefined, { email }, undefined);
    }

    static async register(email: string, username: string, firstName: string, lastName: string, emailVerificationCode: string) {
        return await BackendConnection.post('auth/register', undefined, { email, username, firstName, lastName, emailVerificationCode }, undefined);
    }

    static async sendRegisterValidationEmail(email: string) {
        return await BackendConnection.post('auth/register/validate-email', undefined, { email }, undefined);
    }
}

abstract class Recipes {
    static async getRecipes(token: string) {
        return await BackendConnection.get('recipes', undefined, { }, token);
    }

    static async getMarkedRecipes(token: string) {
        return await BackendConnection.get('recipes/mark', undefined, { }, token);
    }

    static async markRecipe(token: string, recipeId: string) {
        return await BackendConnection.post('recipes/mark', recipeId, { }, token);
    }

    static async unmarkRecipe(token: string, recipeId: string) {
        return await BackendConnection.delete('recipes/mark', recipeId, { }, token);
    }

    static async getCookedTimes(token: string, recipeId: string) {
        return await BackendConnection.get('recipes/cooked', recipeId, { }, token);
    }

    static async markCooked(token: string, recipeId: string) {
        return await BackendConnection.post('recipes/cooked', recipeId, { }, token);
    }

    static async searchRecipes(token: string, search: string) {
        return await BackendConnection.get('recipes/search', undefined, { search: search }, token);
    }

    static async getRecipe(token: string, recipeId: string) {
        return await BackendConnection.get('recipes', recipeId, { }, token);
    }

    static async createRecipe(token: string, recipe: any, ingredients: any) {
        return await BackendConnection.post('recipes', undefined, { recipe, ingredients }, token);
    }

    static async updateRecipe(token: string, recipeId: string, recipe: any, ingredients: any) {
        return await BackendConnection.put('recipes', recipeId, { recipe, ingredients }, token);
    }

    static async deleteRecipe(token: string, recipeId: string) {
        return await BackendConnection.delete('recipes', recipeId, { }, token);
    }
}

abstract class Ingredients {
    static async getIngredients(token: string) {
        return await BackendConnection.get('ingredients', undefined, { }, token);
    }

    static async searchIngredients(token: string, search: string) {
        return await BackendConnection.get('ingredients/search', undefined, { search: search }, token);
    }

    static async filterIngredients(token: string, filters: any) {
        return await BackendConnection.get('ingredients/filter', undefined, { filters }, token);
    }

    static async getIngredient(token: string, ingredientId: string) {
        return await BackendConnection.get('ingredients', ingredientId, { }, token);
    }

    static async createIngredientCreationRequest(token: string, name: string, properties: any) {
        return await BackendConnection.post('ingredients', undefined, { name, properties }, token);
    }

    static async createIngredientUpdateRequest(token: string, ingredientId: string, name: string, properties: any) {
        return await BackendConnection.put('ingredients', ingredientId, { name, properties }, token);
    }

    static async createIngredientDeleteRequest(token: string, ingredientId: string) {
        return await BackendConnection.delete('ingredients', ingredientId, { }, token);
    }
}

abstract class Suggestions {
    static async getSuggestions(token: string) {
        return await BackendConnection.get('suggestions', undefined, { }, token);
    }

    static async updateSuggestions(token: string) {
        return await BackendConnection.post('suggestions', undefined, { }, token);
    }

    static async updateSuggestionsSettings(token: string, settings: any) {
        return await BackendConnection.post('suggestions/settings', undefined, { settings }, token);
    }

    static async getSuggestionsSettings(token: string) {
        return await BackendConnection.get('suggestions/settings', undefined, { }, token);
    }
}


export abstract class Backend {
    static Auth = Auth;
    static Recipes = Recipes;
    static Ingredients = Ingredients;
    static Suggestions = Suggestions;
}