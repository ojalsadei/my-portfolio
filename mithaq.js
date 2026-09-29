const SOURCES = {
  regulations: {
    authority: "الهيئة العامة للعقار",
    reviewed: "29 سبتمبر 2026",
    url:
      "https://rega.gov.sa/%D8%A7%D9%84%D8%A3%D9%86%D8%B8%D9%85%D8%A9-%D9%88%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%B1%D8%A7%D8%AA/%D8%A7%D9%84%D8%A3%D9%86%D8%B8%D9%85%D8%A9-%D9%88%D8%A7%D9%84%D9%84%D9%88%D8%A7%D8%A6%D8%AD-%D9%88%D8%A7%D9%84%D8%A3%D8%AF%D9%84%D8%A9/%D8%A7%D9%84%D8%A3%D9%86%D8%B8%D9%85%D8%A9/%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%D8%A9-%D8%A8%D8%B6%D8%A8%D8%B7-%D8%A7%D9%84%D8%B9%D9%84%D8%A7%D9%82%D8%A9-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%85%D8%A4%D8%AC%D8%B1-%D9%88%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D8%A3%D8%AC%D8%B1/"
  },

  riyadhAnnouncement: {
    authority: "الهيئة العامة للعقار",
    reviewed: "29 سبتمبر 2026",
    url:
      "https://rega.gov.sa/media-center/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D9%88%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%86%D8%A7%D8%AA/%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%81%D9%82%D8%A9-%D8%B9%D9%84%D9%89-%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%D8%A9-%D8%A8%D8%B6%D8%A8%D8%B7-%D8%A7%D9%84%D8%B9%D9%84%D8%A7%D9%82%D8%A9-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%85-%D8%A4%D8%AC%D8%B1-%D9%88%D8%A7%D9%84%D9%85-%D8%B3%D8%AA%D8%A3%D8%AC-%D8%B1/"
  },

  residentialContract: {
    authority: "شبكة إيجار",
    reviewed: "29 سبتمبر 2026",
    url:
      "https://www.ejar.sa/ar/page/19420"
  },

  autoRenewal: {
    authority: "شبكة إيجار",
    reviewed: "29 سبتمبر 2026",
    url:
      "https://www.ejar.sa/ar/service/188290"
  }
};


/* العناصر */

const stepContent =
  document.getElementById(
    "stepContent"
  );

const stepTitle =
  document.getElementById(
    "stepTitle"
  );

const stepCurrent =
  document.getElementById(
    "stepCurrent"
  );

const stepTotal =
  document.getElementById(
    "stepTotal"
  );

const progressBar =
  document.getElementById(
    "progressBar"
  );

const backButton =
  document.getElementById(
    "backButton"
  );

const restartButton =
  document.getElementById(
    "restartButton"
  );


let currentScenario = null;
let currentStep = 0;
let answers = {};
let showingResult = false;


/* أدوات مساعدة */

function optionButton(
  value,
  title,
  description
) {
  return `
    <button
      class="option-button"
      type="button"
      data-value="${value}"
    >
      <strong>
        ${title}
      </strong>

      <span>
        ${description}
      </span>
    </button>
  `;
}


function categoryButton(
  id,
  label,
  title,
  description
) {
  return `
    <button
      class="category-card"
      type="button"
      data-scenario="${id}"
    >
      <span>
        ${label}
      </span>

      <strong>
        ${title}
      </strong>

      <p>
        ${description}
      </p>
    </button>
  `;
}


function createResult({
  label,
  title,
  body,
  reasons,
  next,
  source,
  warning
}) {
  return {
    label,
    title,
    body,
    reasons,
    next,
    source,
    warning:
      warning ||
      "هذه نتيجة إرشادية وليست حكمًا قانونيًا. قد تؤثر تفاصيل العقد أو الاستثناءات أو التحديثات التنظيمية في الحالة الفعلية."
  };
}


/* السيناريوهات */

const scenarios = {


  rentIncrease: {
    name: "زيادة الإيجار",

    steps: [
      {
        title:
          "في أي مدينة يقع العقار؟",

        key:
          "city",

        options: [
          [
            "riyadh",
            "الرياض",
            "العقار داخل مدينة الرياض"
          ],

          [
            "other",
            "مدينة أخرى",
            "العقار خارج مدينة الرياض"
          ]
        ]
      },

      {
        title:
          "إذا كان العقار في الرياض، هل هو داخل النطاق العمراني للمدينة؟",

        key:
          "urban",

        options: [
          [
            "yes",
            "نعم",
            "العقار داخل النطاق العمراني"
          ],

          [
            "no",
            "لا",
            "العقار خارج النطاق العمراني"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج التحقق من الموقع"
          ]
        ]
      },

      {
        title:
          "هل المشكلة تتعلق بزيادة في قيمة الأجرة؟",

        key:
          "increase",

        options: [
          [
            "yes",
            "نعم",
            "هناك محاولة لرفع قيمة الأجرة"
          ],

          [
            "no",
            "لا",
            "المشكلة مختلفة"
          ]
        ]
      },

      {
        title:
          "هل الحالة حدثت بعد 25 سبتمبر 2025؟",

        key:
          "date",

        options: [
          [
            "yes",
            "نعم",
            "الحالة بعد تاريخ السريان"
          ],

          [
            "no",
            "لا",
            "الحالة أقدم من ذلك"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج مراجعة التاريخ"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      if (
        a.city === "riyadh" &&
        a.urban === "yes" &&
        a.increase === "yes" &&
        a.date === "yes"
      ) {
        return createResult({
          label:
            "قاعدة مرتبطة بالحالة",

          title:
            "الحالة تقع ضمن نطاق الأحكام الخاصة بالزيادة في مدينة الرياض.",

          body:
            "الأحكام المنشورة من الهيئة العامة للعقار تنص على إيقاف الزيادة في قيمة الأجرة الإجمالية للعقارات الواقعة داخل النطاق العمراني لمدينة الرياض لمدة خمس سنوات بدءًا من 25 سبتمبر 2025.",

          reasons: [
            "العقار في مدينة الرياض",
            "العقار داخل النطاق العمراني",
            "المشكلة مرتبطة بزيادة في الأجرة",
            "الحالة بعد تاريخ بدء السريان"
          ],

          next:
            "راجع بيانات العقد وتفاصيل الحالة في إيجار، ثم تحقق من النص الرسمي قبل اتخاذ أي إجراء.",

          source:
            SOURCES.riyadhAnnouncement
        });
      }


      if (
        a.city === "riyadh" &&
        (
          a.urban === "unknown" ||
          a.date === "unknown"
        )
      ) {
        return createResult({
          label:
            "تحتاج تحقق إضافي",

          title:
            "لا يمكن تطبيق القاعدة بدقة قبل التأكد من النطاق أو التاريخ.",

          body:
            "النطاق العمراني وتاريخ الحالة من المدخلات الأساسية لتحديد ما إذا كانت الأحكام الخاصة بالرياض تنطبق على هذه الحالة.",

          reasons: [
            "أحد المدخلات الأساسية غير مؤكد",
            "النتيجة تتغير بحسب موقع العقار وتاريخ الحالة"
          ],

          next:
            "تحقق من موقع العقار وتاريخ الحالة ثم أعد التقييم.",

          source:
            SOURCES.riyadhAnnouncement
        });
      }


      return createResult({
        label:
          "مسار مختلف",

        title:
          "المعطيات الحالية لا تكفي لتطبيق القاعدة الخاصة بالرياض.",

        body:
          "الأحكام الخاصة بالزيادة في هذا النموذج مرتبطة بعقارات محددة داخل مدينة الرياض وفق نطاقها النظامي.",

        reasons: [
          "واحد أو أكثر من شروط النطاق غير متحقق",
          "قد توجد قواعد أو أحكام أخرى مرتبطة بالحالة"
        ],

        next:
          "ارجع إلى العقد والمصدر الرسمي أو اختر حالة أخرى إذا كانت المشكلة مختلفة.",

        source:
          SOURCES.regulations
      });

    }
  },



  renewalRefusal: {
    name:
      "رفض التجديد",

    steps: [
      {
        title:
          "هل العقار في مدينة الرياض؟",

        key:
          "riyadh",

        options: [
          [
            "yes",
            "نعم",
            "العقار في الرياض"
          ],

          [
            "no",
            "لا",
            "العقار في مدينة أخرى"
          ]
        ]
      },

      {
        title:
          "هل ترغب أنت كمستأجر في تجديد العقد؟",

        key:
          "tenantWants",

        options: [
          [
            "yes",
            "نعم",
            "أرغب في الاستمرار"
          ],

          [
            "no",
            "لا",
            "لا أرغب في التجديد"
          ]
        ]
      },

      {
        title:
          "ما السبب الذي ذكره المؤجر؟",

        key:
          "reason",

        options: [
          [
            "nonpayment",
            "عدم السداد",
            "ذكر وجود مبالغ مستحقة"
          ],

          [
            "structural",
            "مشكلة في سلامة المبنى",
            "ذكر وجود عيب هيكلي وفق تقرير"
          ],

          [
            "personal",
            "استخدام شخصي",
            "ذكر حاجته أو حاجة قريب من الدرجة الأولى"
          ],

          [
            "other",
            "سبب آخر",
            "السبب مختلف"
          ],

          [
            "unknown",
            "ما ذكر سببًا واضحًا",
            "لم يتم توضيح السبب"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      const listedReason =
        [
          "nonpayment",
          "structural",
          "personal"
        ].includes(
          a.reason
        );


      if (
        a.riyadh === "yes" &&
        a.tenantWants === "yes" &&
        listedReason
      ) {
        return createResult({
          label:
            "حالة تحتاج تحقق من الشروط",

          title:
            "السبب المذكور من الحالات الواردة ضمن الأحكام الخاصة بالرياض.",

          body:
            "وجود سبب مذكور في الأحكام لا يعني تلقائيًا أن كل شروطه متحققة. يجب التحقق من تفاصيل السبب والمستندات والعقد.",

          reasons: [
            "العقار في مدينة الرياض",
            "المستأجر يرغب في التجديد",
            "السبب المختار من الأسباب المذكورة في المصدر الرسمي"
          ],

          next:
            "تحقق من شروط السبب وتفاصيل العقد عبر إيجار أو الهيئة العامة للعقار.",

          source:
            SOURCES.riyadhAnnouncement
        });
      }


      if (
        a.riyadh === "yes" &&
        a.tenantWants === "yes" &&
        (
          a.reason === "other" ||
          a.reason === "unknown"
        )
      ) {
        return createResult({
          label:
            "تحتاج مراجعة رسمية",

          title:
            "السبب المدخل لا يطابق الأسباب الرئيسية الممثلة في هذه النسخة.",

          body:
            "الأحكام الخاصة بالرياض تحدد حالات مرتبطة بامتناع المؤجر عن التجديد، لكن النموذج لا يغطي كل احتمال أو كل استثناء ممكن.",

          reasons: [
            "العقار في الرياض",
            "المستأجر يرغب في التجديد",
            "السبب غير ممثل بشكل مباشر ضمن الخيارات الحالية"
          ],

          next:
            "راجع المصدر الرسمي أو تواصل مع القناة الرسمية للتحقق من الحالة.",

          source:
            SOURCES.riyadhAnnouncement
        });
      }


      return createResult({
        label:
          "مسار مختلف",

        title:
          "هذه الحالة لا تحقق نطاق مسار رفض التجديد في الرياض داخل النموذج.",

        body:
          "هذا المسار مصمم أساسًا للحالات التي يرغب فيها المستأجر بالاستمرار ويكون العقار ضمن نطاق الأحكام الخاصة بمدينة الرياض.",

        reasons: [
          "واحد أو أكثر من شروط نطاق المسار غير متحقق"
        ],

        next:
          "اختر مسار عدم التجديد إذا كنت أنت من لا يرغب في الاستمرار، أو ارجع إلى المصدر الرسمي.",

        source:
          SOURCES.regulations
      });

    }
  },



  unregistered: {
    name:
      "العقد غير موثق",

    steps: [
      {
        title:
          "هل العقد غير مسجل حاليًا في شبكة إيجار؟",

        key:
          "status",

        options: [
          [
            "yes",
            "نعم",
            "العقد غير مسجل"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج التحقق من حالة العقد"
          ]
        ]
      },

      {
        title:
          "هل تم تسجيل العقد مؤخرًا من أحد الطرفين؟",

        key:
          "registeredLater",

        options: [
          [
            "no",
            "لا",
            "ما زال غير مسجل"
          ],

          [
            "yes",
            "نعم",
            "تم تسجيله مؤخرًا"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      if (
        a.status === "yes" &&
        a.registeredLater === "no"
      ) {
        return createResult({
          label:
            "مسار التسجيل",

          title:
            "للمستأجر حق طلب تسجيل العقد في شبكة إيجار.",

          body:
            "الأحكام المنشورة تنص على وجوب تقدم المؤجر بطلب تسجيل العقد غير المسجل، كما تمنح المستأجر حق التقدم بطلب التسجيل.",

          reasons: [
            "العقد غير مسجل",
            "الأحكام تمنح المستأجر حق طلب التسجيل"
          ],

          next:
            "راجع خدمة إيجار والإجراءات المطلوبة لتسجيل العقد.",

          source:
            SOURCES.regulations
        });
      }


      if (
        a.registeredLater === "yes"
      ) {
        return createResult({
          label:
            "قد يكون الاعتراض مهمًا",

          title:
            "بعد التسجيل توجد مدة مرتبطة بالاعتراض على بيانات العقد.",

          body:
            "تنص الأحكام على حق الطرف الآخر في الاعتراض على بيانات العقد خلال 60 يومًا من تاريخ إبلاغه بالتسجيل.",

          reasons: [
            "تم تسجيل العقد",
            "الاعتراض مرتبط بمدة 60 يومًا من الإبلاغ"
          ],

          next:
            "تحقق من تاريخ الإبلاغ وبيانات العقد إذا كنت تعتقد أن المعلومات المسجلة غير صحيحة.",

          source:
            SOURCES.regulations
        });
      }


      return createResult({
        label:
          "تحقق أولًا",

        title:
          "نحتاج التأكد من حالة العقد في شبكة إيجار.",

        body:
          "لا يمكن تحديد مسار التسجيل أو الاعتراض قبل معرفة ما إذا كان العقد مسجلًا بالفعل.",

        reasons: [
          "حالة التسجيل غير مؤكدة"
        ],

        next:
          "تحقق من حسابك في إيجار أو بيانات العقد ثم أعد التقييم.",

        source:
          SOURCES.regulations
      });

    }
  },



  contractObjection: {
    name:
      "اعتراض على بيانات العقد",

    steps: [
      {
        title:
          "هل تم تسجيل العقد من أحد الطرفين وتم إبلاغك بالتسجيل؟",

        key:
          "notified",

        options: [
          [
            "yes",
            "نعم",
            "وصلني إبلاغ بالتسجيل"
          ],

          [
            "no",
            "لا",
            "لم يصلني إبلاغ واضح"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج التحقق"
          ]
        ]
      },

      {
        title:
          "هل مضى على الإبلاغ أكثر من 60 يومًا؟",

        key:
          "days",

        options: [
          [
            "no",
            "لا",
            "لم تمض 60 يومًا"
          ],

          [
            "yes",
            "نعم",
            "مضت أكثر من 60 يومًا"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج حساب المدة"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      if (
        a.notified === "yes" &&
        a.days === "no"
      ) {
        return createResult({
          label:
            "مدة الاعتراض",

          title:
            "أنت بحسب المدخلات داخل مدة الستين يومًا المرتبطة بالاعتراض.",

          body:
            "الأحكام تنص على حق الطرف الآخر في الاعتراض على بيانات العقد خلال 60 يومًا من تاريخ إبلاغه بالتسجيل.",

          reasons: [
            "تم إبلاغك بالتسجيل",
            "لم تمض 60 يومًا بحسب إجابتك"
          ],

          next:
            "تحقق من بيانات العقد وتاريخ الإبلاغ ثم راجع المسار الرسمي للاعتراض.",

          source:
            SOURCES.regulations
        });
      }


      if (
        a.notified === "yes" &&
        a.days === "yes"
      ) {
        return createResult({
          label:
            "المدة تحتاج مراجعة",

          title:
            "بحسب المدخلات، مضت مدة الستين يومًا المذكورة في الأحكام.",

          body:
            "النص المنشور يربط الاعتراض على بيانات التسجيل بمدة 60 يومًا من تاريخ الإبلاغ.",

          reasons: [
            "تم الإبلاغ بالتسجيل",
            "مر أكثر من 60 يومًا بحسب إجابتك"
          ],

          next:
            "راجع الجهة الرسمية لمعرفة الخيارات المتاحة وفق تفاصيل حالتك.",

          source:
            SOURCES.regulations
        });
      }


      return createResult({
        label:
          "معلومة ناقصة",

        title:
          "تاريخ الإبلاغ عنصر أساسي في هذا المسار.",

        body:
          "لا يمكن تقييم مدة الاعتراض دون معرفة ما إذا تم الإبلاغ ومتى حدث ذلك.",

        reasons: [
          "تاريخ الإبلاغ غير واضح"
        ],

        next:
          "تحقق من رسالة الإبلاغ أو بيانات الحساب ثم أعد التقييم.",

        source:
          SOURCES.regulations
      });

    }
  },



  deposit: {
    name:
      "مبلغ الضمان",

    steps: [
      {
        title:
          "هل أخليت الوحدة الإيجارية بالفعل؟",

        key:
          "vacated",

        options: [
          [
            "yes",
            "نعم",
            "تم إخلاء الوحدة"
          ],

          [
            "no",
            "لا",
            "لم أخل الوحدة بعد"
          ]
        ]
      },

      {
        title:
          "هل مر أكثر من 30 يومًا منذ الإخلاء؟",

        key:
          "days",

        options: [
          [
            "yes",
            "نعم",
            "مر أكثر من 30 يومًا"
          ],

          [
            "no",
            "لا",
            "ما زلت داخل الثلاثين يومًا"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج مراجعة التاريخ"
          ]
        ]
      },

      {
        title:
          "هل تم توضيح وجود أضرار أو مستحقات سيتم خصمها؟",

        key:
          "deductions",

        options: [
          [
            "yes",
            "نعم",
            "تم توضيح خصومات أو أضرار"
          ],

          [
            "no",
            "لا",
            "لم يتم توضيح شيء"
          ],

          [
            "unknown",
            "غير واضح",
            "لا أعرف تفاصيل الخصم"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      if (
        a.vacated === "yes" &&
        a.days === "yes"
      ) {
        return createResult({
          label:
            "قاعدة مبلغ الضمان",

          title:
            "مرور أكثر من 30 يومًا يجعل قاعدة إعادة مبلغ الضمان مرتبطة بحالتك.",

          body:
            "صفحة عقد إيجار السكني تنص على إعادة مبلغ الضمان إن وجد خلال 30 يومًا من إخلاء الوحدة، بعد خصم المستحقات الناتجة عن أضرار أو تلفيات إن وجدت.",

          reasons: [
            "تم إخلاء الوحدة",
            "مر أكثر من 30 يومًا",
            "أي خصومات مرتبطة بالأضرار أو المستحقات تحتاج توضيحًا"
          ],

          next:
            "راجع تفاصيل مبلغ الضمان والخصومات ثم تحقق من المسار الرسمي المناسب إذا لم تتم التسوية.",

          source:
            SOURCES.residentialContract
        });
      }


      if (
        a.vacated === "yes" &&
        a.days === "no"
      ) {
        return createResult({
          label:
            "ما زالت المدة جارية",

          title:
            "بحسب إجابتك، لم تنته مدة الثلاثين يومًا بعد.",

          body:
            "القاعدة المنشورة تربط إعادة مبلغ الضمان بمدة 30 يومًا من تاريخ الإخلاء، بعد معالجة المستحقات أو الأضرار إن وجدت.",

          reasons: [
            "تم الإخلاء",
            "لم تمض 30 يومًا حتى الآن"
          ],

          next:
            "احتفظ بتاريخ الإخلاء وأي محاضر أو مستندات مرتبطة بحالة الوحدة والضمان.",

          source:
            SOURCES.residentialContract
        });
      }


      return createResult({
        label:
          "القاعدة لم تبدأ بعد",

        title:
          "مسار إعادة مبلغ الضمان يرتبط بإخلاء الوحدة.",

        body:
          "إذا لم يتم الإخلاء بعد، لا يمكن استخدام تاريخ الثلاثين يومًا لتقييم الحالة.",

        reasons: [
          "الوحدة لم يتم إخلاؤها بعد"
        ],

        next:
          "راجع العقد وإجراءات الإخلاء والتسليم قبل تقييم مدة إعادة الضمان.",

        source:
          SOURCES.residentialContract
      });

    }
  },



  maintenance: {
    name:
      "الصيانة",

    steps: [
      {
        title:
          "ما نوع المشكلة الأقرب لحالتك؟",

        key:
          "type",

        options: [
          [
            "common",
            "الأجزاء المشتركة",
            "مثل المرافق أو المساحات المشتركة"
          ],

          [
            "safety",
            "سلامة المبنى",
            "مشكلة تؤثر في سلامة أو الانتفاع بالوحدة"
          ],

          [
            "other",
            "صيانة أخرى",
            "مشكلة داخل الوحدة لا أعرف من يتحملها"
          ]
        ]
      },

      {
        title:
          "هل راجعت عقدك لمعرفة مسؤولية الصيانة المحددة فيه؟",

        key:
          "contract",

        options: [
          [
            "yes",
            "نعم",
            "راجعت بنود العقد"
          ],

          [
            "no",
            "لا",
            "لم أراجعها بعد"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      if (
        a.type === "common"
      ) {
        return createResult({
          label:
            "التزام مرتبط بالصيانة",

          title:
            "الأجزاء المشتركة مذكورة ضمن التزامات المؤجر في عقد إيجار السكني المنشور.",

          body:
            "عقد إيجار السكني المنشور يذكر التزام المؤجر بصيانة الأجزاء المشتركة التابعة للعقار من حيث النظافة وصلاحية الاستعمال والانتفاع.",

          reasons: [
            "المشكلة مرتبطة بالأجزاء المشتركة",
            "العقد المنشور يتضمن التزامًا متعلقًا بصيانتها"
          ],

          next:
            "راجع عقدك الفعلي ووثق المشكلة ثم استخدم القنوات الرسمية عند الحاجة.",

          source:
            SOURCES.residentialContract
        });
      }


      if (
        a.type === "safety"
      ) {
        return createResult({
          label:
            "حالة تحتاج أولوية في التحقق",

          title:
            "مشكلات السلامة تحتاج مراجعة دقيقة للعقد والجهة الرسمية.",

          body:
            "التزامات الصيانة وسلامة الانتفاع تختلف بحسب نوع العيب وطبيعته، لذلك لا يعطي هذا النموذج حكمًا حاسمًا على مسؤولية طرف معين.",

          reasons: [
            "الحالة مرتبطة بسلامة المبنى أو الوحدة",
            "تفاصيل العيب وطبيعته تؤثر في المسؤولية"
          ],

          next:
            "راجع العقد ووثق المشكلة وأي تقارير فنية، ثم تحقق من المسار الرسمي المناسب.",

          source:
            SOURCES.residentialContract
        });
      }


      return createResult({
        label:
          "راجع مسؤولية الصيانة في العقد",

        title:
          "المسؤولية عن الصيانة قد تختلف بحسب نوع العطل وبنود العقد.",

        body:
          "النسخة الحالية لا تفصل جميع أنواع الصيانة، لذلك تستخدم العقد المنشور كمصدر توجيهي وتطلب الرجوع إلى العقد الفعلي.",

        reasons: [
          "نوع الصيانة لا يقع ضمن الحالات المباشرة الممثلة في النموذج",
          "بند الصيانة في العقد الفعلي مهم لتحديد المسار"
        ],

        next:
          "راجع بند الصيانة في عقدك ووثق العطل قبل اتخاذ الخطوة التالية.",

        source:
          SOURCES.residentialContract
      });

    }
  },



  latePayment: {
    name:
      "التأخر في السداد",

    steps: [
      {
        title:
          "هل لديك دفعة إيجارية مستحقة لم تسدد؟",

        key:
          "due",

        options: [
          [
            "yes",
            "نعم",
            "هناك دفعة مستحقة"
          ],

          [
            "no",
            "لا",
            "لا توجد دفعة متأخرة"
          ]
        ]
      },

      {
        title:
          "هل تعرف المهلة المحددة للسداد في عقدك؟",

        key:
          "grace",

        options: [
          [
            "yes",
            "نعم",
            "راجعت المهلة في العقد"
          ],

          [
            "no",
            "لا",
            "لا أعرف المهلة"
          ]
        ]
      },

      {
        title:
          "هل انتهت المهلة المذكورة في عقدك؟",

        key:
          "expired",

        options: [
          [
            "yes",
            "نعم",
            "انتهت المهلة"
          ],

          [
            "no",
            "لا",
            "ما زلت داخل المهلة"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج مراجعة العقد"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      if (
        a.due === "yes" &&
        a.grace === "yes" &&
        a.expired === "yes"
      ) {
        return createResult({
          label:
            "راجع شروط التأخر في السداد",

          title:
            "انتهاء مهلة السداد المحددة في العقد قد يؤثر في مسار العقد.",

          body:
            "صفحة عقد إيجار السكني المنشورة تذكر حق المؤجر في فسخ العقد عبر إيجار عند تحقق مدة التأخر المحددة، ما لم يتفق الطرفان على مهلة أخرى عبر إيجار.",

          reasons: [
            "هناك دفعة مستحقة",
            "مهلة العقد معروفة",
            "المهلة انتهت بحسب إجابتك"
          ],

          next:
            "راجع نص عقدك الفعلي وحالة الدفعة وأي اتفاقات تمت عبر إيجار.",

          source:
            SOURCES.residentialContract
        });
      }


      if (
        a.due === "yes" &&
        a.expired === "no"
      ) {
        return createResult({
          label:
            "المهلة ما زالت قائمة",

          title:
            "بحسب المدخلات، لم تنته مهلة السداد المحددة بعد.",

          body:
            "تقييم أثر التأخر يعتمد على المهلة الموجودة في العقد وأي اتفاق آخر مثبت عبر إيجار.",

          reasons: [
            "هناك دفعة مستحقة",
            "المهلة لم تنته بعد"
          ],

          next:
            "راجع تاريخ الاستحقاق والمهلة في العقد واتخذ الإجراء المناسب قبل انتهائها.",

          source:
            SOURCES.residentialContract
        });
      }


      return createResult({
        label:
          "راجع العقد أولًا",

        title:
          "لا يمكن تقييم أثر التأخر دون معرفة المهلة المحددة في العقد.",

        body:
          "تفاصيل السداد تختلف بحسب العقد والمهلة المتفق عليها، لذلك يعتبر العقد الفعلي مدخلًا أساسيًا لهذا المسار.",

        reasons: [
          "مهلة السداد غير واضحة أو لا توجد دفعة متأخرة"
        ],

        next:
          "راجع بند السداد في عقدك وحالة الدفعات في إيجار ثم أعد التقييم.",

        source:
          SOURCES.residentialContract
      });

    }
  },



  nonRenewal: {
    name:
      "عدم التجديد",

    steps: [
      {
        title:
          "هل أنت المستأجر وتريد عدم الاستمرار بعد نهاية العقد؟",

        key:
          "wantsOut",

        options: [
          [
            "yes",
            "نعم",
            "لا أرغب في التجديد"
          ],

          [
            "no",
            "لا",
            "المشكلة مختلفة"
          ]
        ]
      },

      {
        title:
          "هل دخل العقد في فترة الستين يومًا السابقة للانتهاء؟",

        key:
          "period",

        options: [
          [
            "no",
            "لا",
            "ما زال باقي أكثر من 60 يومًا"
          ],

          [
            "yes",
            "نعم",
            "أصبحت داخل فترة 60 يومًا"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج مراجعة تاريخ نهاية العقد"
          ]
        ]
      },

      {
        title:
          "هل خاصية التجديد التلقائي مفعلة في العقد؟",

        key:
          "auto",

        options: [
          [
            "yes",
            "نعم",
            "الخاصية مفعلة"
          ],

          [
            "no",
            "لا",
            "الخاصية غير مفعلة"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج التحقق في إيجار"
          ]
        ]
      }
    ],

    evaluate: (a) => {

      if (
        a.wantsOut === "yes" &&
        a.auto === "yes"
      ) {
        return createResult({
          label:
            "راجع إعداد التجديد التلقائي",

          title:
            "بما أنك لا ترغب في التجديد والخاصية مفعلة، توقيت إيقافها مهم.",

          body:
            "خدمة التجديد التلقائي في إيجار توضح أن المؤجر أو المستأجر أو الوسيط العقاري يمكنهم إيقاف الخاصية، وترتبط الخدمة بفترة الستين يومًا السابقة لانتهاء العقد.",

          reasons: [
            "أنت لا ترغب في التجديد",
            "خاصية التجديد التلقائي مفعلة",
            "توقيت نهاية العقد يؤثر في الإجراء"
          ],

          next:
            "تحقق من حالة الخاصية وتاريخ نهاية العقد داخل إيجار واتبع الإجراء الرسمي المناسب.",

          source:
            SOURCES.autoRenewal
        });
      }


      if (
        a.wantsOut === "yes" &&
        a.auto === "unknown"
      ) {
        return createResult({
          label:
            "تحقق من إعداد العقد",

          title:
            "أول خطوة هي معرفة ما إذا كان التجديد التلقائي مفعلا.",

          body:
            "لا يمكن تحديد المسار المناسب دون معرفة حالة التجديد التلقائي وتاريخ نهاية العقد.",

          reasons: [
            "أنت لا ترغب في التجديد",
            "حالة التجديد التلقائي غير معروفة"
          ],

          next:
            "افتح عقدك في إيجار وتحقق من حالة التجديد وتاريخ الانتهاء.",

          source:
            SOURCES.autoRenewal
        });
      }


      return createResult({
        label:
          "راجع تفاصيل العقد",

        title:
          "المسار يعتمد على حالة التجديد وتاريخ انتهاء العقد.",

        body:
          "إذا لم تكن خاصية التجديد التلقائي مفعلة، تبقى تفاصيل عقدك وإجراءات إنهاء العلاقة مهمة لتحديد الخطوة المناسبة.",

        reasons: [
          "التجديد التلقائي غير مؤكد أو غير مفعل"
        ],

        next:
          "راجع عقدك وخدمات إيجار المرتبطة بالتجديد وعدم الاستمرار.",

        source:
          SOURCES.autoRenewal
      });

    }
  }

};


/* الصفحة الرئيسية للمنصة */

function renderScenarioPicker() {

  currentScenario = null;
  currentStep = 0;
  answers = {};
  showingResult = false;


  stepTitle.textContent =
    "وش المشكلة اللي تواجهك؟";


  stepCurrent.textContent =
    "1";


  stepTotal.textContent =
    "1";


  progressBar.style.width =
    "12%";


  backButton.disabled =
    true;


  restartButton.classList.add(
    "is-hidden"
  );


  stepContent.innerHTML = `
    <div class="category-groups">

      ${categoryButton(
        "rentIncrease",
        "الإيجار والسداد",
        "زيادة الإيجار",
        "محاولة رفع قيمة الأجرة"
      )}

      ${categoryButton(
        "latePayment",
        "الإيجار والسداد",
        "تأخرت في السداد",
        "عندي دفعة متأخرة أو مهلة سداد"
      )}

      ${categoryButton(
        "renewalRefusal",
        "التجديد",
        "المؤجر يرفض التجديد",
        "أرغب في الاستمرار لكن المؤجر لا يريد التجديد"
      )}

      ${categoryButton(
        "nonRenewal",
        "التجديد",
        "ما أبي أجدد",
        "أريد عدم الاستمرار بعد نهاية العقد"
      )}

      ${categoryButton(
        "unregistered",
        "العقد والتوثيق",
        "العقد غير موثق",
        "العقد غير مسجل في شبكة إيجار"
      )}

      ${categoryButton(
        "contractObjection",
        "العقد والتوثيق",
        "اعتراض على بيانات العقد",
        "تم تسجيل بيانات لا أوافق عليها"
      )}

      ${categoryButton(
        "maintenance",
        "الصيانة",
        "عندي مشكلة صيانة",
        "أحتاج أفهم مسؤولية الصيانة"
      )}

      ${categoryButton(
        "deposit",
        "الخروج من العقار",
        "مبلغ الضمان",
        "أخليت الوحدة وأحتاج أفهم مدة إعادة الضمان"
      )}

    </div>
  `;


  document
    .querySelectorAll(
      "[data-scenario]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {
            startScenario(
              button.dataset.scenario
            );
          }
        );

      }
    );

}


/* بدء سيناريو */

function startScenario(id) {

  currentScenario =
    scenarios[id];

  currentStep = 0;

  answers = {};

  showingResult = false;


  restartButton.classList.remove(
    "is-hidden"
  );


  renderStep();

}


/* عرض سؤال */

function renderStep() {

  showingResult = false;


  const steps =
    currentScenario.steps;


  const step =
    steps[currentStep];


  stepTitle.textContent =
    step.title;


  stepCurrent.textContent =
    String(
      currentStep + 1
    );


  stepTotal.textContent =
    String(
      steps.length + 1
    );


  progressBar.style.width =
    `${
      (
        (
          currentStep + 1
        ) /
        (
          steps.length + 1
        )
      ) * 100
    }%`;


  backButton.disabled =
    false;


  stepContent.innerHTML = `
    <div class="options-grid">

      ${step.options
        .map(
          (
            [
              value,
              title,
              description
            ]
          ) =>
            optionButton(
              value,
              title,
              description
            )
        )
        .join("")}

    </div>
  `;


  document
    .querySelectorAll(
      "[data-value]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            answers[
              step.key
            ] =
              button.dataset.value;


            if (
              currentStep <
              steps.length - 1
            ) {

              currentStep += 1;

              renderStep();

            } else {

              renderResult();

            }

          }
        );

      }
    );

}


/* النتيجة */

function renderResult() {

  showingResult = true;


  const result =
    currentScenario.evaluate(
      answers
    );


  stepTitle.textContent =
    "ملخص حالتك";


  stepCurrent.textContent =
    String(
      currentScenario
        .steps
        .length + 1
    );


  stepTotal.textContent =
    String(
      currentScenario
        .steps
        .length + 1
    );


  progressBar.style.width =
    "100%";


  backButton.disabled =
    false;


  stepContent.innerHTML = `
    <div class="result-layout">

      <section class="result-summary">

        <span class="result-badge">
          ${result.label}
        </span>

        <h4>
          ${result.title}
        </h4>

        <p>
          ${result.body}
        </p>

        <div class="result-warning">
          ${result.warning}
        </div>

      </section>


      <section class="result-detail">

        <h4>
          ليش ظهرت هذه النتيجة؟
        </h4>


        <ul class="result-reasons">

          ${result.reasons
            .map(
              reason => `
                <li>
                  ${reason}
                </li>
              `
            )
            .join("")}

        </ul>


        <div class="result-next">

          <strong>
            الخطوة التالية
          </strong>

          <br>

          ${result.next}

        </div>


        <div class="result-source-card">

          <div>

            <span>
              الجهة
            </span>

            <strong>
              ${result.source.authority}
            </strong>

          </div>


          <div>

            <span>
              آخر تحقق من المصدر
            </span>

            <strong>
              ${result.source.reviewed}
            </strong>

          </div>

        </div>


        <a
          class="result-source-link"
          href="${result.source.url}"
          target="_blank"
          rel="noreferrer"
        >
          تحقق من المصدر الرسمي ↗
        </a>

      </section>

    </div>
  `;

}


/* السابق */

backButton.addEventListener(
  "click",
  () => {

    if (
      !currentScenario
    ) {
      return;
    }


    if (
      showingResult
    ) {

      currentStep =
        currentScenario
          .steps
          .length - 1;


      renderStep();

      return;
    }


    if (
      currentStep > 0
    ) {

      currentStep -= 1;

      renderStep();

      return;
    }


    renderScenarioPicker();

  }
);


/* إعادة البداية */

restartButton.addEventListener(
  "click",
  renderScenarioPicker
);


/* بدء المنصة */

renderScenarioPicker();


/* القائمة */

const menuButton =
  document.getElementById(
    "menuButton"
  );


const mobileMenu =
  document.getElementById(
    "mobileMenu"
  );


function closeMenu() {

  document.body.classList.remove(
    "menu-open"
  );


  menuButton?.setAttribute(
    "aria-expanded",
    "false"
  );


  mobileMenu?.setAttribute(
    "aria-hidden",
    "true"
  );

}


menuButton?.addEventListener(
  "click",
  () => {

    const open =
      document.body.classList.toggle(
        "menu-open"
      );


    menuButton.setAttribute(
      "aria-expanded",
      String(open)
    );


    mobileMenu.setAttribute(
      "aria-hidden",
      String(!open)
    );

  }
);


mobileMenu
  ?.querySelectorAll(
    "a"
  )
  .forEach(
    link => {

      link.addEventListener(
        "click",
        closeMenu
      );

    }
  );


document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape"
    ) {
      closeMenu();
    }

  }
);


/* الحركة */

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


const revealElements =
  document.querySelectorAll(
    ".reveal"
  );


if (
  reducedMotion
) {

  revealElements.forEach(
    element => {
      element.classList.add(
        "is-visible"
      );
    }
  );

} else {

  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry.target.classList.add(
              "is-visible"
            );


            revealObserver.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.08,

        rootMargin:
          "0px 0px -45px 0px"
      }
    );


  revealElements.forEach(
    element => {

      revealObserver.observe(
        element
      );

    }
  );

}


/* تنقل داخلي سلس */

document.addEventListener(
  "click",
  event => {

    const link =
      event.target.closest(
        'a[href^="#"]'
      );


    if (
      !link
    ) {
      return;
    }


    const href =
      link.getAttribute(
        "href"
      );


    if (
      !href ||
      href === "#"
    ) {
      return;
    }


    const target =
      document.querySelector(
        href
      );


    if (
      !target
    ) {
      return;
    }


    event.preventDefault();


    target.scrollIntoView(
      {
        behavior:
          reducedMotion
            ? "auto"
            : "smooth",

        block:
          "start"
      }
    );


    closeMenu();

  }
);


/* تحديد القسم الحالي في القائمة */

const navLinks =
  document.querySelectorAll(
    '.desktop-nav a[href^="#"]'
  );


const sections =
  [
    "platform",
    "analysis",
    "rules",
    "requirements",
    "sources"
  ]
    .map(
      id =>
        document.getElementById(
          id
        )
    )
    .filter(Boolean);


const sectionObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            !entry.isIntersecting
          ) {
            return;
          }


          const id =
            entry.target.id;


          navLinks.forEach(
            link => {

              link.classList.toggle(
                "is-active",
                link.getAttribute(
                  "href"
                ) ===
                  `#${id}`
              );

            }
          );

        }
      );

    },
    {
      rootMargin:
        "-35% 0px -55% 0px",

      threshold:
        0
    }
  );


sections.forEach(
  section => {
    sectionObserver.observe(
      section
    );
  }
);
