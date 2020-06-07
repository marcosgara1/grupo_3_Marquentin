const productData = require('../models/product');

let controlador = {
    index : function (req, res) {

        let products = [];

        if (req.query.busqueda) {

            products = productData.filterByName(req.query.busqueda);
        } else {

            products = productData.findAll();
        }
        
        res.render('products', { products : products } );
    },

    formCreate : function (req, res) {
        
        res.render('create');
    
    },

    create : function (req, res, next) {

        let product = {
            name: req.body.name,
            modelo: req.body.modelo,
            price: req.body.price,
            description: req.body.description,
            clasificacion: req.body.familia,
            foto : req.files[0].filename
        } 

        productData.create(product);

        res.redirect('products');
        
    },

    detail : function (req, res) {

       let products = productData.findAll();

       let product = products.find(function(prod){
           return req.params.id == prod.id
       });
       
        res.render('detail', { product : product });

    },

    formEdit : function (req, res) {

        let prodId = req.params.id;

        let productoEncontrado = productData.findByPK(prodId);

        res.render('edit', { product : productoEncontrado});

    },

    edit : function (req, res) {

        let prodId = req.params.id;
        
        let product = productData.findByPK(prodId);

        product.name = req.body.name;
        product.modelo = req.body.modelo;
        product.price = req.body.price;
        product.description = req.body.description;
        product.foto = req.files[0].filename;

        if (req.file) {
            
            product.foto = req.file.path.replace('public/', '/');
        }

        productData.update(product);        

        res.redirect('/products');

    },

    delete : function (req, res) {

        let prodId = req.params.id;
        
        let product = productData.findByPK(prodId);

        productData.delete(product);

        res.redirect('products');

    }
    

};

module.exports = controlador;