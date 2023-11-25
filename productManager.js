const fs = require('fs');

class ProductManager{
	constructor(){
		this.nextProductId = 1;
	};
    
    productos = [];
  
	//create
	async addProduct(title, description, price, thumbnail, code, stock){
		const id = this.nextProductId++;
		this.productos.push({id, title, description, price, thumbnail, code, stock});
		const productosEnString = JSON.stringify(this.productos, null, 2);
		await fs.promises.writeFile('productos.json', productosEnString);
	}
	//read
	async getProducts(){	
		let productosArchivados = await fs.promises.readFile('productos.json', 'utf-8');
		productosArchivados = JSON.parse(productosArchivados);
		return productosArchivados;
	}

    //read limit
    async getLimitedProducts(limit){
        let productosArchivados = await fs.promises.readFile('productos.json', 'utf-8');
        productosArchivados = JSON.parse(productosArchivados);
        
        if(parseInt(limit) <= 0){
            console.log("invalid");
        }else{
            return productosArchivados.slice(0, parseInt(limit));
        }
    }

	//readById
	async getProductById(id) {
        let productosArchivados = await this.getProducts();
        const product = productosArchivados.find(producto => producto.id === id);
        return product;
    }

    //update
	async updateProduct(id, updatedData) {
        let productosArchivados = await this.getProducts();
        const index = productosArchivados.findIndex(producto => producto.id === id);

        if (index !== -1) {
            productosArchivados[index] = { ...productosArchivados[index], ...updatedData };
            const productosEnString = JSON.stringify(productosArchivados, null, 2);
            await fs.promises.writeFile('productos.json', productosEnString);
            return true; // Indica que la actualización fue exitosa
        }
        return false; // Indica que no se encontró el producto con el ID especificado
    }

    //delete
	async deleteProduct(id) {
        let productosArchivados = await this.getProducts();
        const updatedProducts = productosArchivados.filter(producto => producto.id !== id);

        if (productosArchivados.length !== updatedProducts.length) {
            const productosEnString = JSON.stringify(updatedProducts, null, 2);
            await fs.promises.writeFile('productos.json', productosEnString);
            return true; // Indica que la eliminación fue exitosa
        }
        return false; // Indica que no se encontró el producto con el ID especificado
    }
}

async function productosAsincronos(){
    // Crear una instancia del ProductManager
	const managerProduct = new ProductManager();
	// Añadir algunos productos de ejemplo
    await managerProduct.addProduct('procesador', 'next generation', 190, 'sin imagen', 'abc123', 5);
	await managerProduct.addProduct('tarjeta de video', 'high performance', 300, 'otra imagen', 'def456', 10);
	await managerProduct.addProduct('mother', 'ultra power', 210, 'otra imagen más', 'ghi789', 8);
	await managerProduct.addProduct('memoria ram', 'top memory', 25, 'nueva imagen', 'jkl 012', 3);
    await managerProduct.addProduct('estabilizador celular', 'smooth', 75, 'otra imagen nueva', 'mno345', 1);
    await managerProduct.addProduct('camera', 'free bitrate', 210, 'otra vez sin imagen','pqr678', 11);
    
    // Imprimir la lista de productos
    console.log (await managerProduct.getProducts());

    // Obtener un producto por su ID (en este caso, el ID es 2)
	const productIdToGet = 2; 
    const productById = await managerProduct.getProductById(productIdToGet);
    console.log(`Producto con ID ${productIdToGet}:`, productById);

    // Actualizar un producto por su ID (en este caso, el ID es 1)
	const productIdToUpdate = 1;
    const updatedData = {
        title: 'Nuevo Procesador',
        price: 200,
        stock: 8
    };

    const isUpdated = await managerProduct.updateProduct(productIdToUpdate, updatedData);
    
    // Imprimir un mensaje indicando si la actualización fue exitosa o no
    if (isUpdated) {
        console.log(`Producto con ID ${productIdToUpdate} actualizado.`);
    } else {
        console.log(`No se encontró un producto con ID ${productIdToUpdate}.`);
    }

    // Imprimir la lista de productos después de la actualización
    console.log(await managerProduct.getProducts());

    // Eliminar un producto por su ID (en este caso, el ID es 1)
	const productIdToDelete = 1;

    const isDeleted = await managerProduct.deleteProduct(productIdToDelete);
    
    // Imprimir un mensaje indicando si la eliminación fue exitosa o no
    if (isDeleted) {
        console.log(`Producto con ID ${productIdToDelete} eliminado.`);
    } else {
        console.log(`No se encontró un producto con ID ${productIdToDelete}.`);
    }

    // Imprimir la lista de productos después de la eliminación
    console.log(await managerProduct.getProducts());
}

// Si este script se está ejecutando directamente, llamar a la función productosAsincronos
if (require.main === module) {
    // Esta condición verifica si el script se está ejecutando directamente
    productosAsincronos();
}

// Exportar la clase ProductManager (para ser utilizada en otros archivos si es necesario)
module.exports = ProductManager;