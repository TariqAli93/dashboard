<template>
  <div id="print">
        <div class="print-main">
            <Spin fix v-show="spinShow" size="large">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>جاري تحميل البيانات</div>
            </Spin>
            <header>
                <div>
                    <img src="../assets/logo.png">
                </div>
                <div>
                    <img src="../assets/print-h1.jpg">
                </div>
            </header>
            <div>
                <div id="top">
                    <div class="row">
                        <div class="col">
                            <div class="section">
                                <span>الاسم الرباعي</span>
                                <span class="parmas">{{ params.username }}</span>
                            </div>

                            <div class="section">
                                <span>رقم الهاتف</span>
                                <span class="parmas">{{ params.mobileNo }}</span>
                            </div>

                            <div class="section">
                                <span>المهنة</span>
                                <span class="parmas">{{ job }}</span>
                            </div>

                            <div class="section">
                                <span>العنوان</span>
                                <span class="parmas">{{ params.address1 }}</span>
                            </div>
                        </div>

                        <div class="col">
                            <div class="section" style="margin-top: 10px;">
                                <span>الناحية / القضاء</span>
                                <span class="parmas">{{ params2.district }}</span>
                            </div>

                            <div class="section">
                                <span>اقرب نقطة دالة</span>
                                <span class="parmas">{{ params2.closesPoint }}</span>
                            </div>

                            <div class="section">
                                <span>الزقاق</span>
                                <span class="parmas">{{ params2.zqaq }}</span>
                            </div>

                            <div class="section">
                                <span>المحلة</span>
                                <span class="parmas">{{ params2.mahala }}</span>
                            </div> 

                            <div class="section">
                                <span>رقم الدار</span>
                                <span class="parmas">{{ params2.dar }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="top-list">
                    <li>جميع المعلومات اعلاه ضرورية و مطلوبة و يجب ان تكون صحيحة</li>
                    <li>المستمسكات الثبوتية (هوية الاحوال المدنية + شهادة الجنسية) او (البطاقة الوطنية الموحدة) مع (بطاقة السكن)</li>
                    </ul>

                    <div class="commitment text-center">
                    <h4>التعهد</h4>
                    <span>
                        اني الموقع ادناه_________________{{ params.username }}_________________ اتعهد بصحة المعلومات المقدمة من قبلي
                    </span>
                    <span>
                        و المستمسكات الثبوتية و كما اتعهد بالالتزام بكافة المعاير المهنية و الاخلاقية حين العمل ضمن هذا المشروع
                    </span>
                    <span>
                        وان اعمل بكل امانة واتحمل المسؤولية الكاملة عن اي عمل غير قانوني و مخالف للشرائع و القوانين يصدر من قبلي
                    </span>
                    <span>
                        لدى اي جهة او فرد اعمل معه او لديه ضمن هذا المشروع
                    </span>
                    </div>

                    <ul class="commitment-list">
                    <li>سعر الاشتراك السنوي للتطبيق هو 12000 اثنا عشر الف دينار غير قابلة للاسترداد</li>
                    <li>ان هذه الاستمارة و المبلغ المستلم عليها لا يعتبر ضمان للحصول على وظيفة او فرصة عمل</li>
                </ul>

                <div class="commitment-footer">
                    <span>التوقيع</span>
                    <span>التاريخ</span>
                    <span>بصمة الابهام الايسر</span>
                </div>
            </div>
        </div>    

        <Modal v-model="fmodal" :closable="false" :mask-closable="false" footer-hide title="رفع العقد">
            <form>
                <div class="form-group">
                    <label for="fileToUp">ارفع العقد الموقع</label>
                    <input type="file" required multiple class="form-control" id="fileToUp" name="fileToUp" @change="getFileFromInput">
                </div>
            </form>
        </Modal>
    </div>
</template>

<script>
import baseUrl from '../apis';
export default {
    data() {
        return {
            params: '',
            params2: '',
            job: '',
            token: '',
            headerUpload: {},
            fmodal: false,
            spinShow: false,
            files: '',
        }
    },
    mounted() {
        this.token = localStorage.getItem('token');
        this.headerUpload = {
            Authorization: 'bearer ' + this.token,
            "Access-Control-Allow-Origin": "*"
        };
        this.params = this.$route.params.object;
        this.params2 = this.$route.params.areas;
        this.getJobName(this.params.categoryId);
        this.spinShow = true;
        setTimeout(() => {
            this.spinShow = false;
        },3500);
        setTimeout(() => {
            window.print();
        }, 4000);
        setTimeout(() => {
            this.fmodal = true;
            this.spinShow = false;
        }, 4500);
    },
    methods: {
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
                this.fmodal = false;
                this.updateDocs(this.filePath);
            }).catch((err) => {
                this.$Message.error('حدث خطاء في اضافة البيانات');
                this.spinShow = false;
                this.fmodal = false;
            });
        },

        updateDocs(path) {
            var token = localStorage.getItem('token');
            let self = this;
            self.axios.put(`${baseUrl}/account/addUserDocuments`,
            {
                mobileNumber: self.params.mobileNo,
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
        getJobName(id) {
            let token = localStorage.getItem('token');
            this.axios.get(`${baseUrl}/category/getCategory?id=${id}`, 
            {
                headers: {
                    Authorization: "bearer " + token
                }
            }).then((result) => {
                this.job = result.data.name;
            }).catch((err) => {
                console.error(err);                
            });
        },
    }
}
</script>

<style lang="scss" scoped>
@media print {
    .printBtn {
        display: none !important;
    }
}
.demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
}

div#main-content  {
    padding: 10px !important;
}
.print-main {
    padding: 3px;
}

header {
    display: flex;
    margin-bottom: 30px;
    border-bottom: 2px solid rgba(black , .10);
    padding: 10px;
    align-items: center;
    justify-content: space-between;
    

    div {
        img {
            display: block;
            width: 120px;
        }
    }
}

span {
    font-size: 30px;
}

li {
    font-size: 25px;
}

#top {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .section {
        display: flex;

        &:not(:last-child) {
            margin-bottom: 5px;
        }

        .parmas {
            border: 2px solid rgba(black , .10);
            width: 400px !important;
            padding: 5px 10px;
        }

        span:not(.params) {
            width: 275px;
        }
    }
}

.top-list {
    padding: 10px;
    list-style: none;

    li {
        &:not(:last-child) {
            margin-bottom: 10px;
        }
    }
}

.commitment {
    display: block;
    padding: 10px;
    border: 2px solid #00000026;
    border-radius: 10px;

    h4 {
      display: block;
      text-align: center;
      margin-bottom: 10px;
      font-size: 3rem;
    }

    span {
      margin-bottom: 10px;
      display: block;
      font-size: 20px;
    }
  }

  .commitment-list {
    padding: 10px;
    list-style: square;
    margin-top: 10px;

    li {
      display: block;
    }
  }

  .commitment-footer {
    display: flex;
    margin-top: 65px;
    margin-bottom: 65px;
    padding: 10px;
    align-items: center;
    justify-content: center;
    flex-direction: row;

    span {
      flex: 1;
    }
  }
</style>