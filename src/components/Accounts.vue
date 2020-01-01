<template>
  <div id="accounts">
    <div class="no-selected">
      <p>قم بأختيار نوع الحساب</p>
      <ul class="account-type-list">
        <li v-if="roles == 'SuperAdmin'"><a @click="modal3 = true">سوبر ادمن</a></li>
        <li v-if="roles == 'SuperAdmin' || roles == 'AdminAdd'"><a @click="modal2 = true">ادمن</a></li>
        <li v-if="roles == 'Admin' || roles == 'SuperAdmin'"><a @click="modal1 = true">بروفايدر</a></li>
      </ul>
      <Spin fix v-show="spinShow" size="large">
          <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
          <div>جاري تحميل البيانات</div>
      </Spin>

      <Modal v-model="modal1" footer-hide width="900" :closable="closeableModal" :mask-closable="closeableModal">
          <div class="modal-content">
            <div>
              <form class="provider-form" method="post" @submit.prevent="createProvider">
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="username1">اسم المستخدم</label>
                      <input type="text" required class="form-control" id="username1" v-model="username" name="username">
                    </div>
                  </div>
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="password-1">كلمة المرور</label>
                      <input type="text" required class="form-control" v-model="password" id="password-1" name="password">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="jobCategory">المهنة</label>
                      <select name="jobCategory" required id="jobCategory" v-model="jobCategory" class="form-control">
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="mobileNo-2">رقم الهاتف</label>
                      <input type="tel" required pattern="[+ 0-9]{14}" class="form-control" v-model="mobileNo" id="mobileNo-2" name="mobileNo">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="validTo-2">تاريخ الانتهاء</label>
                      <input type="date" required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))" class="form-control" v-model="validTo" id="validTo-2" name="validTo">
                    </div>
                  </div>

                  <div class="col">
                    <div class="form-group">
                      <label for="fileToUp-2">مستمسكات الزبون</label>
                      <input type="file" required multiple class="form-control" id="fileToUp-2" name="fileToUp" @change="getFileFromInput">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="address1-1">العنوان الحالي</label>
                      <select name="address1" required id="address1-1" v-model="address" class="form-control">
                        <option v-for="gover in governorate" :key="gover.id" :value="gover.name">{{ gover.name }}</option>
                      </select>
                    </div>
                  </div>

                  <div class="col">
                    <div class="form-group">
                      <label for="district">القضاء / الناحية</label>
                      <input type="text" required class="form-control" id="district" name="district" v-model="district">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-6">
                    <div class="form-group">
                      <label for="closesPoint">اقرب نقطة دالة</label>
                      <input type="text" required class="form-control" id="closesPoint" name="closesPoint" v-model="closesPoint">
                    </div>
                  </div>

                  <div class="col-6">
                    <div class="row">
                      <div class="col-4">
                        <div class="form-group">
                          <label for="zqaq">زقاق</label>
                          <input type="text" required class="form-control" id="zqaq" name="zqaq" v-model="zqaq">
                        </div>
                      </div>

                      <div class="col-4">
                        <div class="form-group">
                          <label for="mahla">محلة</label>
                          <input type="text" required class="form-control" id="mahla" name="mahla" v-model="mahala">
                        </div>
                      </div>

                      <div class="col-4">
                        <div class="form-group">
                          <label for="aldar">رقم الدار</label>
                          <input type="text" required class="form-control" id="aldar" name="aldar" v-model="dar">
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col">
                    
                  </div>
                </div>

                <button class="btn btn-primary btn-block">تسجيل</button>
              </form>
            </div>
          </div>
      </Modal>

      <Modal v-model="modal2" footer-hide width="900" :closable="closeableModal" :mask-closable="closeableModal">
          <div class="modal-content">
            <div>
              <form class="provider-form" method="post" @submit.prevent="createAdmin">
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="username-3">اسم المستخدم</label>
                      <input type="text" required class="form-control" id="username-3" v-model="username" name="username">
                    </div>
                  </div>
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="password-3">كلمة المرور</label>
                      <input type="text" required class="form-control" v-model="password" id="password-3" name="password">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="fileToUp-1">مستمسكات الزبون</label>
                      <input type="file" required multiple class="form-control" id="fileToUp-1" name="fileToUp" @change="getFileFromInput">
                    </div>
                  </div>
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="mobileNo-1">رقم الهاتف</label>
                      <input type="tel" required pattern="[+ 0-9]{14}" class="form-control" v-model="mobileNo" id="mobileNo-1" name="mobileNo">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="address1-3">العنوان الحالي</label>
                      <select name="address1" required id="address1-3" v-model="address" class="form-control">
                        <option v-for="gover in governorate" :key="gover.id" :value="gover.name">{{ gover.name }}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="validTo-1">تاريخ الانتهاء</label>
                      <input type="date" required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))" class="form-control" v-model="validTo" id="validTo-1" name="validTo">
                    </div>
                  </div>
                </div>

                <button class="btn btn-primary btn-block">تسجيل</button>
              </form>
            </div>
          </div>
      </Modal>

      <Modal v-model="modal3" footer-hide width="900" :closable="closeableModal" :mask-closable="closeableModal">
          <div class="modal-content">
            <div>
              <form class="provider-form" method="post" @submit.prevent="craeteSuperAdmin">
                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="username-1">اسم المستخدم</label>
                      <input type="text" required class="form-control" id="username-1" v-model="username" name="username">
                    </div>
                  </div>
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="password-2">كلمة المرور</label>
                      <input type="text" required class="form-control" v-model="password" id="password-2" name="password">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <!-- <div class="col">
                    <div class="form-group">
                      <label for="fileToUp">مستمسكات الزبون</label>
                      <input type="file" required multiple class="form-control" id="fileToUp" name="fileToUp" @change="getFileFromInput">
                    </div>
                  </div> -->
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="mobileNo-3">رقم الهاتف</label>
                      <input type="tel" required pattern="[+ 0-9]{14}" class="form-control" v-model="mobileNo" id="mobileNo-3" name="mobileNo">
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <div class="form-group">
                      <label for="address1-2">العنوان الحالي</label>
                      <select name="address1" id="address1-2" v-model="address" required class="form-control">
                        <option v-for="gover in governorate" :key="gover.id" :value="gover.name">{{ gover.name }}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div class="col">
                    <div class="form-group">
                      <label for="validTo-3">تاريخ الانتهاء</label>
                      <input type="date" required pattern="(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])/(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])/(?:30))|(?:(?:0[13578]|1[02])-31))" class="form-control" v-model="validTo" id="validTo-3" name="validTo">
                    </div>
                  </div>
                </div>

                <button class="btn btn-primary btn-block">تسجيل</button>
              </form>
            </div>
          </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import baseUrl from '../apis'
// import ImageUrl from '../imgPath'
export default {
    data() {
        return {
          modal1: false,
          modal2: false,
          modal3: false,
          spinShow: false,
          closeableModal: true,
          files: '',
          filePath: '',
          username: '',
          password: '',
          jobCategory: '',
          mobileNo: '',
          address: '',
          validTo: '',
          categories: '',
          district: '',
          closesPoint: '',
          zqaq: '',
          mahala: '',
          dar: '',
          okDelete: false,
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
          roles: '',
        }
    },
    mounted() {
      this.getCategories();
      this.roles = localStorage.getItem('role');
    },

    methods: {
      getCategories() {
        let self = this;
        let token = localStorage.getItem('token');
        self.axios.get(`${baseUrl}/category/getCategories`,
        {
            headers: {
              Authorization: "bearer " + token
            }
        }).then((result) => {
          this.categories = result.data;
        }).catch((err) => {
          this.$Message.error('حدث خطاء في جلب التصنيفات');
        });
      },
      
      getFileFromInput(file) {
        this.files = file.target.files;
        var data = new FormData();
        let size = [];
        const reducer = (accumulator, currentValue) => accumulator + currentValue;
        for(let i =0; i< this.files.length; i++) {
          size.push(this.files[i].size);
          if(size.reduce(reducer) < 1060000) {
            data.append('file', this.files[i]);
          }
        }

        if(size.reduce(reducer) > 1060000) {
          this.$Message.error('حجم الملف كبير جدا');
          return false;
        } else {
          this.getFileToUpLoad(data);
          return true;
        }
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
        }).catch((err) => {
          this.$Message.error('حدث خطاء في اضافة البيانات');
          this.spinShow = false;
        });
      },
      createProvider() {
        var token = localStorage.getItem('token');
        let object = {
          username: this.username,
          password: this.password,
          validFrom: this.getDateNow(),
          validTo: this.validTo,
          userDocumentsImages: this.filePath,
          categoryId: this.jobCategory,
          mobileNo: this.mobileNo,
          address1: this.address,
          address2: this.district
        };

        let areas = {
          district: this.district,
          zqaq: this.zqaq,
          dar: this.dar,
          mahala: this.mahala,
          closesPoint: this.closesPoint
        };

        this.axios.post(`${baseUrl}/account/registerProviderWeb`, 
        object, 
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token
            }
        }).then((result) => {
          let object2 = {
            userDocumentsImages: this.filePath,
            mobileNumber: this.mobileNo,
          };
          this.spinShow = true;
          this.axios.put(`${baseUrl}/account/addUserDocuments`,
          object2,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token
            }
          })
          .then((res) => {
            this.spinShow = false;
            this.modal1 = false;
          }).catch((reserr) => {
            this.spinShow = false;
          });
          this.$router.push({name: 'print', params: {object, areas}});
          this.$Message.success('تم الاضافة بنجاح');
        }).catch((err) => {
          this.spinShow = false;
          this.$Message.error("حدث خطاء في اضافة البيانات");
        });
      },

      createAdmin() {
        var token = localStorage.getItem('token');
        let object = {
          username: this.username,
          password: this.password,
          validFrom: this.getDateNow(),
          validTo: this.validTo,
          userDocumentsImages: this.filePath,
          mobileNo: this.mobileNo,
          address1: this.address,
          userTypeId: 1
        }
        this.spinShow = true;
        this.axios.post(`${baseUrl}/account/registerAdmin`, 
        object,
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token
            }
        }).then((result) => {
          this.spinShow = false;
          let object2 = {
            userDocumentsImages: this.filePath,
            mobileNumber: this.mobileNo,
          };
          this.spinShow = true;
          this.axios.put(`${baseUrl}/account/addUserDocuments`,
          object2,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token
            }
          })
          .then((res) => {
            this.spinShow = false;
          }).catch((reserr) => {
            this.spinShow = false;
          });
          this.$Message.success('تم الاضافة بنجاح');
        }).catch((err) => {
          this.$Message.error("حدث خطاء في اضافة البيانات");
          this.spinShow = false;
          console.error(JSON.stringify(err));
        });
      },

      craeteSuperAdmin() {
        var token = localStorage.getItem('token');
        let object = {
          username: this.username,
          password: this.password,
          validFrom: this.getDateNow(),
          validTo: this.validTo,
          userDocumentsImages: this.filePath,
          mobileNo: this.mobileNo,
          address1: this.address,
          userTypeId: 4
        }
        this.spinShow = true;
        this.axios.post(`${baseUrl}/account/registerAdmin`, 
        object, 
        {
            headers: {
              "Content-Type": "application/json",
              Authorization: "bearer " + token
            }
        }).then((result) => {
          this.spinShow = false;
          this.$Message.success('تم الاضافة بنجاح');
        }).catch((err) => {
          this.spinShow = false;
          this.$Message.error("حدث خطاء في اضافة البيانات");
        });
      },
      getDateNow() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
          dd = '0' + dd;
        } 
        if (mm < 10) {
          mm = '0' + mm;
        } 
        return yyyy + '-' + mm + '-' + dd;
        
      }
    }
}
</script>

<style lang="scss" scoped>
  .modal-content {
      padding: 30px;
  }

  .modal-content-list {
    list-style: square;
    padding: 15px;
    font-size: 13px;

    li {
      padding: 15px 0px;

      &:not(:last-child) {
        padding-top: 15px;
        border-bottom: 1px solid rgba(black , .10);
      }

      &:last-child {
        padding-top: 15px;
      }
    }
  }


  #accounts {
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

      .account-type-list {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0 auto;
        flex-direction: row;
        margin-top: 10px;

        li {
          min-width: 120px;

          &:not(:first-child) {
            margin-right: 10px;
          }

          a {
            display: block;
            width: 100%;
            color: #b38deb;
            border: 2px solid;
            border-radius: 50px;
            padding: 10px;
            text-align: center;
            font-weight: bolder;
            text-transform: uppercase;

            &:hover,
            &:focus,
            &:active {
              background: #b38deb;
              color: white;
              border-color: #b38deb;
            }
          }
        }
      }
    }
  }
</style>