const urlApi = "https://gradistore-spi.herokuapp.com/products/all";

export let store = [];

await fetch(urlApi)
    .then(response => response.json())
    .then(data => {
        store = data;
        return store;
    })
    .catch(err => console.log(err));