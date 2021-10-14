const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: String,
    resetTokenExpiration: Date,
    cart: {
        items: [{
            productId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Product',
            required: true 
        }, 
            quantity : {
            type : Number, 
            required: true
        }
        }]
    },
    tokens: [{
      token: {
        type: String,
        required: true
      }
    }]
})


// 1. We Create our own method to add to cart on the mongoose model
 schema.methods.addToCart = function(product) {
   const user = this
     // 2. We find the index of an existing product in the cart by the id
    const cartProductIndex = user.cart.items.findIndex(cp => {
      return cp.productId.toString() === product._id.toString();
    });
    // 3. We create a variable with a default value 1, this will be used to update the quantity of product
    let newQuantity = 1;
    //4. By using the spread operator we copy out all the elements in the items in the cart within an array (productId & quantity)
    const updatedCartItems = [...user.cart.items];
    // 5. If we actually have an index greater than zero 0r equal to zero means we have an existing item some where in the cart
    if (cartProductIndex >= 0) {
        // 6.Then we increase the qty of the product in the items through the index by 1
      newQuantity = user.cart.items[cartProductIndex].quantity + 1;
      // 7. then we replace the new quantity of the existing item with the new qty.
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        // 8. If we dont have any existing product then we add the new qty and the product Id and push to the updated cart items
      updatedCartItems.push({
        productId: product._id,
        quantity: newQuantity
      });
    }
    // 9. then we update the cart items with the updated_cart_items in a variable called updatedCart
    const updatedCart = {
      items: updatedCartItems
    };
    //10. We then update the cart with the updatedCart variable and save
    user.cart = updatedCart;
    return user.save();
  };

schema.methods.removeFromCart = function(productId) {
  const user = this
  const updatedCartItems = user.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString()})
    user.cart.items = updatedCartItems
    return user.save()
}

schema.methods.clearCart = function() {
  const user = this
  user.cart = { items: []}
  return user.save()
}
  

const UserModel = mongoose.model('User', schema)

module.exports = UserModel