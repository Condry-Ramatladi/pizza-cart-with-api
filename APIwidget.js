document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {
        init(){
            //alert('Pizza cart loading')
             axios
                 .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                 .then((result)  => {
                     console.log(result.data);
                     alert(result.data)
                      this.pizzas = result.data.pizzas
                })
                .then(() => {
                  return this.createCart();               
                })
                .then((result) => {
                    this.cartId = result.data.cart_code;
                })
      
        },
        createCart(){
          return axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username'+this.username)
                 },

        showCart() {
          const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
          
          axios
              .get(url)
              .then((result) => {
                this.cart = result.data;
                this.total =result.data.total;
                this.paid =result.data.status;
              });
        },

        'message': 'Ready to Order now?',
        username: 'Condry',
        pizzas: [],
        cartId: '',
        cart : {total : 0},
        showCartBool: false,
        total: '',
        paymentAmount: '',
        paymentMessage: 'Awaiting Payment',
        paid: '',

        add(pizza){
          //alert(pizza.flavour+" : "+ pizza.size) 
          this.showCartBool = true;
            const params = {
              cart_code: this.cartId,
              pizza_id: pizza.id 
            }

            axios
                .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                .then(() => {
                  this.message = "Pizza added to the cart"
                  this.showCart();
                } )
                .catch(err => alert(err) ); 
        },

        remove(pizza){
          //alert(pizza.flavour+" : "+ pizza.size) 
            const params = {
              cart_code: this.cartId,
              pizza_id: pizza.id 
            }

            axios
                .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                .then(() => {
                  this.message = "Pizza removed from the cart"
                  this.showCart();
                } )
                .catch(err => alert(err) ); 
                if(this.total == 0){
                  this.showCartBool = false;
                }
        },

        pizzaImg(pizza){
          return `/image/${pizza.size}.png`;
        },
      

        // pay(){
        //   alert('pay') 
        //     const params = {
        //       cart_code: this.cartId,
        //       amount: this.payAmount
        //     }

        //     axios
        //         .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
        //         .then(() => {
        //           this.payMessage = 'Payment Successful';
        //         } )
        // }

        pay() {
                const params = {
                  cart_code : this.cartId,
                  amount: this.paymentAmount
                  
                }
                console.log(params)
                axios
                  .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
                  .then(() => {
                      if(!this.paymentAmount) {
                          this.paymentMessage = 'No amount entered!'
                      }

                      else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                          this.paymentMessage = 'Payment Sucessful!'
                          this.message= this.username  + " Paid!"
                          setTimeout(() => {
                              this.cart.total = 0;
                              this.paymentAmount = 0;
                              this.paymentMessage = '';
                              this.message = '';
                            //   window.location.reload()
                          }, 3000);
                      }else{
                          this.paymentMessage = 'Sorry - You do not have enough money!'
                          setTimeout(() => {
                              this.cart.total = '';
                              
                              
                          }, 3000);
                      }
                  })
                  .catch(err=>alert(err));
              },

      }
    });
})