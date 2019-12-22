<template>
  <div id="category">
      <div v-if="categories.length < 1" class="no-selected">
          <p>لا يوجد اي تصنيفات حاليا</p>
          <Button type="dashed" @click="modal1 = true" style="margin-top: 10px;">قم باضافة تصنيفات</Button>
      </div>

      <div v-else class="h-100 d-flex flex-column align-items-center">
          <div class="row w-100 mt-5 mb-5">
              <div class="col col-lg-4 col-sm-12">
                  <div class="button-group">
                      <button class="btn btn-success btn-lg btn-block" @click="modal1 = true">اضافة تصنيفات جديدة</button>
                  </div>
              </div>
          </div>
          <div class="custom-table w-100">
              <table class="table table-borderless ">
                <thead class="thead-dark">
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">صورة التصنيف</th>
                        <th scope="col">اسم التصنيف</th>
                        <th scope="col">تعديل / حذف</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) of categories" :key="data.name">
                        <td scope="row">{{ data.id }}</td>
                        <td scope="row">
                            <img class="row-img" :src="imageFolder + data.imageUri.split(';')[0]" :alt="data.name">
                        </td>
                        <td scope="row">{{ data.name }}</td>
                        <td scope="row">
                            <button class="btn btn-warning ml-2" @click="modal2 = true; updateId = data.id; defaultCategoryInfo(data.id)"><Icon type="ios-create-outline" /></button>
                            <button class="btn btn-danger" @click="remove(data.id, index)"><Icon type="ios-trash-outline" /></button>
                        </td>
                    </tr>  
                </tbody>
            </table>
          </div>
      </div>

      <Modal v-model="modal1" footer-hide @on-ok="ok" @on-cancel="cancel">
          <div slot="header">
                <h4>اضافة تصنيف</h4>
            </div>
        <form method="POST" class="add-category" @submit.prevent="create">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="name">اسم التصنيف</label>
                        <input type="text" required name="name" id="name" class="form-control" v-model="name">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="file">صورة التصنيف</label>
                        <input type="file" name="file" required id="file" class="form-control" @change="getFileFromInput">
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-block">اضافة التصنيف</button>
        </form>
    </Modal>

    <Modal v-model="modal2" footer-hide @on-ok="ok" @on-cancel="cancel">
          <div slot="header">
                <h4>تعديل تصنيف</h4>
            </div>
        <form method="POST" class="add-category" @submit.prevent="update(updateId)">
            <div class="row">
                <div class="col">
                    <div class="form-group">
                        <label for="name">اسم التصنيف</label>
                        <input type="text" required name="name" id="name" class="form-control" v-model="name">
                    </div>
                </div>
                <div class="col">
                    <div class="form-group">
                        <label for="file">صورة التصنيف</label>
                        <input type="file" name="ufile" id="ufile" class="form-control" @change="getFileFromInput">
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-block">تحديث التصنيف</button>
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
                adminId: '',
                name: '',
                description: '',
                userId: '',
                image: {},
                imageUri: '',
                filePath: '',
                files: '',
                categories: '',
                imageFolder: '',
                updateId: '',
            }
        },
        mounted() {
            this.aid();
            this.getCategories();
            this.userId = this.adminId;
            this.imageFolder = 'http://mehtaj.srittwo.me';
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
                    console.log(this.categories)
                }).catch((err) => {
                    console.error(err);
                });
            },
            getFileFromInput(file) {
                this.files = file.target.files;
                var data = new FormData();
                data.append('file', this.files[0])
                this.getFileToUpLoad(data);
            },
            getFileToUpLoad(file) {
                var token = localStorage.getItem('token');
                let self = this;
                this.$Loading.start();
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
                    this.$Loading.finish();
                }).catch((err) => {
                    console.error(JSON.stringify(err));
                    this.$Loading.error();
                });
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
            aid() {
                let token = localStorage.getItem('token');
                let parsedToken = this.parseJwt(token);
                var id = parsedToken.id;
                this.adminId = id;
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
                    Name: this.name,
                    ImageUri: this.filePath,
                };
                
                this.$Loading.start();
                this.axios.post(`${baseUrl}/category/addCategory`,
                object,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    this.categories.unshift(object);
                    this.$Message.success('تمت الاضافة بنجاح');
                    this.$Loading.finish();
                }).catch((err) => {
                    console.error(JSON.stringify(err));
                    this.$Message.error('حدث خطاء في انشاء التصنيف');
                    this.$Loading.error();
                });
            },

            defaultCategoryInfo(id) {
                let token = localStorage.getItem('token');
                this.axios.get(`${baseUrl}/category/getCategory?id=${id}`,
                {
                    headers: {
                        Authorization: 'bearer ' + token
                    }
                }).then((result) => {
                    this.name = result.data.name;
                    this.imageUri = result.data.imageUri;
                    console.log(result.data);
                }).catch((err) => {
                    console.error(err);
                });
            },

            update(id) {
                var token = localStorage.getItem('token');
                var object = {
                    Id: id,
                    Name: this.name,
                    ImageUri: this.filePath,
                };
                this.$Loading.start();
                this.axios.put(`${baseUrl}/category/updateCategory`,
                object,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "bearer " + token
                    }
                }).then((result) => {
                    console.log(result);
                    this.$Message.success('تمت التحديث بنجاح');
                    this.$Loading.finish();
                }).catch((err) => {
                    console.error(JSON.stringify(err));
                    this.$Message.error('حدث خطاء في تحديث التصنيف');
                    this.$Loading.error();
                });
                this.$Message.success('update item with id: ' + id);
            },
            remove(id, index) {
                let token = localStorage.getItem('token');
                var confrimDelete = confirm("هل انت واثق من حذف التصنيف ؟");
                if(confrimDelete == false) {
                    this.$Message.error("لم يتم حذف التصنيف");
                    return false;
                }else {
                    this.axios.delete(`${baseUrl}/category/deleteCategory?id=${id}`, 
                    {
                        headers: {
                            Authorization: "bearer " + token
                        }
                    }).then((result) => {
                        console.log(result);
                    }).catch((err) => {
                        console.error(err);
                    });
                    this.categories.splice(index, 1);
                    this.$Message.success('تم حذف التصنيف بنجاح');
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
#category {
    display: block;
    height: 100%;
    width: 100%;

    .row-img {
        display: block;
        max-width: 50px;
        height: 50px;
        border-radius: 43px;
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