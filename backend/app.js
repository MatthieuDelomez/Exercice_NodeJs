const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser"); // recuperer methode post

mongoose.connect('mongodb+srv://MarkoMetro:<password>@cluster0-9ynco.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
/*
app.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
  });
*/
  /**
   * Gestion des erreurs CORS
   */
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  /**
   * Méthode middleware pour créer notre nouvel objet
   */
  app.use(bodyParser.json());

  /**
   * MIDDLEWARE QUI VA NOUS SERVIR A CREER NOS DIFFERENTES ROUTES
   */

   const Product = require('./models/product');

   /**
    * Middleware get pour afficher la liste de tout
    * les produits dispo en base
    */
   
   app.get('/api/products', (req, res, next) => {
       Product.find()
       .then(products => res.status(200).json({products}))
       .catch(error => res.status(400).json({error}));
   });

   /**
    * Middleware get pour afficher un produit 
    * spécifique
    */
   app.get('/api/products/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id})
    .then(product => res.status(200).json({product}))
    .catch(error => res.status(400).json({error}));
});


   /**
    * Middleware post pour ajouter un nouveau produit
    */
   
   app.post('/api/products', (req, res, next) => {
      //delete req.body._id;
       const product = new Product({
           ...req.body
       });
       product.save()
       .then(product => res.status(201).json({product}))
       .catch(error => res.status(400).json({error}));
   });

   /**
    * Middleware put pour modifier un nouveau produit
    */
   app.put('/api/products/:id', (req, res, next) => {
       Product.updateOne({ _id: req.params.id}, {...req.body, _id: req.params.id})
       .then(() => res.status(200).json({message: 'Modified!'}))
       .catch(error => res.status(400).json({ error }));
   })

   /**
    * Middleware qui va permettre à supprimer notre produit via son id
    */
   app.delete('/api/products/:id', (req, res, next) => {
        Product.deleteOne({ _id: req.params.id})
        .then(() => res.status(200).json({message: 'Deleted!'}))
        .catch(error => res.status(400).json({ error }));
   });




module.exports = app;