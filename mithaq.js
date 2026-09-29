const SOURCES = {
  regulations: {
    authority: "الهيئة العامة للعقار",
    reviewed: "29 سبتمبر 2026",
    url: "https://rega.gov.sa/"
  },

  ejar: {
    authority: "شبكة إيجار",
    reviewed: "29 سبتمبر 2026",
    url: "https://www.ejar.sa/"
  },

  renewal: {
    authority: "شبكة إيجار",
    reviewed: "29 سبتمبر 2026",
    url: "https://www.ejar.sa/ar/service/188290"
  }
};


const navigator =
  document.getElementById(
    "navigator"
  );


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


const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


/* أدوات */

function createOption(
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


function createCategory(
  id,
  group,
  title,
  description
) {
  return `
    <button
      class="category-button"
      type="button"
      data-scenario="${id}"
    >
      <small>
        ${group}
      </small>

      <strong>
        ${title}
      </strong>

      <span>
        ${description}
      </span>
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
  disclaimer
}) {
  return {
    label,
    title,
    body,
    reasons,
    next,
    source,

    disclaimer:
      disclaimer ||
      "هذه نتيجة إرشادية مبنية على إجاباتك والقواعد الممثلة في النموذج. قد توجد تفاصيل أو استثناءات تغير الحالة الفعلية، لذلك تحقق دائمًا من المصدر الرسمي."
  };
}


/* تحريك السؤال إلى مكان واضح */

function scrollToQuestion() {

  requestAnimationFrame(
    () => {

      const rect =
        navigator.getBoundingClientRect();


      const comfortableTop =
        125;


      const currentTop =
        rect.top;


      if (
        currentTop < 95 ||
        currentTop > 190
      ) {

        const target =
          window.scrollY +
          currentTop -
          comfortableTop;


        window.scrollTo({
          top: target,

          behavior:
            reducedMotion
              ? "auto"
              : "smooth"
        });

      }

    }
  );

}


/* السيناريوهات */

const scenarios = {


  rentIncrease: {

    name:
      "زيادة الإيجار",


    steps: [

      {
        key:
          "city",

        title:
          "في أي مدينة يقع العقار؟",

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
        key:
          "urban",

        title:
          "هل العقار داخل النطاق العمراني لمدينة الرياض؟",

        when:
          a =>
            a.city === "riyadh",

        options: [
          [
            "yes",
            "نعم",
            "داخل النطاق العمراني"
          ],

          [
            "no",
            "لا",
            "خارج النطاق العمراني"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج التحقق من الموقع"
          ]
        ]
      },


      {
        key:
          "date",

        title:
          "هل الحالة حدثت بعد 25 سبتمبر 2025؟",

        when:
          a =>
            a.city === "riyadh" &&
            a.urban === "yes",

        options: [
          [
            "yes",
            "نعم",
            "الحالة بعد تاريخ بدء السريان"
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


    evaluate: a => {

      if (
        a.city === "other"
      ) {
        return createResult({
          label:
            "مسار عام",

          title:
            "القاعدة الخاصة بمدينة الرياض لا تنطبق على موقع العقار الذي اخترته.",

          body:
            "هذه النسخة تميز الأحكام الخاصة بالرياض عن الحالات الواقعة في مدن أخرى حتى لا تطبق قاعدة محلية على حالة خارج نطاقها.",

          reasons: [
            "العقار خارج مدينة الرياض",
            "لم يتم سؤالك عن النطاق العمراني لأنه غير مطلوب لهذه الحالة"
          ],

          next:
            "راجع عقدك والمصدر الرسمي لمعرفة الأحكام أو الخدمات المرتبطة بحالتك في المدينة التي يقع فيها العقار.",

          source:
            SOURCES.regulations
        });
      }


      if (
        a.city === "riyadh" &&
        a.urban === "unknown"
      ) {
        return createResult({
          label:
            "تحتاج تحقق إضافي",

          title:
            "النطاق العمراني معلومة أساسية قبل تطبيق القاعدة الخاصة بالرياض.",

          body:
            "لا يعطي ميثاق نتيجة حاسمة قبل اكتمال المعلومات التي يعتمد عليها منطق القرار.",

          reasons: [
            "العقار في الرياض",
            "حالة النطاق العمراني غير مؤكدة"
          ],

          next:
            "تحقق من موقع العقار ثم أعد التقييم.",

          source:
            SOURCES.regulations
        });
      }


      if (
        a.city === "riyadh" &&
        a.urban === "no"
      ) {
        return createResult({
          label:
            "خارج نطاق القاعدة",

          title:
            "العقار بحسب إجابتك خارج النطاق المكاني المستخدم في هذه القاعدة.",

          body:
            "لذلك توقف ميثاق عن طرح الأسئلة المرتبطة بتاريخ تطبيق القاعدة لأنها لم تعد ضرورية للمسار الحالي.",

          reasons: [
            "العقار في الرياض",
            "العقار خارج النطاق العمراني بحسب إجابتك"
          ],

          next:
            "راجع المصدر الرسمي وتفاصيل عقدك لمعرفة المسار المناسب لحالتك.",

          source:
            SOURCES.regulations
        });
      }


      if (
        a.city === "riyadh" &&
        a.urban === "yes" &&
        a.date === "yes"
      ) {
        return createResult({
          label:
            "قاعدة مرتبطة بالحالة",

          title:
            "المعطيات المدخلة تطابق نطاق القاعدة الخاصة بالزيادة في الرياض.",

          body:
            "تم الوصول لهذه النتيجة بناءً على موقع العقار والنطاق العمراني وتاريخ الحالة.",

          reasons: [
            "العقار في مدينة الرياض",
            "العقار داخل النطاق العمراني",
            "الحالة ضمن الفترة المستخدمة في القاعدة"
          ],

          next:
            "راجع تفاصيل عقدك ثم تحقق من النص الرسمي قبل اتخاذ أي إجراء.",

          source:
            SOURCES.regulations
        });
      }


      if (
        a.date === "unknown"
      ) {
        return createResult({
          label:
            "تحتاج تحقق إضافي",

          title:
            "تاريخ الحالة مطلوب قبل إكمال التقييم.",

          body:
            "التاريخ أحد المتغيرات المستخدمة لتحديد ما إذا كانت القاعدة ممثلة في الحالة الحالية.",

          reasons: [
            "العقار في الرياض",
            "العقار داخل النطاق العمراني",
            "تاريخ الحالة غير مؤكد"
          ],

          next:
            "تحقق من تاريخ الزيادة ثم أعد التقييم.",

          source:
            SOURCES.regulations
        });
      }


      return createResult({
        label:
          "مسار مختلف",

        title:
          "المعطيات الحالية لا تطابق نطاق القاعدة المستخدمة في النموذج.",

        body:
          "هذا لا يعني عدم وجود حكم أو خدمة مرتبطة بحالتك، وإنما يعني أن القاعدة الحالية ليست المطابقة المباشرة.",

        reasons: [
          "واحد أو أكثر من شروط القاعدة غير متحقق"
        ],

        next:
          "راجع المصدر الرسمي أو تفاصيل عقدك للحصول على المسار الأنسب.",

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
        key:
          "city",

        title:
          "هل العقار في مدينة الرياض؟",

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
        key:
          "tenantWants",

        title:
          "هل ترغب أنت كمستأجر في الاستمرار وتجديد العقد؟",

        options: [
          [
            "yes",
            "نعم",
            "أرغب في التجديد"
          ],

          [
            "no",
            "لا",
            "لا أرغب في التجديد"
          ]
        ]
      },


      {
        key:
          "reason",

        title:
          "ما السبب الذي ذكره المؤجر؟",

        when:
          a =>
            a.city === "yes" &&
            a.tenantWants === "yes",

        options: [
          [
            "payment",
            "عدم السداد",
            "ذكر وجود مبالغ مستحقة"
          ],

          [
            "safety",
            "سلامة المبنى",
            "ذكر وجود مشكلة مرتبطة بسلامة العقار"
          ],

          [
            "personal",
            "استخدام شخصي",
            "ذكر حاجته إلى العقار"
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


    evaluate: a => {

      if (
        a.tenantWants === "no"
      ) {
        return createResult({
          label:
            "مسار مختلف",

          title:
            "المشكلة ليست رفض تجديد من المؤجر إذا كنت لا ترغب أنت في الاستمرار.",

          body:
            "يمكنك استخدام مسار عدم التجديد بدلًا من هذا المسار.",

          reasons: [
            "المستأجر لا يرغب في التجديد"
          ],

          next:
            "ابدأ حالة جديدة واختر مسار عدم التجديد.",

          source:
            SOURCES.renewal
        });
      }


      if (
        a.city === "no"
      ) {
        return createResult({
          label:
            "تحتاج مسارًا عامًا",

          title:
            "الأحكام المحلية الممثلة في هذا المسار مرتبطة بالرياض.",

          body:
            "لذلك لم يطلب منك ميثاق سبب رفض التجديد لأنه لن يستخدمه في تطبيق قاعدة محلية خارج نطاقها.",

          reasons: [
            "العقار خارج مدينة الرياض"
          ],

          next:
            "راجع العقد والخدمات الرسمية المرتبطة بالتجديد في إيجار.",

          source:
            SOURCES.renewal
        });
      }


      return createResult({
        label:
          "تحتاج تحقق من السبب",

        title:
          "سبب رفض التجديد يؤثر في تقييم الحالة.",

        body:
          "النتيجة الحالية تعتمد على المدينة ورغبة المستأجر والسبب الذي ذكره المؤجر.",

        reasons: [
          "العقار في الرياض",
          "المستأجر يرغب في التجديد",
          "تم تحديد سبب رفض التجديد"
        ],

        next:
          "تحقق من شروط السبب ومستنداته وتفاصيل عقدك عبر المصدر الرسمي.",

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
        key:
          "status",

        title:
          "هل العقد غير مسجل حاليًا في شبكة إيجار؟",

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
        key:
          "registeredLater",

        title:
          "هل تم تسجيل العقد مؤخرًا من أحد الطرفين؟",

        when:
          a =>
            a.status === "yes",

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


    evaluate: a => {

      if (
        a.status === "unknown"
      ) {
        return createResult({
          label:
            "تحقق أولًا",

          title:
            "نحتاج التأكد من حالة العقد في شبكة إيجار.",

          body:
            "لا يمكن اختيار مسار التسجيل أو الاعتراض قبل معرفة حالة العقد.",

          reasons: [
            "حالة تسجيل العقد غير مؤكدة"
          ],

          next:
            "تحقق من حسابك في إيجار ثم أعد التقييم.",

          source:
            SOURCES.ejar
        });
      }


      if (
        a.registeredLater === "yes"
      ) {
        return createResult({
          label:
            "مسار الاعتراض",

          title:
            "بما أن العقد تم تسجيله، قد يصبح الاعتراض على البيانات هو المسار الأكثر ارتباطًا بحالتك.",

          body:
            "يختلف هذا المسار عن حالة العقد الذي ما زال غير مسجل.",

          reasons: [
            "العقد تم تسجيله بعد أن كان غير مسجل"
          ],

          next:
            "راجع بيانات التسجيل وتاريخ الإبلاغ عبر المصدر الرسمي.",

          source:
            SOURCES.regulations
        });
      }


      return createResult({
        label:
          "مسار التسجيل",

        title:
          "العقد بحسب إجابتك ما زال غير مسجل.",

        body:
          "الميزة هنا تفرق بين الحاجة إلى التسجيل وبين الاعتراض على عقد تم تسجيله بالفعل.",

        reasons: [
          "العقد غير مسجل",
          "لم يتم تسجيله لاحقًا"
        ],

        next:
          "راجع إجراءات تسجيل العقد في إيجار.",

        source:
          SOURCES.ejar
      });

    }

  },



  objection: {

    name:
      "اعتراض على بيانات العقد",


    steps: [

      {
        key:
          "notified",

        title:
          "هل تم إبلاغك بتسجيل العقد؟",

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
        key:
          "days",

        title:
          "هل مضى على الإبلاغ أكثر من 60 يومًا؟",

        when:
          a =>
            a.notified === "yes",

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


    evaluate: a => {

      if (
        a.notified !== "yes"
      ) {
        return createResult({
          label:
            "معلومة ناقصة",

          title:
            "تاريخ الإبلاغ مهم لتقييم مسار الاعتراض.",

          body:
            "لهذا لم يعرض ميثاق سؤال المدة إذا لم يكن الإبلاغ مؤكدًا.",

          reasons: [
            "حالة الإبلاغ غير مؤكدة"
          ],

          next:
            "تحقق من إشعارات العقد أو حسابك في إيجار.",

          source:
            SOURCES.regulations
        });
      }


      return createResult({
        label:
          "مسار الاعتراض",

        title:
          "مدة الإبلاغ عنصر أساسي في تقييم الحالة.",

        body:
          "تم بناء النتيجة اعتمادًا على وجود الإبلاغ والمدة التي ذكرتها.",

        reasons: [
          "تم إبلاغك بالتسجيل",
          "تم تحديد المدة منذ الإبلاغ"
        ],

        next:
          "تحقق من البيانات وتاريخ الإبلاغ عبر القنوات الرسمية.",

        source:
          SOURCES.regulations
      });

    }

  },



  maintenance: {

    name:
      "الصيانة",


    steps: [

      {
        key:
          "type",

        title:
          "وش نوع مشكلة الصيانة؟",

        options: [
          [
            "common",
            "الأجزاء المشتركة",
            "مثل المرافق والمساحات المشتركة"
          ],

          [
            "safety",
            "مشكلة سلامة",
            "مشكلة تؤثر في سلامة المبنى أو الوحدة"
          ],

          [
            "other",
            "صيانة أخرى",
            "عطل داخل الوحدة"
          ]
        ]
      },


      {
        key:
          "contract",

        title:
          "هل راجعت بند الصيانة في عقدك؟",

        options: [
          [
            "yes",
            "نعم",
            "راجعت مسؤوليات الصيانة"
          ],

          [
            "no",
            "لا",
            "لم أراجع العقد بعد"
          ]
        ]
      }

    ],


    evaluate: a => {

      return createResult({
        label:
          "مسار الصيانة",

        title:
          "نوع العطل وبنود العقد عاملان أساسيان في تقييم مسؤولية الصيانة.",

        body:
          "لهذا لا يعطي ميثاق حكمًا عامًا على جميع الأعطال.",

        reasons: [
          "تم تحديد نوع مشكلة الصيانة",
          a.contract === "yes"
            ? "تمت مراجعة بند الصيانة في العقد"
            : "بند الصيانة في العقد لم تتم مراجعته بعد"
        ],

        next:
          "وثق المشكلة وراجع عقدك ثم تحقق من الخدمة الرسمية المناسبة.",

        source:
          SOURCES.ejar
      });

    }

  },



  deposit: {

    name:
      "مبلغ الضمان",


    steps: [

      {
        key:
          "vacated",

        title:
          "هل تم إخلاء الوحدة بالفعل؟",

        options: [
          [
            "yes",
            "نعم",
            "تم إخلاء الوحدة"
          ],

          [
            "no",
            "لا",
            "لم يتم الإخلاء بعد"
          ]
        ]
      },


      {
        key:
          "days",

        title:
          "هل مر أكثر من 30 يومًا منذ الإخلاء؟",

        when:
          a =>
            a.vacated === "yes",

        options: [
          [
            "yes",
            "نعم",
            "مر أكثر من 30 يومًا"
          ],

          [
            "no",
            "لا",
            "ما زلت داخل المدة"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج مراجعة تاريخ الإخلاء"
          ]
        ]
      },


      {
        key:
          "deductions",

        title:
          "هل تم توضيح وجود أضرار أو مستحقات سيتم خصمها؟",

        when:
          a =>
            a.vacated === "yes",

        options: [
          [
            "yes",
            "نعم",
            "تم توضيح خصومات"
          ],

          [
            "no",
            "لا",
            "لم يتم توضيح شيء"
          ],

          [
            "unknown",
            "غير واضح",
            "لا أعرف التفاصيل"
          ]
        ]
      }

    ],


    evaluate: a => {

      if (
        a.vacated === "no"
      ) {
        return createResult({
          label:
            "قبل الإخلاء",

          title:
            "مسار إعادة مبلغ الضمان يبدأ بعد إخلاء الوحدة.",

          body:
            "لذلك تجاوز ميثاق أسئلة المدة والخصومات لأنها ليست مطلوبة بعد.",

          reasons: [
            "الوحدة لم يتم إخلاؤها بعد"
          ],

          next:
            "راجع إجراءات الإخلاء والتسليم في عقدك.",

          source:
            SOURCES.ejar
        });
      }


      return createResult({
        label:
          "مسار مبلغ الضمان",

        title:
          "تاريخ الإخلاء وأي خصومات محتملة من أهم مدخلات الحالة.",

        body:
          "الميزة تجمع المتغيرات الأساسية قبل توجيه المستخدم إلى المصدر.",

        reasons: [
          "تم إخلاء الوحدة",
          "تم تحديد المدة منذ الإخلاء",
          "تم تحديد حالة الخصومات أو الأضرار"
        ],

        next:
          "راجع تفاصيل الضمان ومحضر التسليم والمصدر الرسمي.",

        source:
          SOURCES.ejar
      });

    }

  },



  latePayment: {

    name:
      "التأخر في السداد",


    steps: [

      {
        key:
          "due",

        title:
          "هل لديك دفعة مستحقة غير مسددة؟",

        options: [
          [
            "yes",
            "نعم",
            "هناك دفعة متأخرة"
          ],

          [
            "no",
            "لا",
            "لا توجد دفعة متأخرة"
          ]
        ]
      },


      {
        key:
          "grace",

        title:
          "هل تعرف المهلة المحددة في عقدك؟",

        when:
          a =>
            a.due === "yes",

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
        key:
          "expired",

        title:
          "هل انتهت المهلة المذكورة في العقد؟",

        when:
          a =>
            a.due === "yes" &&
            a.grace === "yes",

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
          ]
        ]
      }

    ],


    evaluate: a => {

      if (
        a.due === "no"
      ) {
        return createResult({
          label:
            "لا توجد دفعة متأخرة",

          title:
            "مسار التأخر في السداد لا ينطبق على الإجابة الحالية.",

          body:
            "لهذا تم إيقاف الأسئلة الإضافية المتعلقة بالمهلة.",

          reasons: [
            "لا توجد دفعة مستحقة غير مسددة"
          ],

          next:
            "ابدأ حالة جديدة إذا كانت مشكلتك مختلفة.",

          source:
            SOURCES.ejar
        });
      }


      if (
        a.grace === "no"
      ) {
        return createResult({
          label:
            "راجع العقد",

          title:
            "المهلة الموجودة في العقد مطلوبة قبل تقييم أثر التأخر.",

          body:
            "بدل افتراض مدة موحدة، يطلب ميثاق الرجوع إلى العقد الفعلي.",

          reasons: [
            "هناك دفعة متأخرة",
            "المهلة غير معروفة"
          ],

          next:
            "راجع بند السداد في عقدك ثم أعد التقييم.",

          source:
            SOURCES.ejar
        });
      }


      return createResult({
        label:
          "مسار السداد",

        title:
          "تم تقييم الحالة بناءً على وجود الدفعة والمهلة وحالتها.",

        body:
          "تفاصيل العقد تظل المرجع الأساسي قبل اتخاذ أي خطوة.",

        reasons: [
          "هناك دفعة متأخرة",
          "المهلة معروفة",
          a.expired === "yes"
            ? "المهلة انتهت"
            : "المهلة ما زالت قائمة"
        ],

        next:
          "راجع حالة الدفعة والعقد والخدمات الرسمية في إيجار.",

        source:
          SOURCES.ejar
      });

    }

  },



  nonRenewal: {

    name:
      "عدم التجديد",


    steps: [

      {
        key:
          "wantsOut",

        title:
          "هل أنت المستأجر وتريد عدم الاستمرار بعد نهاية العقد؟",

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
        key:
          "auto",

        title:
          "هل التجديد التلقائي مفعل في عقدك؟",

        when:
          a =>
            a.wantsOut === "yes",

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
            "أحتاج التحقق"
          ]
        ]
      },


      {
        key:
          "period",

        title:
          "هل دخل العقد في فترة الستين يومًا السابقة للانتهاء؟",

        when:
          a =>
            a.wantsOut === "yes" &&
            a.auto === "yes",

        options: [
          [
            "yes",
            "نعم",
            "العقد داخل الفترة"
          ],

          [
            "no",
            "لا",
            "ما زال باقي أكثر من ذلك"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج مراجعة تاريخ نهاية العقد"
          ]
        ]
      }

    ],


    evaluate: a => {

      if (
        a.wantsOut === "no"
      ) {
        return createResult({
          label:
            "مسار مختلف",

          title:
            "عدم التجديد ليس المشكلة المطابقة لإجابتك.",

          body:
            "يمكنك العودة واختيار الحالة الأقرب لمشكلتك.",

          reasons: [
            "المستأجر لا يريد استخدام مسار عدم التجديد"
          ],

          next:
            "ابدأ حالة جديدة.",

          source:
            SOURCES.renewal
        });
      }


      return createResult({
        label:
          "مسار عدم التجديد",

        title:
          "حالة التجديد التلقائي وتوقيت نهاية العقد يؤثران في المسار.",

        body:
          "لهذا تظهر أسئلة التوقيت فقط عندما تكون خاصية التجديد التلقائي مفعلة.",

        reasons: [
          "المستأجر لا يرغب في التجديد",
          a.auto === "yes"
            ? "التجديد التلقائي مفعل"
            : "التجديد التلقائي غير مفعل أو غير مؤكد"
        ],

        next:
          "تحقق من إعدادات عقدك وتاريخ الانتهاء عبر إيجار.",

        source:
          SOURCES.renewal
      });

    }

  }

};


/* خطوات السيناريو الفعلية */

function getActiveSteps() {

  if (
    !currentScenario
  ) {
    return [];
  }


  return currentScenario.steps.filter(
    step => {

      if (
        typeof step.when !== "function"
      ) {
        return true;
      }


      return step.when(
        answers
      );

    }
  );

}


/* الشاشة الرئيسية */

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
    <div class="category-grid">

      ${createCategory(
        "rentIncrease",
        "الإيجار",
        "زيادة الإيجار",
        "أحتاج أفهم إذا كانت الزيادة مرتبطة بقواعد خاصة"
      )}

      ${createCategory(
        "latePayment",
        "السداد",
        "تأخرت في السداد",
        "عندي دفعة مستحقة أو مهلة سداد"
      )}

      ${createCategory(
        "renewalRefusal",
        "التجديد",
        "المؤجر يرفض التجديد",
        "أرغب في الاستمرار لكن المؤجر لا يريد"
      )}

      ${createCategory(
        "nonRenewal",
        "التجديد",
        "ما أبي أجدد",
        "أريد عدم الاستمرار بعد نهاية العقد"
      )}

      ${createCategory(
        "unregistered",
        "التوثيق",
        "العقد غير موثق",
        "العقد غير مسجل في شبكة إيجار"
      )}

      ${createCategory(
        "objection",
        "التوثيق",
        "اعتراض على بيانات العقد",
        "تم تسجيل بيانات أحتاج مراجعتها"
      )}

      ${createCategory(
        "maintenance",
        "الصيانة",
        "عندي مشكلة صيانة",
        "أحتاج أفهم نوع المشكلة ومسؤولية الصيانة"
      )}

      ${createCategory(
        "deposit",
        "الخروج",
        "مبلغ الضمان",
        "أخليت الوحدة وأحتاج أفهم مسار مبلغ الضمان"
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


/* بدء السيناريو */

function startScenario(id) {

  currentScenario =
    scenarios[id];


  currentStep =
    0;


  answers =
    {};


  showingResult =
    false;


  restartButton.classList.remove(
    "is-hidden"
  );


  renderStep(
    true
  );

}


/* عرض السؤال */

function renderStep(
  shouldScroll = true
) {

  showingResult =
    false;


  const steps =
    getActiveSteps();


  if (
    currentStep >= steps.length
  ) {
    currentStep =
      Math.max(
        0,
        steps.length - 1
      );
  }


  const step =
    steps[currentStep];


  if (
    !step
  ) {
    renderResult();

    return;
  }


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
            createOption(
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


            const updatedSteps =
              getActiveSteps();


            if (
              currentStep <
              updatedSteps.length - 1
            ) {

              currentStep += 1;

              renderStep(
                true
              );

            } else {

              renderResult(
                true
              );

            }

          }
        );

      }
    );


  if (
    shouldScroll
  ) {
    scrollToQuestion();
  }

}


/* عرض النتيجة */

function renderResult(
  shouldScroll = true
) {

  showingResult =
    true;


  const result =
    currentScenario.evaluate(
      answers
    );


  const steps =
    getActiveSteps();


  stepTitle.textContent =
    "ملخص حالتك";


  stepCurrent.textContent =
    String(
      steps.length + 1
    );


  stepTotal.textContent =
    String(
      steps.length + 1
    );


  progressBar.style.width =
    "100%";


  backButton.disabled =
    false;


  stepContent.innerHTML = `
    <div class="result-layout">

      <section class="result-summary">

        <span class="result-label">
          ${result.label}
        </span>

        <h4>
          ${result.title}
        </h4>

        <p>
          ${result.body}
        </p>

        <div class="result-disclaimer">
          ${result.disclaimer}
        </div>

      </section>


      <section class="result-details">

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


        <div class="result-meta">

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
              آخر مراجعة
            </span>

            <strong>
              ${result.source.reviewed}
            </strong>

          </div>

        </div>


        <a
          class="result-source"
          href="${result.source.url}"
          target="_blank"
          rel="noreferrer"
        >
          تحقق من المصدر الرسمي ↗
        </a>

      </section>

    </div>
  `;


  if (
    shouldScroll
  ) {
    scrollToQuestion();
  }

}


/* زر السابق */

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

      const steps =
        getActiveSteps();


      currentStep =
        Math.max(
          0,
          steps.length - 1
        );


      renderStep(
        true
      );


      return;
    }


    if (
      currentStep > 0
    ) {

      currentStep -= 1;

      renderStep(
        true
      );


      return;
    }


    renderScenarioPicker();

    scrollToQuestion();

  }
);


/* إعادة البداية */

restartButton.addEventListener(
  "click",
  () => {

    renderScenarioPicker();

    scrollToQuestion();

  }
);


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

    const isOpen =
      document.body.classList.toggle(
        "menu-open"
      );


    menuButton.setAttribute(
      "aria-expanded",
      String(
        isOpen
      )
    );


    mobileMenu.setAttribute(
      "aria-hidden",
      String(
        !isOpen
      )
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


/* التنقل الداخلي */

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


    target.scrollIntoView({
      behavior:
        reducedMotion
          ? "auto"
          : "smooth",

      block:
        "start"
    });


    closeMenu();

  }
);


/* ظهور العناصر */

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
        threshold:
          0.08,

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


/* تحديد القسم الحالي */

const navigationLinks =
  document.querySelectorAll(
    '.desktop-nav a[href^="#"]'
  );


const observedSections =
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
    .filter(
      Boolean
    );


const navigationObserver =
  new IntersectionObserver(
    entries => {

      entries.forEach(
        entry => {

          if (
            !entry.isIntersecting
          ) {
            return;
          }


          navigationLinks.forEach(
            link => {

              link.classList.toggle(
                "is-active",
                link.getAttribute(
                  "href"
                ) ===
                  `#${entry.target.id}`
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


observedSections.forEach(
  section => {

    navigationObserver.observe(
      section
    );

  }
);


/* تحريك مسارات البطاقات */

function moveRail(
  railId,
  direction
) {

  const rail =
    document.getElementById(
      railId
    );


  if (
    !rail
  ) {
    return;
  }


  const amount =
    Math.min(
      rail.clientWidth * 0.78,
      520
    );


  rail.scrollBy({
    left:
      direction * amount,

    behavior:
      reducedMotion
        ? "auto"
        : "smooth"
  });

}


document
  .querySelectorAll(
    "[data-rail-next]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          moveRail(
            button.dataset.railNext,
            -1
          );

        }
      );

    }
  );


document
  .querySelectorAll(
    "[data-rail-prev]"
  )
  .forEach(
    button => {

      button.addEventListener(
        "click",
        () => {

          moveRail(
            button.dataset.railPrev,
            1
          );

        }
      );

    }
  );


/* التشغيل */

renderScenarioPicker();
