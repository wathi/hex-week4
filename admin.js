const admin = Vue.createApp({
  data() {
    return { 
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'bustour',
      currency: "日元",
      products: [],
      productModalShow: false,
      tempProduct:{},
      emptyProduct:{
        category: "",
        content: "",
        description: "",
        id: "",
        is_enabled: 1,
        origin_price: 0,
        price: 0,
        title: "",
        unit: "",
        num: 0,
        imageUrl : "",
      },
      errMsg:[],
      pagination:{},
      isNew: true,
    }
  },
  methods: {
    checkLogin: function(){ 
      axios.post(`${this.apiUrl}/api/user/check`)
      .then((res) => {
        if(res.data.success){
            console.log(res.data);
            this.getProductAdmin();
        } else {
          console.log(res.data);
          // window.location.href="login.html";
        };
      })
      .catch((err) => {
        console.log(err);
      });
    },
    getProductAdmin: function(page){
      this.products = [];
      axios.get(`${this.apiUrl}/api/${this.apiPath}/admin/products?page=${page}`)
      .then((res) => {
        console.log(res.data.products)
          if(res.data.success){
            this.products = res.data.products;
            this.pagination = res.data.pagination;
          }
      })
      .catch((err) => {
        console.log(err.response.data);
        this.error();      
      });
    },
    showProductModal: function(action){
      this.tempProduct = {};
      this.errMsg = [];
      this.productModalShow = !this.productModalShow;
      this.isNew = action;
    },
    hideProductModal: function(){
      this.tempProduct = {};
      this.errMsg = [];
      this.productModalShow = false;
    },
    addProduct: function(){
			axios.post(`${this.apiUrl}/api/${this.apiPath}/admin/product`, {
				data: {
					title: this.tempProduct.title, 
					category: this.tempProduct.category,
					origin_price: this.tempProduct.origin_price,
					price: this.tempProduct.price,
					unit: this.tempProduct.unit,
					description: this.tempProduct.description,
					content: this.tempProduct.content,
					imageUrl: this.tempProduct.imageUrl,
				}
			})
			.then((res) => {
        if(res.data.success){        
          this.hideProductModal();
          this.getProductAdmin();  
        }else{
          res.data.message.forEach((msg)=>{
            this.errMsg.push(msg)
          })
        }
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    getEditProduct: function(action, item){
      this.showProductModal(action);
      this.products.forEach((product) => {
        if(product.id === item.id){
          Object.assign(this.tempProduct, product);
        }
      })
    },
    editProduct: function(){
      console.log(this.tempProduct.id)
      axios.put(`${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`, {
				data: {
					title: this.tempProduct.title, 
					category: this.tempProduct.category,
					origin_price: this.tempProduct.origin_price,
					price: this.tempProduct.price,
					unit: this.tempProduct.unit,
					description: this.tempProduct.description,
					content: this.tempProduct.content,
					imageUrl: this.tempProduct.imageUrl,
				}
			})
			.then((res) => {
        if(res.data.success){
          console.log(res);
          this.hideProductModal();  
          this.getProductAdmin();
        }else{
          res.data.message.forEach((msg)=>{
            this.errMsg.push(msg)
          })
        }
			})
			.catch((err) => {
				console.log(JSON.stringify(err))
			});
    },
    deleteProduct: function(productid){
			console.log("delete product: ", productid)
			axios.delete(`${this.apiUrl}/api/${this.apiPath}/admin/product/${productid}`)
			.then((res) => {
        console.log(res.data);
        if(res.data.success){
          this.getProductAdmin();
        }else{
          console.log(res.data);
        }
			})
			.catch((err) => {
				console.log(err.response.data);
			});
    },
    // adminLogout: function (){
		// 	axios.post(`${this.apiUrl}/logout/`)
		// 	.then((res) => {
		// 		console.log(res.data)
		// 		if(res.data.success){
    //       document.cookie = `OnlineBusTour = ; expires = ${new Date()}`;
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		console.log(err.response.data);
		// 	});
    // },
  },
  mounted(){
    let token = document.cookie.replace(/(?:(?:^|.*;\s*)OnlineBusTour\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    axios.defaults.headers.common['Authorization'] = token;

    this.checkLogin();
  }
})

admin.component('',{
  
})

admin.component('productModal',{
  props:['tempProduct', 'productModalShow', 'isNew', 'errMsg'],
  template:'#productModal',
  data(){
    return {
      //
    }
  }
})

admin.component('pagination',{
  props:['page'],
  template:`
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{'disabled' : !page.has_pre}">
        <a class="page-link" href="#" aria-label="Previous" @click="$emit('previous-page', page.current_page-1)">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item" :class="{'active' : item === page.current_page}" v-for="item in page.total_pages" :key="item">
        <a class="page-link" href="#" @click="$emit('get-product-page', item)">{{item}}</a></li>
      <li class="page-item" :class="{'disabled' : !page.has_next}">
        <a class="page-link" href="#" aria-label="Next" @click="$emit('next-page', page.current_page+1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
`,
})




admin.mount('#admin')