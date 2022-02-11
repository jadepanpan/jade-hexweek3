import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.30/vue.esm-browser.min.js';

const site ='https://vue3-course-api.hexschool.io/v2/';
const apiPath ='jade';
let productModal = {}
let delProductModal={}

const app = createApp({
  data() {
    return {
      products:[],
      tempProduct: {
        imagesUrl:[]
      },
      isNew: false
    }
  },
  methods: {
    checkLogin(){
      // 從cookie裡面取得token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    // 下次發送axios時，會自動把token夾帶到headers裡面
    axios.defaults.headers.common['Authorization'] = token;
    const url =`${site}api/user/check`;
    axios.post(url)
    .then(()=>{
      this.getProducts();
    })
    },
    getProducts(){
      const url = `${site}api/${apiPath}/admin/products/all`;
      axios.get(url)
       .then(res =>{
         this.products =res.data.products;
         console.log(res)

       });
    },
    openModal(status,product){
      if(status ==='isNew') {
        this.tempProduct = {
          imagesUrl: []
        }
        this.isNew=true ;
        productModal.show();        
      } else if (status==='edit'){
          this.tempProduct = {...product};
          this.isNew = false;
          productModal.show();
      } else if (status === 'delete'){
        delProductModal.show();
        this.tempProduct = {...product};
      }
    },
    upDatedProduct(){
      let url = `${site}api/${apiPath}/admin/product`;
      let method ='post';
      if (!this.isNew){
        url = `${site}api/${apiPath}/admin/product/${this.tempProduct.id}`;
        method ='put';
      }
      axios[method](url,{ data: this.tempProduct})
       .then(res =>{
         console.log(res)
         this.getProducts();
         productModal.hide();

       });
    },
    delProduct(){
      let url = `${site}api/${apiPath}/admin/product/${this.tempProduct.id}`;

      axios.delete(url)
       .then(res =>{
         console.log(res)
         this.getProducts();
         delProductModal.hide();

       });
      
    }
  },
  mounted(){
    this.checkLogin();
    productModal = new bootstrap.Modal(document.getElementById('productModal'));
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'));
    
  }
});

app.mount('#app')