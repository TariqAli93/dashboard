<template>
  <div id="services">
      <div class="no-selected" v-if="services.length < 1">
          <p>لا يوجد اي خدمات حاليا</p>
          <Button type="dashed" @click="modal1 = true" style="margin-top: 10px;">قم باضافة خدمة</Button>
      </div>

      <div v-else class="h-100 d-flex flex-column align-items-center">
          <div class="row w-100 mt-5 mb-5">
              <div class="col-lg-8 col-sm-12">
                <div class="form-group">
                    <input type="search" v-model="search" @input="filterMethod" class="form-control d-block w-100 form-control-lg" placeholder="ابحث في الخدمات">
                </div>
              </div>
              <div class="col col-lg-4 col-sm-12">
                  <div class="button-group">
                      <button class="btn btn-success btn-lg btn-block" @click="modal1 = true">اضافة خدمة جديدة</button>
                  </div>
              </div>
          </div>
          <div class="custom-table">
              <table class="table table-borderless ">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">اسم الخدمة</th>
                        <th scope="col">صاحب الخدمة</th>
                        <th scope="col">رقم الهاتف</th>
                        <th scope="col">المحافظة</th>
                        <th scope="col">المنطقة</th>
                        <th scope="col">سعر الخدمة</th>
                        <th scope="col">تعديل / حذف</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) of services" :key="data.name">
                        <td scope="row">{{ data.id }}</td>
                        <td scope="row">{{ data.name }}</td>
                        <td scope="row">{{ data.user.username }}</td>
                        <td scope="row">{{ data.mobileNo }}</td>
                        <td scope="row">{{ data.governorate }}</td>
                        <td scope="row">{{ data.district }}</td>
                        <td scope="row">{{ data.price }}</td>
                        <td scope="row">
                            <button class="btn btn-warning ml-2" @click="modal2 = true; updateId = data.id"><Icon type="ios-create-outline" /></button>
                            <button class="btn btn-danger" @click="remove(data.id, index)"><Icon type="ios-trash-outline" /></button>
                        </td>
                    </tr>  
                </tbody>
            </table>
          </div>
      </div>

    <Modal v-model="modal1" footer-hide @on-ok="ok" @on-cancel="cancel">
        <div slot="header">
            <h4>اضافة خدمة</h4>
        </div>
        <form class="add-services" @submit.prevent="create">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">اسم الخدمة</label>
                        <input type="text" class="form-control" v-model="Name" placeholder="اسم الخدمة">
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label for="">رقم الهاتف</label>
                        <input type="text" class="form-control" v-model="MobileNo" placeholder="رقم الهاتف">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">سعر الخدمة</label>
                        <input type="text" class="form-control" v-model="Price" placeholder="سعر الخدمة">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="">تصنيف الخدمة</label>
                        <select name="CategoryId" id="CategoryId" v-model="CategoryId" class="form-control">
                            <option v-for="cate in scate" :key="cate.id" value="cate.id">{{ cate.name }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">المحافظة</label>
                        <select name="address1" id="address1" v-model="governor" class="form-control">
                            <option v-for="gover in Governorate" :key="gover.id" :value="gover.name">{{ gover.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label for="">المنطقة</label>
                        <input type="text" class="form-control" v-model="District" placeholder="المنطقة">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">وقت بدأ العمل</label>
                        <input type="time" class="form-control" v-model="WorkTimeFrom" placeholder="وقت بدأ العمل">
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label for="">وقت انتهاء العمل</label>
                        <input type="time" class="form-control" v-model="WorkTimeTo" placeholder="وقت انتهاء العمل">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="fileToUp">صورة الخدمة</label>
                        <input type="file" class="form-control" id="fileToUp" name="fileToUp" @change="getFileFromInput">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="Description">وصف الخدمة</label>
                        <textarea name="Description" id="Description" v-model="Description" class="form-control" cols="10" rows="5"></textarea>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary btn-block">اضافة الخدمة</button>
        </form>
    </Modal>


    <Modal v-model="modal2" footer-hide @on-ok="ok" @on-cancel="cancel">
        <div slot="header">
            <h4>تعديل خدمة</h4>
        </div>
        <form class="add-services" @submit.prevent="update(updateId)">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">اسم الخدمة</label>
                        <input type="text" class="form-control" v-model="Name" placeholder="اسم الخدمة">
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label for="">رقم الهاتف</label>
                        <input type="text" class="form-control" v-model="MobileNo" placeholder="رقم الهاتف">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">سعر الخدمة</label>
                        <input type="text" class="form-control" v-model="Price" placeholder="سعر الخدمة">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="">تصنيف الخدمة</label>
                        <select name="CategoryId" id="CategoryId" v-model="CategoryId" class="form-control">
                            <option v-for="cate in scate" :key="cate.id" value="cate.id">{{ cate.name }}</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">المحافظة</label>
                        <select name="address1" id="address1" v-model="governor" class="form-control">
                            <option v-for="gover in Governorate" :key="gover.id" :value="gover.name">{{ gover.name }}</option>
                        </select>
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label for="">المنطقة</label>
                        <input type="text" class="form-control" v-model="District" placeholder="المنطقة">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="">وقت بدأ العمل</label>
                        <input type="time" class="form-control" v-model="WorkTimeFrom" placeholder="وقت بدأ العمل">
                    </div>
                </div>

                <div class="col">
                    <div class="form-group">
                        <label for="">وقت انتهاء العمل</label>
                        <input type="time" class="form-control" v-model="WorkTimeTo" placeholder="وقت انتهاء العمل">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="fileToUp">صورة الخدمة</label>
                        <input type="file" class="form-control" id="fileToUp" name="fileToUp" @change="getFileFromInput">
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="Description">وصف الخدمة</label>
                        <textarea name="Description" id="Description" v-model="Description" class="form-control" cols="10" rows="5"></textarea>
                    </div>
                </div>
            </div>

            <button class="btn btn-primary btn-block">اضافة الخدمة</button>
        </form>
    </Modal>
  </div>
</template>

<script>
    import baseUrl from '../apis';
    export default {
        data () {
            return {
                modal1: false,
                modal2: false,
                search: '',
                services: '',
                filterdServices: '',
                loggedId: '',
                scate: '',
                Name: '',
                Description: '',
                WorkTimeFrom: '',
                WorkTimeTo: '',
                Image: '',
                MobileNo: '',
                Price: '',
                UserId: '',
                CategoryId: '',	
                District: '',
                governor: '',
                filePath: '',
                updateId: '',
                Governorate: [
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
            this.getServices();
            this.loggedinId();
            this.getServicesCategory();
        },
        computed: {
            
        },
        methods: {
            getFileFromInput(file) {
                this.files = file.target.files;
                var data = new FormData();
                data.append('file', this.files[0])
                this.getFileToUpLoad(data);
            },
            getFileToUpLoad(file) {
                var token = localStorage.getItem('token');
                let self = this;
                self.axios.post(`${baseUrl}/account/uploadDocumentsImage`, 
                file, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "bearer " + token
                    }
                })
                .then((result) => {
                    console.log(result);
                    this.filePath = result.data;
                    this.$Message.success('تم رفع الملف بنجاح');
                }).catch((err) => {
                    console.error(JSON.stringify(err));
                });
            },
            getServicesCategory() {
                let token = localStorage.getItem('token');
                this.axios.get(`${baseUrl}/category/getCategories`, {headers: {'Authorization': `bearer ${token}`}})
                .then((result) => {
                    this.scate = result.data;
                    console.log(result)
                }).catch((err) => {
                    throw new Error(err);
                });
            },
            getServices() {
                let token = localStorage.getItem('token');
                this.axios.get(`${baseUrl}/provider/getServices`, {headers: {'Authorization': `bearer ${token}`}})
                .then((result) => {
                    this.services = result.data;
                    this.filterdServices = result.data;
                    console.log(result)
                }).catch((err) => {
                    throw new Error(err);
                });
            },
            filterMethod(e) {
                let self = this;
                var filters = self.services.filter(data => data.name.includes(self.search));

                if(e.target.value < 1 && filters.length > 0) {
                    self.services = self.filterdServices;
                } else {
                    if(filters.length > 0) {
                        self.services = filters;
                    } else {
                        return false;
                    }
                }
            },
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

            loggedinId() {
                let token = localStorage.getItem('token');
                let user = this.parseJwt(token);
                this.loggedId = user.id;
            },
            ok () {
                this.$Message.info('Clicked ok');
            },
            cancel () {
                this.$Message.info('Clicked cancel');
            },
            create() {
                var token = localStorage.getItem('token');
                var object = {
                    Name: this.Name,
                    Description: this.Description,
                    WorkTimeFrom: this.WorkTimeFrom,
                    WorkTimeTo: this.WorkTimeTo,
                    Image: this.filePath,
                    MobileNo: this.MobileNo,
                    Price: this.Price,
                    UserId: this.loggedId,
                    CategoryId: this.CategoryId,
                    District: this.District,
                    Governorate: this.governor
                };

                this.axios.post(`${baseUrl}/provider/addService`, object, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    console.log(result);
                }).catch((err) => {
                    console.error(JSON.stringify(err));
                });
                // console.log(object);
                // this.$Message.success('Add Services');
            },
            update(index) {
                var token = localStorage.getItem('token');
                var object = {
                    Name: this.Name,
                    Description: this.Description,
                    WorkTimeFrom: this.WorkTimeFrom,
                    WorkTimeTo: this.WorkTimeTo,
                    ImageUri: this.filePath,
                    MobileNo: this.MobileNo,
                    Price: this.Price,
                    UserId: this.loggedId,
                    CategoryId: this.CategoryId,
                    District: this.District,
                    Governorate: this.governor
                };
                this.axios.put(`${baseUrl}/provider/addService`, object, 
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    console.log(result);
                }).catch((err) => {
                    console.error(JSON.stringify(err));
                });
                this.$Message.success('update item with id: ' + index);
            },
            remove (index, id) {
                let token = localStorage.getItem('token');
                this.axios.delete(`${baseUrl}/provider/deleteService?id=${index}`, 
                {
                    headers: {
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    console.log(result);
                }).catch((err) => {
                    console.error(err);
                });
                this.services.splice(id, 1);
                this.$Message.success('delet item with id: ' + index);
            }
        }
    }
</script>

<style lang="scss" scoped>
#services {
    display: block;
    height: 100%;
    width: 100%;

    .custom-table {
        display: block;
        width: 100%;
        table {
            tbody {
                tr {
                    &:not(:last-child) {
                        border-bottom: 1px solid rgba(0, 0, 0, 0.034);
                    }

                    td {
                        &:not(:last-child) {
                            border-left: 1px solid rgba(0, 0, 0, 0.034)
                        }
                    }
                }
            }
        }
    }

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