const fetch = require("node-fetch")

const apiroot = 'https://api.keygen.sh'
const api = apiroot.concat(`/v1/accounts/${process.env.KEYGEN_ACCOUNT}/`)
const token = process.env.KEYGEN_TOKEN

function deepEqual(object1, object2) { // Checks if the values inside the object are the same. This is to counter javascripts way of doing equal objects
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            areObjects && !deepEqual(val1, val2) ||
            !areObjects && val1 !== val2
        ) {
            return false;
        }
    }
    return true;
}
function isObject(object) {
    return object != null && typeof object === 'object';
}

/**
 * @param {{ months: Number }|{ divisions: Number }} metadata
 */

this.getProduct = async (metadata) => { // Get a product with matching metadata
    function getProducts(page) {
        return fetch(api.concat(`products?page[size]=10&page[number]=${page}`), { // Send a get request to the keygen api
            method: "GET",
            headers: {
                "Accept": "application/vnd.api+json",
                "Authorization": `Bearer ${token}` // Keygens authentication
            },
        }).then(response => response.json()).then(data => {
            const nextPage = data.links.next;

            let product

            data.data.forEach(Product => {
                if (deepEqual(Product.attributes.metadata, metadata)) { // If the metadata from the parameter matches the metadata from the response
                    product = Product // If so then define the product
                }
            })

            if (product || !nextPage)
                return product; // Return the product if its defined or return undefined if there is no pages left
            else
                return getProducts(page + 1);
        });
    }
    return await getProducts(1) // Await because fetch returns a promise
}

module.exports = this