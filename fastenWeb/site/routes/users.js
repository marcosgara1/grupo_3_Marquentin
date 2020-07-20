const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const bcrypt = require('bcrypt');
const { check, validationResult, body } = require('express-validator');
const fs = require('fs');
const userData = require('../models/user');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const usersController = require('../controllers/usersController');
const { confirmPassword } = require('../models/user');
const db = require('./../database/models');




/*var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/users');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({ storage: storage });*/

//configuro donde y como se van a llamar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'public/img/users';
    //ojo debe de estar creada la carpeta en public
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    //el nombre del archivo es interesante ya que debe ser un nombre unico y no reemplaze a otros archivos.
    return cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname);
    if (acceptedExtensions.includes(ext)) {
      //si es correcto subo la imagen
      cb(null, true);
    } else {
      //aqui guardo la imagen en el body
      req.file = file;
      //le digo que no la suba
      cb(null, false);
    }
  }
});







router.get('/login', authMiddleware, usersController.formLogin);

router.post('/login', authMiddleware, [

  check('password').isLength({min:8})
    .withMessage('El password debe tener al menos 8 caracteres').bail(),

  check('email').isEmail().withMessage('Email inválido')
    .custom((value, {req})=>{
      return db.Cliente.findOne({where: {email: value}}).then(user => {
        if (user == null){
          return Promise.reject('Credenciales inválidas');
        } else if (user && !bcrypt.compareSync(req.body.password, user.password)) {
          return Promise.reject('Credenciales inválidas');
        }
      })
    }),

], usersController.processLogin)

router.get('/register', authMiddleware, usersController.formRegister);

router.post('/', authMiddleware, upload.single('foto'), [

  check('first_name').isLength({min:1}).withMessage('El campo Nombre debe estar completo'),
  check('last_name').isLength({min:1}).withMessage('El campo Apellido debe estar completo'),
  check('email').isEmail().withMessage('Debe ser un email válido')
    .custom(function(value){
      return db.Cliente.findOne({where: {email: value}}).then(user=>{
        if(user != null){
          return Promise.reject('El email ya está registrado');
        }
      })
    }),
    check('password', 'El password debe tener al menos 8 caracteres').isLength({min:8}).bail(),
    check('password', 'Los password no coinciden')
      .custom((value, { req }) => {
        return value === req.body.c_password
    }),
    body('foto').custom((value, {req})=>{
      if(req.file != undefined){
        const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
        const ext = path.extname(req.file.originalname)
        return acceptedExtensions.includes(ext);
      }
      return false;
    }).withMessage('La foto debe tener alguno de los siguientes formatos: JPG, JPEG, PNG'),

], usersController.register);

router.get('/profile', guestMiddleware, usersController.profile);

router.get('/:userId/formEditProfile', usersController.formEditProfile);

router.put('/:userId', upload.single('foto'), usersController.editProfile);

module.exports = router;







  /*check('first_name').isLength({ min: 1 }).withMessage('El campo Nombre debe estar completo'),

  check('last_name').isLength({ min: 1 }).withMessage('El campo Apellido debe estar completo'),

  check('email').isEmail().withMessage('Debe ingresar un email válido')
    .custom(function (value) {
       db.Cliente.findOne({where: { email: value }})
        .then ( function(user) {
          if (user != null) {
            return Promise.reject('El email ya está registrado');
          }
        })
    }),

  check('password').isLength({ min: 8 }).withMessage('La contraseña debe poseer al menos 8 caracteres'),

  check('password', 'Las contraseñas deben coincidir')
    .custom((value, { req }) => {
      return value === req.body.c_password
    }),
  body('foto').custom((value, { req }) => {
    if (req.file != undefined) {
      const acceptedExtensions = ['.jpg', '.jpeg', '.png'];
      const ext = path.extname(req.file.originalname)
      return acceptedExtensions.includes(ext);
    }
    return false;
  }).withMessage('La imagen debe tener alguna de los siguientes formatos; JPG, JPEG, PNG'),*/
