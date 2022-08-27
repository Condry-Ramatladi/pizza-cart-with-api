document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function() {
      return {
        init(){
            //alert('Pizza cart loading')
             axios
                 .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                 .then((result)  => {
                     console.log(result.data);
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
              });
        },

        message: 'Ready to Order?',
        username: 'Condry',
        pizzas: [],
        cartId: '',
        cart : {total : 0},
        showCartBool: false,
        total: '',
        payday:'',

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

        pizzaImg(pizza){
          return `/image/${pizza.size}.png`;
        },
      

        pay(){
          alert('payyy') 
            const params = {
              cart_code: this.cartId,
              total: this.total 
            }

            axios
                .post('https://pizza-cart-api.herokuapp.com//api/pizza-cart/pay', params)
                .then(() => {
                  this.message = "Pizza added to the cart"
                  this.showCart();
                } )
                .catch(err => alert(err) ); 
        }

      }
    });
})