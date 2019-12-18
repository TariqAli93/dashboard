<template>
  <div id="print">
        <div class="print-main">
            <header>
                <div>
                    <img src="../assets/logo.png">
                </div>
                <div>
                    <img src="../assets/print-h1.jpg">
                </div>
                <div>
                    <img src="../assets/logo.png">
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
                            <div class="section">
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
        }
    },
    mounted() {
        this.params = this.$route.params.object;
        this.params2 = this.$route.params.areas;
        console.log(this.$route.params);
        this.getJobName(this.params.categoryId);
        setTimeout(() => {
            window.print();
        }, 2000);
    },
    methods: {
        getJobName(id) {
            let token = localStorage.getItem('token');
            this.axios.get(`${baseUrl}/category/getCategory?id=${id}`, 
            {
                headers: {
                    Authorization: "bearer " + token
                }
            }).then((result) => {
                this.job = result.data.name;
                console.log(this.job);
            }).catch((err) => {
                console.log(err);                
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@media print {
    .printBtn {
        display: none !important;
    }
}

.print-main {
    padding: 10px;
}

header {
    display: flex;
    margin-bottom: 30px;
    border-bottom: 2px solid rgba(black , .10);
    padding: 20px;
    align-items: center;
    justify-content: space-between;
    

    div {
        img {
            display: block;
            width: 300px;
        }

        &:not(:last-child) {
            margin-left: 10px;
        }
    }
}

#top {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .section {
        display: flex;

        &:not(:last-child) {
            margin-bottom: 10px;
        }

        .parmas {
            border: 2px solid rgba(black , .10);
            width: 400px !important;
            padding: 10px 10px;
        }

        span:not(.params) {
            width: 120px;
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
    padding: 25px;
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
      font-size: 0.82rem;
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