export class Product {
    constructor(product, category) {
        this.name = product.name;
        this.patterns = product.patterns;
        this.category = category;
    }
    isMatch(url) {
        let match = false;
        for (let i = 0; (i < this.patterns.length) && !match; i++) {
            match = (url.indexOf(this.patterns[i].key) > -1);
        }
        return match;
    }
    isAbrProtocol() {
        return (this.category == "abrProtocol");
    }
    static initProducts(json) {
        const products = [];
        for (let i = 0; i < json.length; i++) {
            const component = json[i];
            const componentTypes = component.types;
            for (let j = 0; j < componentTypes.length; j++) {
                const componentType = componentTypes[j];
                let product = new Product(componentType, component.name);
                products.push(product);
            }
        }
        return products;
    }
    static getProductsByCategory(products, category) {
        return products.filter((product) => {return (product.category == category)})
    }
}