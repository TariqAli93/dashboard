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
          <div class="custom-table w-100">
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
                    <tr v-for="(data, index) of users" :key="data.name">
                        <td scope="row">{{ data.id }}</td>
                        <td scope="row">{{ data.username }}</td>
                        <td scope="row">{{ data.userInfo.mobileNo }}</td>
                        <td scope="row">{{ data.userInfo.address1 }}</td>
                        <td scope="row">
                            <span v-for="(role) in data.userRole" :key="role.roleId">
                                <b v-if="role.roleId == 1">Admin </b>
                                <b v-if="role.roleId == 2">Provider </b>
                                <b v-if="role.roleId == 4">SuperAdmin </b>
                                <b v-if="role.roleId == 3">User </b>
                            </span>
                        </td>
                        <td scope="row">{{ data.validFrom }}</td>
                        <td scope="row">{{ data.validTo }}</td>
                        <td scope="row">
                            <button class="btn btn-warning ml-2" @click="modal1 = true; updateId = data.id"><Icon type="ios-create-outline" /></button>
                            <button class="btn btn-danger" @click="remove(data.id, index)"><Icon type="ios-trash-outline" /></button>
                        </td>
                    </tr>  
                </tbody>
            </table>
          </div>
      </div>

        <Modal v-model="modal1" footer-hide width="600">
            <div slot="header">
                <h4>اضافة مستخدم</h4>
            </div>

            <form method="post" class="add-user" @submit.prevent="update(updateId)">
                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="username">اسم المستخدم</label>
                            <input type="text" name="username" id="username" class="form-control" v-model="username" placeholder="اسم المستخدم">
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label for="password">كلمة المرور</label>
                            <input type="password" name="password" id="password" class="form-control" v-model="password" placeholder="كلمة المرور">
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

                <button class="btn btn-primary btn-block">انشاء الحساب</button>
            </form>
        </Modal>
  </div>
</template>

<script>
import baseUrl from '../apis';
export default {
    data() {
        return {
            users: '',
            modal1: false,
            updateId: '',
            search: '',
            usersFilterd: '',
            username: '',
            password: '',
            mobileNumber: '',
            address: '',
            validTo: '',
            roleId: '',
            registerUrl: '',
            updateName: '',
            updatePass: '',
            updateMobile: '',
            updateAddress: '',
            updateValidTo: '',
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
                this.usersFilterd = result.data;
                console.log(this.users);
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
        update(id) {
            let object = {
                Id: id,
                Username: this.username,
                Password: this.password,
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
                console.log(result);
            }).catch((err) => {
                console.error(err);
            });
            this.$Message.success('UpDate Item With Id: ' + id);
        },

        remove(id, index) {
            let self = this;
            let token = localStorage.getItem('token');
            this.$Loading.start();
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