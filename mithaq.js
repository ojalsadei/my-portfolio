const SOURCE_URLS = {
  rules: "https://rega.gov.sa/%D8%A7%D9%84%D8%A3%D9%86%D8%B8%D9%85%D8%A9-%D9%88%D8%A7%D9%84%D9%82%D8%B1%D8%A7%D8%B1%D8%A7%D8%AA/%D8%A7%D9%84%D8%A3%D9%86%D8%B8%D9%85%D8%A9-%D9%88%D8%A7%D9%84%D9%84%D9%88%D8%A7%D8%A6%D8%AD-%D9%88%D8%A7%D9%84%D8%A3%D8%AF%D9%84%D8%A9/%D8%A7%D9%84%D8%A3%D9%86%D8%B8%D9%85%D8%A9/%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%D8%A9-%D8%A8%D8%B6%D8%A8%D8%B7-%D8%A7%D9%84%D8%B9%D9%84%D8%A7%D9%82%D8%A9-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%85%D8%A4%D8%AC%D8%B1-%D9%88%D8%A7%D9%84%D9%85%D8%B3%D8%AA%D8%A3%D8%AC%D8%B1/",

  news: "https://rega.gov.sa/media-center/%D8%A7%D9%84%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1-%D9%88%D8%A7%D9%84%D8%A5%D8%B9%D9%84%D8%A7%D9%86%D8%A7%D8%AA/%D8%A7%D9%84%D9%85%D9%88%D8%A7%D9%81%D9%82%D8%A9-%D8%B9%D9%84%D9%89-%D8%A7%D9%84%D8%A3%D8%AD%D9%83%D8%A7%D9%85-%D8%A7%D9%84%D9%86%D8%B8%D8%A7%D9%85%D9%8A%D8%A9-%D8%A7%D9%84%D8%AE%D8%A7%D8%B5%D8%A9-%D8%A8%D8%B6%D8%A8%D8%B7-%D8%A7%D9%84%D8%B9%D9%84%D8%A7%D9%82%D8%A9-%D8%A8%D9%8A%D9%86-%D8%A7%D9%84%D9%85-%D8%A4%D8%AC%D8%B1-%D9%88%D8%A7%D9%84%D9%85-%D8%B3%D8%AA%D8%A3%D8%AC-%D8%B1/",

  ejar: "https://rega.gov.sa/rega-services/platforms/ejar/"
};


/* ==========================================
   SCENARIOS
========================================== */

const scenarios = {

  rentIncrease: {
    title: "زيادة الإيجار",

    steps: [
      {
        title: "هل العقار داخل النطاق العمراني لمدينة الرياض؟",
        key: "urban",

        options: [
          [
            "yes",
            "نعم",
            "العقار داخل النطاق العمراني"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج التحقق من النطاق"
          ],

          [
            "no",
            "لا",
            "العقار خارج النطاق العمراني"
          ]
        ]
      },

      {
        title: "هل الحالة تتعلق بزيادة سنوية في قيمة الإيجار؟",
        key: "annual",

        options: [
          [
            "yes",
            "نعم",
            "المؤجر يريد رفع القيمة الإيجارية السنوية"
          ],

          [
            "no",
            "لا",
            "المشكلة مختلفة"
          ]
        ]
      },

      {
        title: "هل حدثت الزيادة بعد 25 سبتمبر 2025؟",
        key: "afterDate",

        options: [
          [
            "yes",
            "نعم",
            "الحالة ضمن فترة سريان الأحكام الحالية"
          ],

          [
            "no",
            "لا",
            "الحالة أقدم من تاريخ السريان"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج مراجعة تاريخ الحالة"
          ]
        ]
      }
    ],

    evaluate: (answers) => {

      if (
        answers.urban === "yes" &&
        answers.annual === "yes" &&
        answers.afterDate === "yes"
      ) {

        return {
          badge: "BR-001",

          title:
            "وجدنا قاعدة مرتبطة مباشرة بحالتك",

          body:
            "بناءً على إجاباتك، تقع الحالة ضمن نطاق الأحكام الخاصة بإيقاف الزيادة السنوية لقيمة الأجرة داخل النطاق العمراني لمدينة الرياض.",

          reasons: [
            "العقار داخل النطاق العمراني لمدينة الرياض",
            "المشكلة مرتبطة بزيادة سنوية في الإيجار",
            "تاريخ الحالة بعد 25 سبتمبر 2025"
          ],

          next:
            "راجع بيانات عقدك في إيجار، ثم ارجع إلى المصدر الرسمي للتحقق من تفاصيل الحالة والمسار المناسب.",

          source:
            SOURCE_URLS.news
        };
      }


      if (
        answers.urban === "unknown" ||
        answers.afterDate === "unknown"
      ) {

        return {
          badge: "NEEDS CHECK",

          title:
            "نحتاج معلومة إضافية قبل تطبيق القاعدة",

          body:
            "القاعدة مرتبطة بالنطاق العمراني وتاريخ السريان، لذلك لا ينبغي إعطاء نتيجة حاسمة قبل التحقق من هذين المتغيرين.",

          reasons: [
            "النطاق المكاني أو التاريخ غير مؤكد",
            "النتيجة تتغير بحسب هذه المدخلات"
          ],

          next:
            "تحقق من موقع العقار وتاريخ الحالة، ثم أعد التقييم.",

          source:
            SOURCE_URLS.news
        };
      }


      return {
        badge: "OUT OF SCOPE",

        title:
          "لا يمكن تطبيق BR-001 بهذه المدخلات",

        body:
          "النتيجة الحالية لا تحقق جميع شروط القاعدة الخاصة بإيقاف الزيادة السنوية داخل النطاق العمراني لمدينة الرياض.",

        reasons: [
          "واحد أو أكثر من شروط القاعدة غير متحقق",
          "قد توجد قواعد أخرى تحتاج تقييمًا منفصلًا"
        ],

        next:
          "راجع الأحكام الرسمية أو الخدمة المناسبة في إيجار بحسب تفاصيل الحالة.",

        source:
          SOURCE_URLS.rules
      };

    }
  },


  renewalRefusal: {
    title: "رفض التجديد",

    steps: [
      {
        title: "هل العقار داخل النطاق العمراني لمدينة الرياض؟",
        key: "urban",

        options: [
          [
            "yes",
            "نعم",
            "داخل النطاق العمراني"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج التحقق"
          ],

          [
            "no",
            "لا",
            "خارج النطاق العمراني"
          ]
        ]
      },

      {
        title: "هل أنت راغب في تجديد العقد؟",
        key: "tenantWantsRenewal",

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
        title: "وش السبب اللي ذكره المؤجر لعدم التجديد؟",
        key: "reason",

        options: [
          [
            "nonpayment",
            "عدم السداد",
            "ذكر أن هناك مبالغ غير مسددة"
          ],

          [
            "structural",
            "عيوب هيكلية",
            "ذكر وجود مشكلة سلامة بتقرير فني"
          ],

          [
            "personal",
            "استخدام شخصي",
            "ذكر أنه يحتاج العقار للاستخدام الشخصي"
          ],

          [
            "other",
            "سبب آخر",
            "السبب مختلف عن الحالات المذكورة"
          ],

          [
            "unknown",
            "ما وضح السبب",
            "لم يذكر سببًا واضحًا"
          ]
        ]
      }
    ],

    evaluate: (answers) => {

      if (
        answers.urban === "yes" &&
        answers.tenantWantsRenewal === "yes"
      ) {

        const listedReasons = [
          "nonpayment",
          "structural",
          "personal"
        ];


        const isListedReason =
          listedReasons.includes(
            answers.reason
          );


        if (isListedReason) {

          return {
            badge: "BR-005",

            title:
              "السبب المذكور يقع ضمن الحالات الواردة رسميًا",

            body:
              "المصدر الرسمي يذكر حالات محددة يمكن فيها للمؤجر عدم التجديد داخل النطاق العمراني للرياض مع رغبة المستأجر بالتجديد.",

            reasons: [
              "العقار داخل النطاق العمراني للرياض",
              "المستأجر يرغب في التجديد",
              "السبب المختار من الحالات المذكورة في المصدر الرسمي"
            ],

            next:
              "هذا لا يحسم صحة الحالة تلقائيًا؛ يلزم التحقق من تحقق شروط السبب ومستنداته وتفاصيل العقد عبر القنوات الرسمية.",

            source:
              SOURCE_URLS.ejar
          };
        }


        return {
          badge: "BR-005",

          title:
            "الحالة تستحق مراجعة رسمية",

          body:
            "السبب الذي اخترته ليس من الأسباب الثلاثة المبينة في صفحة إيجار ضمن الحالات المذكورة لامتناع المؤجر عن التجديد في الرياض.",

          reasons: [
            "العقار داخل النطاق العمراني للرياض",
            "المستأجر يرغب في التجديد",
            "السبب المختار ليس من الأسباب الثلاثة الظاهرة في المصدر"
          ],

          next:
            "راجع المصدر الرسمي والخدمة المناسبة في إيجار أو الهيئة، لأن تفاصيل الحالة أو أي حالات أخرى معتمدة قد تؤثر على النتيجة.",

          source:
            SOURCE_URLS.ejar
        };
      }


      return {
        badge: "NEEDS CONTEXT",

        title:
          "الحالة تحتاج مسارًا مختلفًا",

        body:
          "قاعدة BR-005 في هذا النموذج مرتبطة بالمستأجر الراغب في التجديد داخل النطاق العمراني لمدينة الرياض.",

        reasons: [
          "واحد أو أكثر من شروط نطاق القاعدة غير متحقق"
        ],

        next:
          "راجع قواعد التجديد العامة أو أعد التقييم بمعلومات أدق.",

        source:
          SOURCE_URLS.rules
      };

    }
  },


  unregistered: {
    title: "العقد غير موثق",

    steps: [
      {
        title:
          "هل العقد غير مسجل حاليًا في شبكة إيجار؟",

        key:
          "unregistered",

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
          "recentlyRegistered",

        options: [
          [
            "no",
            "لا",
            "ما زال غير مسجل"
          ],

          [
            "yes",
            "نعم",
            "تم التسجيل وأحتاج فهم الاعتراض"
          ]
        ]
      }
    ],

    evaluate: (answers) => {

      if (
        answers.unregistered === "yes" &&
        answers.recentlyRegistered === "no"
      ) {

        return {
          badge: "BR-002",

          title:
            "يوجد مسار رسمي لتسجيل العقد",

          body:
            "الأحكام تنص على وجوب تقدم المؤجر بطلب تسجيل العقد غير المسجل، كما تمنح المستأجر حق طلب تسجيله.",

          reasons: [
            "العقد غير مسجل في شبكة إيجار",
            "المستأجر يملك حق طلب التسجيل بحسب الأحكام"
          ],

          next:
            "راجع خدمة إيجار والإجراءات الرسمية المطلوبة لتسجيل العقد.",

          source:
            SOURCE_URLS.rules
        };
      }


      if (
        answers.recentlyRegistered === "yes"
      ) {

        return {
          badge: "BR-003",

          title:
            "قد تكون مهلة الاعتراض مهمة لحالتك",

          body:
            "بعد التسجيل، يحق للطرف الآخر الاعتراض أمام الهيئة على بيانات العقد خلال 60 يومًا من تاريخ إبلاغه بالتسجيل.",

          reasons: [
            "تم تسجيل العقد",
            "الأحكام تربط الاعتراض بمدة 60 يومًا من الإبلاغ"
          ],

          next:
            "تحقق من تاريخ الإبلاغ وبيانات العقد، ثم راجع الإجراء الرسمي للاعتراض عند الحاجة.",

          source:
            SOURCE_URLS.rules
        };
      }


      return {
        badge: "VERIFY",

        title:
          "تحقق أولًا من حالة التسجيل",

        body:
          "لا يمكن تحديد مسار التسجيل أو الاعتراض قبل التأكد من حالة العقد في شبكة إيجار.",

        reasons: [
          "حالة التسجيل غير مؤكدة"
        ],

        next:
          "تحقق من حسابك أو بيانات العقد في إيجار ثم أعد التقييم.",

        source:
          SOURCE_URLS.ejar
      };

    }
  },


  tenantNonRenewal: {
    title: "ما أبي أجدد",

    steps: [
      {
        title:
          "هل عقدك ما زال قائمًا وتريد إشعار الطرف الآخر بعدم التجديد؟",

        key:
          "active",

        options: [
          [
            "yes",
            "نعم",
            "أريد عدم التجديد عند انتهاء المدة"
          ],

          [
            "unknown",
            "غير متأكد",
            "أحتاج مراجعة وضع العقد"
          ]
        ]
      },

      {
        title:
          "هل باقي على نهاية العقد 60 يومًا أو أكثر؟",

        key:
          "days",

        options: [
          [
            "yes",
            "نعم",
            "60 يومًا أو أكثر"
          ],

          [
            "no",
            "لا",
            "أقل من 60 يومًا"
          ],

          [
            "unknown",
            "لا أعرف",
            "أحتاج حساب المدة"
          ]
        ]
      }
    ],

    evaluate: (answers) => {

      if (
        answers.active === "yes" &&
        answers.days === "yes"
      ) {

        return {
          badge: "BR-004",

          title:
            "التوقيت متوافق مبدئيًا مع قاعدة الإشعار",

          body:
            "القاعدة العامة تنص على التجديد التلقائي ما لم يُشعر أحد الطرفين الآخر بعدم الرغبة في التجديد قبل 60 يومًا على الأقل من انتهاء العقد، مع وجود استثناءات.",

          reasons: [
            "العقد ما زال قائمًا",
            "المتبقي على النهاية 60 يومًا أو أكثر"
          ],

          next:
            "تحقق من عقدك والاستثناءات والإجراء الصحيح لإرسال الإشعار عبر القناة الرسمية.",

          source:
            SOURCE_URLS.rules
        };
      }


      if (
        answers.days === "no"
      ) {

        return {
          badge: "BR-004",

          title:
            "المدة المتبقية أقل من الحد المذكور في القاعدة العامة",

          body:
            "وفق القاعدة العامة، إشعار عدم الرغبة في التجديد يكون قبل 60 يومًا على الأقل من نهاية العقد، مع وجود استثناءات يجب التحقق منها.",

          reasons: [
            "المتبقي أقل من 60 يومًا"
          ],

          next:
            "راجع العقد والاستثناءات والقنوات الرسمية لمعرفة أثر التوقيت على حالتك.",

          source:
            SOURCE_URLS.rules
        };
      }


      return {
        badge: "VERIFY",

        title:
          "نحتاج معرفة تاريخ نهاية العقد",

        body:
          "القرار هنا يعتمد مباشرة على المدة المتبقية حتى انتهاء العقد.",

        reasons: [
          "عدد الأيام المتبقية غير مؤكد"
        ],

        next:
          "تحقق من تاريخ انتهاء العقد واحسب المدة قبل إعادة التقييم.",

        source:
          SOURCE_URLS.rules
      };

    }
  }

};


/* ==========================================
   ELEMENTS
========================================== */

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


const backBtn =
  document.getElementById(
    "backBtn"
  );


const restartBtn =
  document.getElementById(
    "restartBtn"
  );


let currentScenario = null;
let currentStep = 0;
let answers = {};
let showingResult = false;


/* ==========================================
   SCENARIO PICKER
========================================== */

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
    "4";


  progressBar.style.width =
    "18%";


  backBtn.disabled =
    true;


  restartBtn.classList.add(
    "hidden"
  );


  stepContent.innerHTML = `
    <div class="options">

      ${scenarioOption(
        "rentIncrease",
        "زيادة الإيجار",
        "المؤجر يريد رفع القيمة الإيجارية"
      )}

      ${scenarioOption(
        "renewalRefusal",
        "رفض التجديد",
        "المؤجر لا يرغب في تجديد العقد"
      )}

      ${scenarioOption(
        "unregistered",
        "العقد غير موثق",
        "العقد غير مسجل في شبكة إيجار"
      )}

      ${scenarioOption(
        "tenantNonRenewal",
        "ما أبي أجدد",
        "أريد إنهاء العلاقة عند انتهاء العقد"
      )}

    </div>
  `;


  document
    .querySelectorAll(
      "[data-scenario]"
    )
    .forEach(
      (button) => {

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


function scenarioOption(
  id,
  title,
  description
) {

  return `
    <button
      class="option"
      type="button"
      data-scenario="${id}"
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


/* ==========================================
   START SCENARIO
========================================== */

function startScenario(id) {

  currentScenario =
    scenarios[id];


  currentStep =
    0;


  answers =
    {};


  showingResult =
    false;


  restartBtn.classList.remove(
    "hidden"
  );


  renderStep();

}


/* ==========================================
   RENDER QUESTION
========================================== */

function renderStep() {

  showingResult =
    false;


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


  backBtn.disabled =
    currentStep === 0;


  stepContent.innerHTML = `
    <div class="options">

      ${step.options
        .map(
          (
            [
              value,
              title,
              description
            ]
          ) => `

            <button
              class="option"
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

          `
        )
        .join("")}

    </div>
  `;


  document
    .querySelectorAll(
      "[data-value]"
    )
    .forEach(
      (button) => {

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

              currentStep +=
                1;


              renderStep();

            } else {

              renderResult();

            }

          }
        );

      }
    );

}


/* ==========================================
   RENDER RESULT
========================================== */

function renderResult() {

  showingResult =
    true;


  const result =
    currentScenario.evaluate(
      answers
    );


  stepTitle.textContent =
    "نتيجة التقييم";


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


  backBtn.disabled =
    false;


  stepContent.innerHTML = `
    <div class="result-box">

      <div class="result-status">

        <span class="badge">
          ${result.badge}
        </span>

        <h4>
          ${result.title}
        </h4>

        <p>
          ${result.body}
        </p>

      </div>


      <div class="result-detail">

        <h4>
          ليش ظهرت هذه النتيجة؟
        </h4>


        <ul class="result-reasons">

          ${result.reasons
            .map(
              (
                reason
              ) => `

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


        <a
          class="result-link"
          href="${result.source}"
          target="_blank"
          rel="noreferrer"
        >
          فتح المصدر الرسمي ↗
        </a>

      </div>

    </div>
  `;

}


/* ==========================================
   BACK / RESTART
========================================== */

backBtn.addEventListener(
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

      currentStep -=
        1;


      renderStep();

    } else {

      renderScenarioPicker();

    }

  }
);


restartBtn.addEventListener(
  "click",
  () => {

    renderScenarioPicker();

  }
);


/* ==========================================
   INITIALIZE NAVIGATOR
========================================== */

renderScenarioPicker();


/* ==========================================
   MOBILE NAV
========================================== */

const menuBtn =
  document.getElementById(
    "menuBtn"
  );


const mobileNav =
  document.getElementById(
    "mobileNav"
  );


function closeMenu() {

  document.body.classList.remove(
    "menu-open"
  );


  menuBtn?.setAttribute(
    "aria-expanded",
    "false"
  );


  mobileNav?.setAttribute(
    "aria-hidden",
    "true"
  );

}


menuBtn?.addEventListener(
  "click",
  () => {

    const open =
      document.body.classList.toggle(
        "menu-open"
      );


    menuBtn.setAttribute(
      "aria-expanded",
      String(open)
    );


    mobileNav.setAttribute(
      "aria-hidden",
      String(!open)
    );

  }
);


mobileNav
  ?.querySelectorAll(
    "a"
  )
  .forEach(
    (link) => {

      link.addEventListener(
        "click",
        () => {

          closeMenu();

        }
      );

    }
  );


document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape"
    ) {

      closeMenu();

    }

  }
);


/* ==========================================
   REDUCED MOTION
========================================== */

const reducedMotion =
  window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


/* ==========================================
   REVEAL ON SCROLL
========================================== */

const reveals =
  document.querySelectorAll(
    ".reveal"
  );


if (
  reducedMotion
) {

  reveals.forEach(
    (element) => {

      element.classList.add(
        "visible"
      );

    }
  );

} else {

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              !entry.isIntersecting
            ) {
              return;
            }


            entry.target.classList.add(
              "visible"
            );


            observer.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.1,

        rootMargin:
          "0px 0px -50px 0px"
      }
    );


  reveals.forEach(
    (element) => {

      observer.observe(
        element
      );

    }
  );

}


/* ==========================================
   SMOOTH INTERNAL ANCHORS
========================================== */

document.addEventListener(
  "click",
  (event) => {

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
