const router = require('express').Router();
const User = require('../model/User')
const { v4: uuidv4 } = require('uuid')
const { addProductValidation, updateProductValidation } = require('../validation')
const {verify} = require('./verifyToken')

//route for  adding products
router.post('/products',verify, (req, res) => {


    const { error } = addProductValidation(req.body)
    const id = req.user.id
    if (error) {
        res.send(error.details[0].message)
    } else {

        User.findById(id, (err, foundUser) => {
            if (err) {
                res.send(err)

            }
            else {
                if (foundUser) {
                    const { products } = foundUser
                    const newArr = []
                    products.forEach((item) => {
                        newArr.push(item.productname)
                    })
                    if (!newArr.includes(req.body.productname)) {

                        foundUser.products.push({
                            productid: uuidv4(),
                            productname: req.body.productname,
                            productprice: parseInt(req.body.productprice),
                            quantity: parseInt(req.body.quantity),
                            category: req.body.category
                        });
                        foundUser.save();
                        res.status(201).send("product added successfully");
                    }
                    else {
                        res.status(200).send("product already exists");
                    }
                }
            }
        })
    }
})


//route for viewing products
router.get('/viewproducts',verify, (req, res) => {

const id = req.user.id
    User.findById(id, (error, foundUser) => {


        if (error) {

            res.send(error.message);
            console.log(error);
        }
        else {
            const { products } = foundUser;
            res.send(products);
        }
    })
})

//route for deleting products
router.delete('/delete/:productid',verify, (req, res) => {

    const id = req.user.id

    User.findById(id, (error, foundUser) => {
        if (error) {
            res.send(error)
            console.log(error);
        }
        else {
            if (foundUser) {
                const { products } = foundUser;

                const filteredProduct = products.filter((item) => {
                    return item.productid != req.params.productid
                })
                while (foundUser.products.length > 0) {
                    foundUser.products.pop()
                }

                foundUser.products = filteredProduct
                foundUser.save()
                res.send(foundUser.products);
            }
        }
    })

})

//route for updating products
router.patch('/updateproducts',verify, (req, res) => {
    const { error } = updateProductValidation(req.body)
const id = req.user.id

    if (error) {
        res.send(error.details[0].message)
    } else {

        try {
            User.findById(id, (error, foundUser) => {
                if (foundUser) {
                    const { products } = foundUser

                    const filteredProduct = products.filter((item) => {
                        return item.productid != req.body.productid
                    })
                    while (foundUser.products.length > 0) {
                        foundUser.products.pop()
                    }

                    foundUser.products = filteredProduct

                    foundUser.products.push({
                        productid: req.body.productid,
                        productname: req.body.productname,
                        productprice: parseInt(req.body.productprice),
                        quantity: parseInt(req.body.quantity),
                        category: req.body.category
                    });
                    foundUser.save();
                    res.status(200).send("update successfull")
                }
            })
        } catch (err) {
            res.send(err);
        }

    }
})

//route for user
router.get('/user',verify, (req, res) => {

    const id = req.user.id
        User.findById(id, (error, foundUser) => {
    
    
            if (error) {
    
                res.send(error.message);
                console.log(error);
            }
            else {
               const user = {
                username: foundUser.username,
                email: foundUser.email,
                place: foundUser.place
               }

               res.send(user)
            }
        })
    })


module.exports = router;