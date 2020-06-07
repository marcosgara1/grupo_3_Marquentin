const fs = require('fs');
const path = require('path');

const fileData = path.join(__dirname, '../data/products.json');


let productData = {
    findAll: function () {

        if (!fs.existsSync(fileData)) {
            fs.writeFileSync(fileData, '');
        }

        let jsonFile = fs.readFileSync(fileData, 'utf8');

        let products = jsonFile.length === 0 ? [] : JSON.parse(jsonFile);
        return products;
    },

    create: function (product) {
        let array = this.findAll();

        product.id = this.lastID();

        array.push(product);

        jsonData = JSON.stringify(array, null, " ");

        fs.writeFileSync(fileData, jsonData);
    },

    lastID: function () {

        let array = this.findAll();

        let lastID = 0;

        for (product of array) {
            if (lastID < product.id) {
                lastID = product.id;
            }
        }

        return lastID + 1;
    },

    filterByName: function (name) {
        
        let array = this.findAll();

        return array.filter(function (prod) {

        search = new RegExp(name.toLowerCase())

        return prod.name.toLowerCase().search(search) >= 0;

        });
    },

    findByPK : function (id) {
        return this.findAll().find(function(producto){
            return producto.id == id;
        });
    },

    update : function (editProd) {
        
        let array = this.findAll();

        array = array.filter(function(prod){
            return prod.id != editProd.id;
        });

        array.push(editProd);

        jsonData = JSON.stringify(array, null, ' ');

        fs.writeFileSync(fileData, jsonData);
<<<<<<< HEAD
    },

    delete : function (deleteProd) {
      
        let array =this.findAll();

        array = array.filter(function(prod){
            return prod.id != deleteProd;
        });

        jsonData = JSON.stringify(array, null, ' ');

=======
    },   

    delete : function(deleteProd) {
        let array = this.findAll();
        
        array = array.filter(function(prod) {
            return prod.id != deleteProd.id ;
        });
        //elimino la que me llego por parametro
        array.splice(deleteProd);

        //convertir a json ese array con el producto eliminado
        jsonData = JSON.stringify(array, null, " ");
        //escribo
>>>>>>> 2ace67b8fefabace6d2064270f4b9fd06e7a599f
        fs.writeFileSync(fileData, jsonData);
    }
};

module.exports = productData;