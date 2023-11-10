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
	async getProduct(){	
		let productosArchivados = await fs.promises.readFile('productos.json', 'utf-8');
		productosArchivados = JSON.parse(productosArchivados);
		return productosArchivados;
	}
	//readById
	async getProductById(id) {
        let productosArchivados = await this.getProduct();
        const product = productosArchivados.find(producto => producto.id === id);
        return product;
    }
	async updateProduct(id, updatedData) {
        let productosArchivados = await this.getProduct();
        const index = productosArchivados.findIndex(producto => producto.id === id);

        if (index !== -1) {
            productosArchivados[index] = { ...productosArchivados[index], ...updatedData };
            const productosEnString = JSON.stringify(productosArchivados, null, 2);
            await fs.promises.writeFile('productos.json', productosEnString);
            return true; // Indica que la actualización fue exitosa
        }
        return false; // Indica que no se encontró el producto con el ID especificado
    }
	async deleteProduct(id) {
        let productosArchivados = await this.getProduct();
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
	const managerProduct = new ProductManager();
	await managerProduct.addProduct('procesador', 'next generation', 190, 'sin imagen', 'abc123', 5);
	await managerProduct.addProduct('tarjeta de video', 'high performance', 300, 'otra imagen', 'def456', 10);
	await managerProduct.addProduct('mother', 'ultra power', 210, 'otra imagen más', 'ghi789', 8);
	console.log (await managerProduct.getProduct());

	const productIdToGet = 2; 
    const productById = await managerProduct.getProductById(productIdToGet);
    console.log(`Producto con ID ${productIdToGet}:`, productById);

	const productIdToUpdate = 1;
    const updatedData = {
        title: 'Nuevo Procesador',
        price: 200,
        stock: 8
    };

    const isUpdated = await managerProduct.updateProduct(productIdToUpdate, updatedData);
    
    if (isUpdated) {
        console.log(`Producto con ID ${productIdToUpdate} actualizado.`);
    } else {
        console.log(`No se encontró un producto con ID ${productIdToUpdate}.`);
    }
    console.log(await managerProduct.getProduct());

	const productIdToDelete = 1;

    const isDeleted = await managerProduct.deleteProduct(productIdToDelete);
    
    if (isDeleted) {
        console.log(`Producto con ID ${productIdToDelete} eliminado.`);
    } else {
        console.log(`No se encontró un producto con ID ${productIdToDelete}.`);
    }

    console.log(await managerProduct.getProduct());
}

productosAsincronos();