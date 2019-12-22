<template>
  <div id="users">
      <div v-if="users.length < 1" class="no-selected">
          <p>لا يوجد اي مستخدمين حاليا</p>
      </div>

      <div v-else class="h-100 d-flex flex-column align-items-center">
          <div class="row w-100 mt-5 mb-5">
              <div class="col">
                <div class="form-group">
                    <input type="search" v-model="search" @input="filterMethod" class="form-control d-block w-100 form-control-lg" placeholder="ابحث في المستخدمين">
                </div>
              </div>
          </div>
          <div class="custom-table w-100 ">
              <div class="table-responsive-xl">
                <table class="table table-borderless ">
                    <thead class="thead-dark">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">اسم المستخدم</th>
                            <th scope="col">رقم المستخدم</th>
                            <th scope="col">عنوان المستخدم</th>
                            <th scope="col">صلاحيات</th>
                            <th scope="col">تاريخ الانشاء</th>
                            <th scope="col">تاريخ الانتهاء</th>
                            <th scope="col">تعديل / حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="userRole" v-for="(data, index) of users" :key="data.name">
                            <td scope="row">{{ data.id }}</td>
                            <td scope="row">{{ data.username }}</td>
                            <td scope="row">{{ data.userInfo.mobileNo }}</td>
                            <td scope="row">{{ data.userInfo.address1 }}</td>
                            <td scope="row">
                                <span v-for="role in data.userRole" :key="role.roleId">
                                    <b v-if="role.roleId == 1">Admin </b>
                                    <b v-else-if="role.roleId == 2">Provider </b>
                                    <b v-else-if="role.roleId == 4">SuperAdmin </b>
                                    <b v-else>User </b>
                                </span>
                            </td>
                            <td scope="row">{{ formatDate(data.validFrom) }}</td>
                            <td scope="row">
                                <span v-if="isExpierd(formatDate(data.validTo))">{{ formatDate(data.validTo) }}</span>
                                <span v-else style="color: red;">الحساب منتهي</span>
                            </td>
                            <td scope="row">
                                <div class="btn-group">
                                    <button class="btn btn-success" @click="newPassModal = true; newPassId = data.id"><Icon type="ios-lock" /></button>
                                    <button class="btn btn-primary" @click="showImages(data.userInfo.userDocumentsImages)"><Icon type="ios-images-outline" /></button>
                                    <button class="btn btn-warning" @click="modal1 = true; updateId = data.id; defaultUserAccount(data.userInfo.mobileNo)"><Icon type="ios-create-outline" /></button>
                                    <button class="btn btn-danger" @click="doDeleteSuperAdmin(data.id, index);"><Icon type="ios-trash-outline" /></button>
                                </div>
                            </td>
                        </tr>  
                    </tbody>
                </table>
            </div>   
          </div>
      </div>

        <Modal v-model="modal1" footer-hide width="600">
            <div slot="header">
                <h4>تحديث مستخدم</h4>
            </div>

            <form method="post" class="add-user" @submit.prevent="update(updateId)">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="username">اسم المستخدم</label>
                            <input type="text" name="username" id="username" class="form-control" v-model="username" placeholder="اسم المستخدم">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="mobileNumber">رقم الهاتف</label>
                            <input type="text" name="mobileNumber" id="mobileNumber" class="form-control" v-model="mobileNumber" placeholder="رقم الهاتف">
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label for="address">العنوان</label>
                            <select name="address" id="address" class="form-control" v-model="address">
                                <option v-for="gover in governorate" :key="gover.id" :value="gover.name">{{ gover.name }}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="validTo">تاريخ الانتهاء</label>
                            <input type="date" name="validTo" id="validTo" class="form-control" v-model="validTo">
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary btn-block">تحديث الحساب</button>
            </form>
        </Modal>

        <Modal v-model="carouselModal" footer-hide width="800">
            <div slot="header">
                <h4>مستمسكات المستخدم</h4>
            </div>

            <div class="row">
                <div class="col" v-for="img in userImages" :key="img.carousel">
                    <div >
                        <a :href="imageUrl + img" target="_blank"><img :src="imageUrl + img" class="img-thumbnail" style="max-height: 200px"></a>
                    </div>
                </div>
            </div>
        </Modal>

        <Modal v-model="newPassModal" footer-hide width="600">
            <div slot="header">
                <h4>تغير كلمة المرور</h4>
            </div>

            <form method="post" class="add-user" @submit.prevent="changePassword(newPassId)">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="newPassword">كلمة المرور الجديدة</label>
                            <input type="password" name="newPassword" required id="newPassword" class="form-control" v-model="newPassword" placeholder="كلمة المرور الجديدة">
                        </div>
                    </div>
                </div>

                <button class="btn btn-primary btn-block">تغير كلمة المرور</button>
            </form>
        </Modal>
  </div>
</template>

<script>
import baseUrl from '../apis';
import moment from "../../node_modules/moment";
export default {
    data() {
        return {
            users: '',
            modal1: false,
            carouselModal: false,
            carousel: 0,
            updateId: '',
            search: '',
            usersFilterd: '',
            username: '',
            password: '',
            mobileNumber: '',
            address: '',
            validTo: '',
            roleId: [],
            registerUrl: '',
            userImages: '',
            imageUrl: 'http://mehtaj.srittwo.me',
            defaultUsername: '',
            defaultMobile: '',
            defaultAddress: '',
            defaultDate: '',
            newPassword: '',
            newPassModal: false,
            newPassId: '',
            governorate: [
            {
              "name":'اربيل',
              "id": 1
            },
            {
              "name":'الانبار',
              "id": 2
            },
            {
              "name":'بابل',
              "id": 3
            },
            {
              "name":'بغداد',
              "id": 4
            },
            {
              "name":'البصرة',
              "id": 5
            },
            {
              "name":'دهوك',
              "id": 6
            },
            {
              "name":'القادسية',
              "id": 7
            },
            {
              "name":'ديالى',
              "id": 8
            },
            {
              "name":'ذي قار',
              "id": 9
            },
            {
              "name":'سليمانية',
              "id": 10
            },
            {
              "name":'صلاح الدين',
              "id": 11
            },
            {
              "name":'كركوك',
              "id": 12
            },
            {
              "name":'كربلاء',
              "id": 13
            },
            {
              "name":'المثنى',
              "id": 14
            },
            {
              "name":'ميسان',
              "id": 15
            },
            {
              "name":'النجف',
              "id": 16
            },
            {
              "name":'نينوى',
              "id": 17
            },
            {
              "name":'واسط',
              "id": 18
            }
          ],
        }
    },
    mounted() {
        this.getAllUsers();
    },
    methods: {
        showImages(imgs) {
            if(imgs == "") {
                this.$Message.error("لا يوجد صور لهذا المستخدم");
            } else {
                var imgArr = imgs.split(";");
                var filtered = imgArr.filter(function (el) {
                    return el !== "";
                });
                this.carouselModal = true;
                this.userImages = filtered;
            }
            console.log(imgs);
        },

        formatDate(date) {
            return moment(date).format('D/M/YYYY');
        },

        isExpierd(date) {
            let today = moment().format("D/M/YYYY");
            if(today === date) {
                return false;
            } else {
                return true;
            }
        },
        getAllUsers() {
            var self = this;
            let token = localStorage.getItem('token');
            self.axios.get(`${baseUrl}/users/getUsers`, 
            {
                headers: {
                    Authorization: "bearer " + token
                }
            }).then((result) => {
                this.users = result.data;
                let leng = result.data.length;
                this.usersFilterd = result.data;
                console.log(result.data);
            }).catch((err) => {
                console.error(err);
            });
        },
        filterMethod(e) {
            let self = this;
            var filters = self.users.filter(data => data.username.includes(self.search));

            if(e.target.value < 1 && filters.length > 0) {
                self.users = self.usersFilterd;
            } else {
                if(filters.length > 0) {
                    self.users = filters;
                } else {
                    return false;
                }
            }
        },

        defaultUserAccount(mobile) {
            let token = localStorage.getItem('token');
            this.axios.get(`${baseUrl}/users/getUserByMobile?mobileNumber=${mobile}`,
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                this.username = result.data.username;
                this.mobileNumber = result.data.userInfo.mobileNo;
                this.address = result.data.userInfo.address1;
                this.validTo = result.data.userInfo.validTo;
                var role = result.data.userRole;
                var roleId = [];
                for(let i=0; i < role.length; i++) {
                    roleId.push(role[i].roleId);
                }
                if(roleId.includes(4)) {
                    this.$Message.error('لا يمكن تعديل هذا المستخدم');
                    this.modal1 = false;
                    return false;
                } else {
                    return true;
                }
            }).catch((err) => {
                console.error(err);
            });
        },

        doDeleteSuperAdmin(id, index) {
            let token = localStorage.getItem('token');
            let self = this;
            let roleId = [];
            self.axios.get(`${baseUrl}/users/getUserInfo?userId=${id}`,
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                for(let i =0; i< result.data.userRole.length; i++) {
                    roleId.push(result.data.userRole[i].roleId);
                }
                if(roleId.includes(4) == true) {
                    self.$Message.error("لا يمكن حذف السوبر ادمن");
                    return false;
                } else {
                    self.remove(id, index);
                    return true;
                }
            }).catch((err) => {
                console.error(err);
            });

            console.log(roleId);
        },
        update(id) {
            let object = {
                Id: id,
                Username: this.username,
                ValidTo: this.validTo,
                MobileNo: this.mobileNumber,
                Address1: this.address
            };
            let token = localStorage.getItem('token');
            let self = this;
            self.axios.put(`${baseUrl}/users/updateProvider`, 
            object,
            {
                headers: {
                    Authorization: "bearer " + token
                }
            }).then((result) => {
                this.$Message.success("تم التحديث بنجاح");
            }).catch((err) => {
                this.$Message.error("حدث خطاء في تحديث البيانات");
            });
        },

        remove(id, index) {
            let self = this;
            var confirmDelete = confirm("هل انت واثق من حذف هذا المستخدم");
            if(confirmDelete) {
                let token = localStorage.getItem('token');
                this.$Loading.start();
                console.log(this.doDeleteSuperAdmin(id) == true);
                self.axios.delete(`${baseUrl}/users/deleteUser?id=${id}`, 
                {
                    headers: {
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    console.log(result);
                    this.users.splice(index, 1);
                    this.$Message.success('تم الخذف بنجاح');
                    this.$Loading.finish();
                }).catch((err) => {
                    console.log(err);
                    this.$Message.error('خطاء في حذف المستخدم');
                    this.$Loading.error();
                });
            } else {
                this.$Message.success('لن يتم حذف المستخدم');
                return false;
            }
        },

        doDelete() {
            this.confirmDelete = true;
        },

        changePassword(id) {
            let token = localStorage.getItem('token');
            let self = this;
            let object = {
                id: id,
                password: this.newPassword
            };

            self.axios.put(`${baseUrl}/users/resetPasswordWeb`,
            object,
            {
                headers: {
                    Authorization: 'bearer ' + token
                }
            }).then((result) => {
                this.$Message.success("تم تغير كلمة المرور");
                this.newPassword = '';
            }).catch((err) => {
                this.$Message.error('حدث خطاء في تغير كلمة المرور');
            });
        }
    }
}
</script>

<style lang="scss" scoped>
#users {
    display: block;
    height: 100%;
    width: 100%;


    .no-selected {
        display: flex;
        height: 100%;
        width: 100%;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        p {
            font-size: 25px;
            color: #0000002e;
            border: 2px solid;
            padding: 20px;
            border-radius: 50px;
            min-width: calc(120px * 4 + 20px);
            text-align: center;
        }
    }
}
</style>