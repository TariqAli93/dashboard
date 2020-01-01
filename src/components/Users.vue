<template>
  <div id="users">
      <div v-if="users.length < 1" class="no-selected">
          <p>لا يوجد اي مستخدمين حاليا</p>
      </div>

      <div v-else class="h-100 d-flex flex-column align-items-center">
          <div class="row w-100 mt-5 mb-5">
              <div class="col">
                <div class="form-group">
                    <input type="search" v-model="search" v-on:keyup="filterMethod($event)" class="form-control d-block w-100 form-control-lg" placeholder="ابحث حسب رقم الهاتف">
                </div>
              </div>
          </div>
          <div class="custom-table w-100 ">
              <div class="table-responsive">
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
                            <th scope="col">الحالة</th>
                            <th scope="col">الاجرائات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr id="userRole" v-for="(data, index) of users" :key="data.name" v-bind:class="[data.isActive == 0 ? 'line-cross' : '']">
                            <td scope="row">{{ data.id }}</td>
                            <td scope="row">{{ data.username }}</td>
                            <td scope="row">{{ data.userInfo.mobileNo }}</td>
                            <td scope="row">{{ data.userInfo.address1 }}</td>
                            <td scope="row">
                                <span v-for="role in data.userRole" :key="role.id">
                                    <b v-if="role.roleId == 1">Admin </b>
                                    <b v-else-if="role.roleId == 2"> Provider </b>
                                    <b v-else-if="role.roleId == 4">SuperAdmin </b>
                                    <b v-else-if="role.roleId == 5">AddAdmin </b>
                                    <b v-else-if="role.roleId == 6">Support </b>
                                    <b v-else>User </b>
                                </span>
                            </td>
                            <td scope="row">
                                {{ formatDate(data.createdAt) }}
                            </td>
                            <td scope="row">
                                <span v-if="data.validTo.includes('0001-01-01T00')">-</span>
                                <span v-else-if="isExpierd(formatDate(data.validTo)) == false"><b class="date-number">{{ formatDate(data.validTo) }}</b></span>
                                <span v-else style="color: red;">{{ formatDate(data.validTo) }} </span>
                            </td>
                            <td scope="row">
                                <span v-if="data.isActive == 1"><b class="active-status">مفعل</b></span>
                                <span v-else><b class="active-status" style="color: red;">غير مفعل</b></span>
                            </td>
                            <td scope="row">
                                <div class="btn-group">
                                    <button class="btn btn-success" @click="newPassModal = true; newPassId = data.id"><Icon type="ios-lock" /></button>
                                    <button class="btn btn-primary" @click="showImages(data.userInfo.userDocumentsImages); forUpdateMobile = data.userInfo.mobileNo"><Icon type="ios-images-outline" /></button>
                                    <button class="btn btn-info" @click="privilegeModal = true; privilegRoles = data.userRole; privilegId = data.id; getRoleById(privilegRoles)"><Icon type="ios-list-box-outline" /></button>
                                    <button class="btn btn-warning" @click="modal1 = true; updateId = data.id; defaultUserAccount(data.userInfo.mobileNo)"><Icon type="ios-create-outline" /></button>
                                    <button class="btn btn-danger" @click="doDeleteSuperAdmin(data.id, index);"><Icon type="ios-trash-outline" /></button>
                                    <button class="btn btn-success rounded-0 btn-block" @click="activeModal = true; activeModalId = data.id; activeModalNum = data.isActive">
                                        <Icon type="ios-cog-outline" />
                                    </button>
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
                            <input type="text" disabled name="username" id="username" class="form-control" v-model="username" placeholder="اسم المستخدم">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="address">العنوان</label>
                            <select name="address" required id="address" class="form-control" v-model="address">
                                <option v-for="gover in governorate" :key="gover.id" :value="gover.name">{{ gover.name }}</option>
                            </select>
                        </div>
                    </div>

                    <div class="col">
                        <div class="form-group">
                            <label for="address2">المنطقة</label>
                            <input type="text" name="address2" id="address2" class="form-control" v-model="address2">
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col">
                        <div class="form-group">
                            <label for="mobileNumber">رقم الهاتف</label>
                            <input type="text" required name="mobileNumber" id="mobileNumber" class="form-control" v-model="mobileNumber" placeholder="رقم الهاتف">
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

        <Modal v-model="privilegeModal" footer-hide width="600" @on-cancel="isAdminCheckd = false; isProviderCheckd = false; isSuperAdminCheckd = false; isAdminAddCheckd = false; isSupportChecked = false;">
            <div slot="header">
                <h4>تغير الصلاحيات</h4>
            </div>

            <form @submit.prevent="check($event)">
                <div class="form-check form-check-inline">
                    <input class="form-check-input" :checked="isAdminCheckd" type="checkbox" id="adminCheck" :value="1">
                    <label class="form-check-label" for="adminCheck">Admin</label>
                </div>

                <div class="form-check form-check-inline">
                    <input class="form-check-input" :checked="isProviderCheckd" type="checkbox" id="providerCheck" :value="2">
                    <label class="form-check-label" for="providerCheck">Provider</label>
                </div>

                <div class="form-check form-check-inline">
                    <input class="form-check-input" :checked="isSuperAdminCheckd" type="checkbox" id="SuperAdminCheck" :value="4">
                    <label class="form-check-label" for="SuperAdminCheck">SuperAdmin</label>
                </div>

                <div class="form-check form-check-inline">
                    <input class="form-check-input" :checked="isAdminAddCheckd" type="checkbox" id="isAdminAddCheckd" :value="5">
                    <label class="form-check-label" for="isAdminAddCheckd">AdminAdd</label>
                </div>

                <div class="form-check form-check-inline">
                    <input class="form-check-input" :checked="isSupportChecked" type="checkbox" id="isSupportChecked" :value="6">
                    <label class="form-check-label" for="SuperAdminCheck">Support</label>
                </div>


                <button class="btn btn-block btn-primary">تعديل</button>
            </form>
        </Modal>

        <Modal v-model="activeModal" footer-hide width="600">
            <div slot="header">
                <h4>تفعيل / الغاء التفعيل المستخدم</h4>
            </div>

            <form @submit.prevent="activeUser(activeModalId)">
                <div class="form-group">
                    <label for="validFrom">تاريخ الانشاء</label>
                    <input type="text" disabled id="validFromChangeDate" v-model="validFromChangeDate" class="form-control" pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))">
                </div>

                <div class="form-group">
                    <label for="validTo">تاريخ الانتهاء</label>
                    <input type="date" id="validToChangeDate" v-model="validToChangeDate" class="form-control" pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))">
                </div>
                <div class="form-group">
                    <label class="d-block">تفعيل / الغاء التفعيل</label>
                    <i-switch class="activeUserSwitch" :before-change="confirmChange" :value="activeModalNum == 1 ? true : false">
                        <Icon type="md-checkmark" slot="open"></Icon>
                        <Icon type="md-close" slot="close"></Icon>
                    </i-switch>
                </div>
                <button class="btn btn-block btn-primary">تعديل</button>
            </form>
        </Modal>

        <Modal v-model="updateUserImagesModal" :closable="true" :mask-closable="true" footer-hide title="رفع المستمساكت">
            <form>
                <div class="form-group">
                    <label for="fileToUp">ارفع المستمساكت</label>
                    <input type="file" required multiple class="form-control" id="fileToUp" name="fileToUp" @change="getFileFromInput">
                </div>
            </form>
        </Modal>

        <Spin v-show="isLoading" fix>
            <div class="loader">
                <svg class="circular" viewBox="25 25 50 50">
                    <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke-miterlimit="10"></circle>
                </svg>
            </div>
        </Spin>
  </div>
</template>

<script>
import baseUrl from '../apis';
import moment from "../../node_modules/moment";
import imagesFolder from '../imagePath';
export default {
    data() {
        return {
            isLoading: false,
            users: '',
            updateUserImagesModal: false,
            forUpdateMobile: '',
            forUpdateMobile: '',
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
            address2: '',
            validTo: '',
            roleId: [],
            registerUrl: '',
            userImages: '',
            imageUrl: imagesFolder,
            defaultUsername: '',
            defaultMobile: '',
            defaultAddress: '',
            defaultDate: '',
            newPassword: '',
            newPassModal: false,
            newPassId: '',
            isActive: true,
            privilegeModal: false,
            privilegId: '',
            privilegRoles: '',
            isProviderCheckd: false,
            isAdminCheckd: false,
            isAdminAddCheckd: false,
            isSupportChecked: false,
            isSuperAdminCheckd: false,
            userCheckBox: '',
            providerCheckBox: '',
            adminCheckBox: '',
            SuperAdminCheckBox: '',
            activeModal: false,
            activeModalId: '',
            activeModalNum: 0,
            validFromChangeDate: this.today(),
            validToChangeDate: '',
            validToDis: '',
            files: '',
            filePath: '',
            showDateProvider: [],
            mobileNumbers: [],
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
        this.isLoading = true;
        this.getAllUsers();
    },
    methods: {
        activeUser(id) {
            let self = this;
            let token = localStorage.getItem('token');
            let isActive;
            let validTo = moment(this.validToChangeDate).format('YYYY-M-D');
            let validFrom = this.today();
            document.getElementById("validToChangeDate").value = "2014-02-09";
            this.validToDis = validTo;

            if($('.activeUserSwitch input').val() === "true") {
                isActive = 1;
            } else {
                isActive = 0;
            }
            let object = {
                id: id,
                isActive: isActive,
                validFrom: validFrom,
                validTo: validTo
            };

            if(object.validTo === "Invalid date") {
                self.$Message.error("لا يمكن ترك التاريخ فارغ");
                return false;
            } else if(object.validTo < this.today()) {
                self.$Message.error("التاريخ قديم لا يمكن اعتماده");
                return false;
            } else {
                self.axios.put(`${baseUrl}/users/userValidty`, 
                {
                    id: id,
                    isActive: isActive,
                    validFrom: validFrom,
                    validTo: validTo
                },
                {
                    headers: {
                        Authorization: 'bearer ' + token,
                        "Content-Type": "application/json"
                    }
                }).then((result) => {
                    self.$Message.success('تم التحديث بنجاح');
                    this.activeModal = false;
                }).catch((err) => {
                    self.$Message.error("حدث خطاء في تحديث البيانات")
                    throw new Error(JSON.stringify(err));
                });
                return true;
            }
        },
        confirmChange() {
            return new Promise((resolve) => {
                this.$Modal.confirm({
                    title: 'تحذير',
                    content: 'هل انت واثق من تعديل المستخدم',
                    onOk: () => {
                        resolve();
                    }
                });
            });
        },
        showImages(imgs) {
            if(imgs == "") {
                this.$Message.error("لا يوجد صور لهذا المستخدم");
                this.updateUserImagesModal = true;
            } else {
                var imgArr = imgs.split(";");
                var filtered = imgArr.filter(function (el) {
                    return el !== "";
                });
                this.carouselModal = true;
                this.userImages = filtered;
            }
        },
        getFileFromInput(file) {
            this.files = file.target.files;
            var data = new FormData();
            for(let i =0; i< this.files.length; i++) {
                data.append('file', this.files[i])
            }
            this.getFileToUpLoad(data);
        },
        getFileToUpLoad(file) {
            var token = localStorage.getItem('token');
            let self = this;
            this.spinShow = true;
            self.axios.post(`${baseUrl}/account/uploadDocumentsImage`, 
            file, 
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: "bearer " + token
                }
            })
            .then((result) => {
                this.filePath = result.data;
                this.$Message.success('تم رفع الملف بنجاح');
                this.spinShow = false;
                this.updateUserImagesModal = false;
                this.updateDocs(this.filePath);
            }).catch((err) => {
                this.$Message.error('حدث خطاء في اضافة البيانات');
                this.spinShow = false;
                this.updateUserImagesModal = false;
            });
        },
        updateDocs(path) {
            var token = localStorage.getItem('token');
            let self = this;
            self.axios.put(`${baseUrl}/account/addUserDocuments`,
            {
                mobileNumber: this.forUpdateMobile,
                userDocumentsImages: path
            },
            {
                headers: {
                    Authorization: 'bearer ' + token,
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((result) => {
                this.spinShow = false;
                this.fmodal = false;
            }).catch((err) => {
                this.spinShow = false;
                this.fmodal = false;
            });
        },
        formatDate(date) {
            return moment(date).format('YYYY-M-D');
        },
        today() {
            let day = new Date();
            return moment(day).format('YYYY-M-D');
        },
        isExpierd(date) {
            let day = new Date();
            let today = moment(day).format("YYYY-M-D");
            if(today >= date) {
                return true;
            } else {
                return false;
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
                this.users = result.data.reverse();
                let leng = result.data.length;
                this.usersFilterd = result.data;
                this.isLoading = false;
            }).catch((err) => {
                console.error(err);
            });
        },
        filterMethod(e) {
            let self = this;
            var filters = self.users.filter(data => data.userInfo.mobileNo.includes(self.search));

            if(e.target.value < 3 && filters.length > 0) {
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
                this.address2 = result.data.userInfo.address2;
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
                }
            }).catch((err) => {
                console.error(err);
            });
        },
        update(id) {
            let object = {
                id: id,
                mobileNo: this.mobileNumber,
                address1: this.address,
                address2: this.address2
            };
            let uid = id;
            let token = localStorage.getItem('token');
            let self = this;

            self.axios.put(`${baseUrl}/users/updateUserInfo`, 
            {
                id: uid,
                mobileNo: this.mobileNumber,
                address1: this.address,
                address2: this.address2
            },
            {
                headers: {
                    Authorization: "bearer " + token
                }
            }).then((result) => {
                this.$Message.success("تم التحديث بنجاح");
                this.modal1 = false;
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
                self.axios.delete(`${baseUrl}/users/deleteUser?id=${id}`, 
                {
                    headers: {
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    this.users.splice(index, 1);
                    this.$Message.success('تم الخذف بنجاح');
                    this.$Loading.finish();
                }).catch((err) => {
                    console.error(err);
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
                this.newPassModal = false;
            }).catch((err) => {
                this.$Message.error('حدث خطاء في تغير كلمة المرور');
            });
        },
        getRoleById(role) {
            let rows = [];
            for(let row of role) {
                rows.push(row.roleId)
            }
            if(rows.includes(1)) {
                this.isAdminCheckd = true;
            }if(rows.includes(2)) {
                this.isProviderCheckd = true;
            }if(rows.includes(5)) {
                this.isAdminAddCheckd = true;
            }if(rows.includes(6)) {
                this.isSupportChecked = true;
            }if(rows.includes(4)) {
                this.isSuperAdminCheckd = true;
            }
        },
        check(e) {
            let checkboxs = $('.form-check input:checked[type="checkbox"]');
            let id = this.privilegId;
            let vals = {
                id: id,
                isPrvdRole: 0,
                isAdmnRole: 0,
                isSupAdmnRole: 0,
                isAdminAdd: 0,
                isReportSupport: 0
            };
            let token = localStorage.getItem('token');
            let self = this;
            $.each(checkboxs, function (indexInArray, valueOfElement) { 
                 if($(valueOfElement).val() == 1) {
                     vals.isAdmnRole = 1;
                 } else if($(valueOfElement).val() == 2) {
                     vals.isPrvdRole = 1;
                 } else if($(valueOfElement).val() == 5) {
                     vals.isAdminAdd = 1;
                 } else if($(valueOfElement).val() == 6) {
                     vals.isReportSupport = 1;
                 } else if($(valueOfElement).val() == 4) {
                     vals.isSupAdmnRole = 1;
                 } else {
                     return false;
                 }
            });
            self.axios.put(`${baseUrl}/users/privilege`, vals, {headers:{Authorization: 'bearer ' + token }})
            .then((result) => {
                this.$Message.success("تم تعديل الصلاحيات بنجاح");
            }).catch((err) => {
                console.error(JSON.stringify(err));
                this.$Message.error('حدث خطاء في تعديل الصلاحيات');
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
            color: #b38deb;
            border: 2px solid;
            padding: 20px;
            border-radius: 50px;
            min-width: calc(120px * 4 + 20px);
            text-align: center;
        }
    }
}

.demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .demo-spin-col{
        height: 100px;
        position: relative;
        border: 1px solid #eee;
    }
</style>