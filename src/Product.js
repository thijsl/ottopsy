export class Product {
    constructor(product, categories) {
        this.name = product.name;
        this.patterns = product.patterns;
        this.categoryId = product.categoryId;
        this.category = Product.getCategoryById(this.categoryId, categories)
    }
    isMatch(url) {
        let match = false;
        const networkPatterns = this.patterns.network;
        for (let i = 0; networkPatterns && (i < networkPatterns.length) && !match; i++) {
            match = (url.indexOf(networkPatterns[i].key) > -1);
        }
        return match;
    }
    isResponseBodyMatch(url) {
        let match = false;
        const patterns = this.patterns.responseBody;
        for (let i = 0; patterns && (i < patterns.length) && !match; i++) {
            match = (url.indexOf(patterns[i].key) > -1);
        }
        return match;
    }
    isAbrProtocol() {
        return (this.categoryId == "2");
    }
    static getCategoryById(categoryId, categories) {
        let category = "not-found";
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].id == categoryId) {
                return categories[i].name;
            }
        }
        return category;
    }
    static initProducts(productsJson, categoriesJson) {
        const products = [];
        for (let i = 0; i < productsJson.length; i++) {
            const productJson = productsJson[i];
            let product = new Product(productJson, categoriesJson);
            if (!product.disabled) {
                products.push(product);
            }
        }
        return products;
    }
    static getProductsByCategory(products, category) {
        return products.filter((product) => {return (product.category.toLowerCase() == category.toLowerCase())})
    }
}