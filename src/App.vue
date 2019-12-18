<template>
  <div id="main-view">
      <div id="main-page" v-if="isLoggedIn == true">
          <div id="sidebar">
            <div class="logo-wrapper">
                <img src="./assets/logo.png" />
            </div>
            <ul id="sidebar-list">
                <router-link to="/home" tag="li" exact-active-class="active" exact>
                    <a>
                        <Icon type="ios-home-outline" />
                        <span>الرئيسية</span>
                    </a>
                </router-link>

                <router-link to="/accounts" tag="li" exact-active-class="active">
                    <a>
                        <Icon type="ios-person-add-outline" />
                        <span>اضافة حساب</span>
                    </a>
                </router-link>

                <!-- <router-link to="/services" tag="li" exact-active-class="active">
                    <a>
                        <Icon type="ios-briefcase-outline" />
                        <span>الخدمات</span>
                    </a>
                </router-link> -->

                <router-link to="/categories" v-if="getRoles() == 'SuperAdmin'" tag="li" exact-active-class="active">
                    <a>
                        <Icon type="ios-apps-outline" />
                        <span>التصنيفات</span>
                    </a>
                </router-link>

                <router-link to="/users" v-if="getRoles() == 'SuperAdmin'" tag="li" exact-active-class="active">
                    <a>
                        <Icon type="ios-people-outline" />
                        <span>المستخدمين</span>
                    </a>
                </router-link>

                <router-link to="/supports" v-if="getRoles() == 'SuperAdmin'" tag="li" exact-active-class="active">
                    <a>
                        <Icon type="ios-help-buoy-outline" />
                        <span>الدعم الفني</span>
                    </a>
                </router-link>
            </ul>

            <div class="logout-wrapper">
                <Button type="warning" @click="logout">تسجيل الخروج</Button>
            </div>
        </div>
        <div id="main-content">
            <router-view />
        </div>
      </div>

      <div id="login-page" v-if="isLoggedIn == false">
          <form class="login-form">
              <div class="logo">
                  <img src="./assets/logo.png" />
              </div>
              <div class="form-control">
                  <Input prefix="ios-contact" type="text" size="large" v-model="mobileNumber" id="mobileNumber" name="mobileNumber" class="form-control-input" />
              </div>

              <div class="form-control">
                  <Input prefix="ios-lock" type="password" size="large" v-model="password" id="password" name="password" class="form-control-input" password />
              </div>

              <Button type="success" size="large" icon="ios-arrow-round-forward" long @click="login">تسجيل الدخول</Button>
          </form>
      </div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            isLoggedIn: false,
            mobileNumber: '',
            password: '',
            token: '',
        }
    },
    beforeCreate() {
        this.$Loading.start();
    },
    mounted() {
        if (localStorage.getItem('token') !== null) {
            this.$Message.success('تم تسجيل الدخول مسبقا');
            this.isLoggedIn = true;
            this.$router.push({name: 'home'});
            console.log(this.getRoles());
        }
        this.$Loading.finish();
    },
    computed: {

    },
    methods: {
        parseJwt(token) {
            var base64Url = token.split(".")[1];
            var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            var jsonPayload = decodeURIComponent(
                atob(base64)
                .split("")
                .map(function(c) {
                    return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );
            return JSON.parse(jsonPayload);
        },
        login() {
            if(this.mobileNumber && this.password) {
                this.$Loading.start();
                const options = {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*"
                    }
                };

                let loginInfo = {
                    mobileNumber: this.mobileNumber,
                    password: this.password
                };
                this.axios.post("http://23.238.35.18:5300/api/account/loginAdmin", loginInfo ,options)
                .then((result) => {
                    // let mm = '+9647717714473';
                    this.token = result.data.jwt;
                    localStorage.setItem('token', this.token);
                    this.$Loading.finish();

                    setTimeout(() => {
                        this.$Message.success('تم تسجيل الدخول بنجاح');
                    },1500);

                    setTimeout(() => {
                        if(this.getRoles() == 'SuperAdmin') {
                            localStorage.setItem('role', 'SuperAdmin');
                        } else if(this.getRoles() == 'Admin') {
                            localStorage.setItem('role', 'Admin');
                        } else if(this.getRoles() == 'Provider') {
                            localStorage.setItem('role', 'Provider');
                        } else {
                            localStorage.setItem('role', 'User');
                        }
                        this.isLoggedIn = true;
                    }, 2000);
                    setTimeout(() => {
                        this.$router.push({name: 'home'});
                    }, 3000);
                }).catch((err) => {
                    console.log(err);
                    this.$Loading.error();
                    
                    setTimeout(() => {
                        this.$Message.error('تحقق من صحة المعلومات');
                    },1500);
                });
            } else {
                this.$Notice.error({
                    title: 'Mobile Error',
                    desc: 'Mobile Number Empty',
                    duration: 120
                });
                this.$Notice.error({
                    title: 'Password Error',
                    desc: 'Password Empty',
                    duration: 120
                });
            }
        },
        logout() {
            this.$Loading.start();
            setTimeout(() => {
                this.$router.push('/');
                this.isLoggedIn = false;
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                this.$Loading.finish();
                this.$Message.success('تم تسجيل الخروج');
            }, 1500);
        },

        getRoles() {
            let token = localStorage.getItem('token');
            var parsedtoken = this.parseJwt(token);
            var rols = parsedtoken.role;
            
            if(token !== null) {
                if(rols.includes('SuperAdmin')) {
                    return 'SuperAdmin';
                } else if(rols.includes('Admin')) {
                    return 'Admin';
                } else if (rols.includes('Provider')) {
                    return 'Provider';
                } else {
                    return 'User';
                }
            }
            return false;
        }
    },
    destroyed() {

    }
}
</script>

<style lang="scss" scoped>
@media print  {
    #sidebar {
        display: none !important;
    }
    #main-page {
        padding: 10px !important;
    }
    
    div#main-content {
        box-shadow: none !important;
    }

    .printBtn {
        display: none !important;
    }
}
* {
    padding: 0;
    margin: 0 auto;
    box-sizing: border-box;
}

.ivu-notice-notice {
    direction: ltr;
}

div#main-view {
    display: block
}

#main-page {
    display: flex;
    flex-direction: row;
    background: whitesmoke;
    min-height: 100vh;
    padding: 25px 0px 25px 25px;
    background: whitesmoke;
}

#login-page {
    background: whitesmoke;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .login-form {
        background: #ffffff;
        width: 400px;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px 0 rgba(black , .10);


        .ivu-input {
            padding-left: 32px !important;;
            padding-top: 19px !important;;
            padding-bottom: 19px !important;
            background: #0000001a
        }
        

        .logo {
            display: block;
            text-align: center;
            margin-bottom: 10px;

            img {
                display: block;
                width: 120px;
                border-radius: 500px;
                box-shadow: 0 2px 10px 0 #0000003b;
            }
        }

        .form-control {
            &:not(:last-child) {
                margin-bottom: 10px;
            }

            .ivu-input-prefix i, .ivu-input-suffix i {
                font-size: 16px;
                line-height: 40px;
                color: #808695;
            }
        }
    }
}

div#main-content {
    background: #ffffff;
    -webkit-box-flex: 9;
    -ms-flex: 9;
    flex: 9;
    padding: 20px;
    border: 0px solid #0000001a;
    box-shadow: 0px 0px 20px 0 rgba(0, 0, 0, 0.08);
    position: relative;
    border-radius: 25px;

}

div#sidebar {
    flex: 1.5;
    margin-left: 20px;
    background: transparent;
    position: relative;
}

.logout-wrapper {
    text-align: center;
    border-top: 1px solid rgba(black, .10);
    padding: 10px 0px;
}

.logo-wrapper {
    display: block;

    img {
        display: block;
        width: 120px;
        border-radius: 500px;
        box-shadow: 0 2px 10px 0 #0000003b;
    }
}

ul#sidebar-list {
    margin: 0 auto;
    padding: 10px;
    box-sizing: border-box;
    list-style: none;
    display: block;
}

ul#sidebar-list li {
    display: block;
}

ul#sidebar-list li > a {
    position: relative;
    display: flex;
    color: black;
    font-weight: bolder;
    padding: 20px;
    font-size: 16px;
    align-items: center;
    text-align: right;
    border-radius: 10px;
    transition: all ease-in-out 350ms;

    i {
        margin-left: 10px;
        display: contents;
        font-size: 20px;

        @media (max-width: 1010px) {
            margin: 0 auto;
            display: block;
            text-align: center;
        }
    }

    span {
        margin: 0;
        margin-right: 10px;

        @media (max-width: 1010px) {
            display: none;
        }
    }

    &:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: 50%;
        left: -20px;
        border: 10px solid transparent;
        transform: translateY(-50%);
        transition: all ease-in-out 350ms;
    }
}

ul#sidebar-list li.active > a {
    background: white;
    box-shadow: 0px 0px 20px 0 rgba(0, 0, 0, 0.08);
    color: black;
    position: relative;

    &:before {
        content: "";
        position: absolute;
        width: 0;
        height: 0;
        top: 50%;
        left: -20px;
        border: 10px solid transparent;
        border-right-color: white;
        transform: translateY(-50%);
    }
}
</style>