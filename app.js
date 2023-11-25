const express = require('express');
const ProductManager = require('./productManager'); 

const app = express();
const port = 3000;

// Crear una instancia de ProductManager
const managerProduct = new ProductManager();

// Endpoint para obtener todos los productos o un número limitado de productos
app.get('/products', async (req, res) => {
    try {
    const limit = req.query.limit;

    if (limit) {
        const limitedProducts = await managerProduct.getLimitedProducts(limit);
        res.json({ products: limitedProducts });
    } else {
        const allProducts = await managerProduct.getProducts();
        res.json({ products: allProducts });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});

