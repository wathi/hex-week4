const login = Vue.createApp({
  data(){
    return {
      apiUrl:'https://vue3-course-api.hexschool.io',
      apiPath:'bustour',
      logginUser:{
        username: "",
        password: ""
      },
      errMsg:""
    }
  },
  methods:{
    authLogin: function(){
      console.log("authloggin", this.logginUser)
      axios.post(`${this.apiUrl}/admin/signin`, this.logginUser)
      .then((res) => {
        if(res.data.success){
          document.cookie = `OnlineBusTour=${res.data.token}; expires=${new Date(res.data.expired)}`;
          this.errMsg = "";
          window.location.href="admin.html";
          console.log("login success")
        } 
        if(!res.data.success) {
          this.errMsg = res.data.message;
          console.log(res.data.message)
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      });
    },

  },
})

login.mount('#login')