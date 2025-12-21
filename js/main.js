// 参加方法
//　スクロールアニメーションの制御
const observeSteps = () => {
  const targets = document.querySelectorAll('.step-label, .step-text, .step-img');
  
  const options = {
    root: null, // ビューポートを基準にする
    rootMargin: '0px',
    threshold: 0.2
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // 一度表示されたら監視を解除（何度も動かしたくない場合）
        observer.unobserve(entry.target);
      }
    });
  }, options);

  targets.forEach((target) => {
    observer.observe(target);
  });
};

// ページ読み込み完了時に実行
window.addEventListener('DOMContentLoaded', observeSteps);


// トップページ　時間選択

const patternA = {
  "11:00": "◯",
  "12:00": "×",
  "13:00": "◯",
  "14:00": "◯",
  "15:00": "×",
  "16:00": "◯",
  "17:00": "◯",
  "18:00": "×",
  "19:00": "◯"
};
const patternB = {
  "11:00": "◯",
  "12:00": "◯",
  "13:00": "◯",
  "14:00": "×",
  "15:00": "◯",
  "16:00": "◯",
  "17:00": "×",
  "18:00": "◯",
  "19:00": "◯"
};
const patternC = {
  "11:00": "×",
  "12:00": "×",
  "13:00": "◯",
  "14:00": "◯",
  "15:00": "×",
  "16:00": "×",
  "17:00": "◯",
  "18:00": "◯",
  "19:00": "×"
};
const patternD = {
  "11:00": "◯",
  "12:00": "◯",
  "13:00": "◯",
  "14:00": "◯",
  "15:00": "◯",
  "16:00": "◯",
  "17:00": "◯",
  "18:00": "◯",
  "19:00": "◯"
};
const reserveData = {
  "2025-11-11": patternA,
  "2025-11-12": patternB,
  "2025-11-13": patternC,
  "2025-11-14": patternA,
  "2025-11-15": patternD,
  "2025-11-16": patternB,
  "2025-11-17": patternA,
  "2025-11-18": patternC,
  "2025-11-19": patternD,
  "2025-11-20": patternA,
  "2025-11-21": patternB,
  "2025-11-22": patternC,
  "2025-11-23": patternA,
  "2025-11-24": patternD,
  "2025-11-25": patternB,
  "2025-11-26": patternC,
  "2025-11-27": patternA
};
// -----------------------
// 時間リストを書き換える処理
// -----------------------
const select = document.getElementById("date-select");
const rows = document.querySelectorAll(".time-row");

if (select && rows.length) {
function updateTimeList(date) {
  const pattern = reserveData[date];

  rows.forEach(row => {
    const time = row.querySelector("span").textContent;
    const statusEl = row.querySelector(".status");

    const mark = pattern[time]; // ◯ or ×

    statusEl.textContent = mark;

    statusEl.classList.remove("available", "full");
    if (mark === "◯") {
      statusEl.classList.add("available");
    } else {
      statusEl.classList.add("full");
    }
  });
}

// 初期表示
updateTimeList(select.value);

// 日付変更時
select.addEventListener("change", () => {
  updateTimeList(select.value);
});
}

// ===========================
// FAQ 開閉
// ===========================
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const btn = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const icon = item.querySelector(".faq-icon");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    // 一旦すべて閉じる（アコーディオン方式の場合）
    // faqItems.forEach(i => {
    //   i.classList.remove("open");
    //   i.querySelector(".faq-answer").style.height = 0;
    //   i.querySelector(".faq-icon").textContent = "▶";
    // });

    if (!isOpen) {
      // 開く処理
      item.classList.add("open");
      answer.style.height = answer.scrollHeight + "px";
      icon.textContent = "▼";  // ← 下向きに変更
    } else {
      // 閉じる処理
      item.classList.remove("open");
      answer.style.height = 0;
      icon.textContent = "▶";  // ← 右向きに変更
    }
  });
});

// ====================================
// 予約フォーム バリデーション
// ====================================
const form = document.getElementById("reserve-form");
const messageEl = document.getElementById("message");

if (form) {
  // ▼ 入力中 / 選択中にリアルタイムでエラー表示
  form.addEventListener("input", validateForm);
  form.addEventListener("change", validateForm);

  function validateForm() {
    // --- 基本項目 -----------------
    const name = form.elements["name"];
    const email = form.elements["email"];
    const tel = form.elements["tel"];
    const telPattern = /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/;

    name.setCustomValidity("");
    email.setCustomValidity("");
    tel.setCustomValidity("");

    if (name.value.trim() === "") {
      name.setCustomValidity("お名前を入力してください。");
    }

    if (email.value.trim() === "") {
      email.setCustomValidity("メールアドレスを入力してください。");
    }

    if (tel.value.trim() === "") {
      tel.setCustomValidity("電話番号を入力してください。");
    } else if (!telPattern.test(tel.value)) {
      tel.setCustomValidity("電話番号は正しい形式で入力してください。");
    }

    // --- 第1希望（日付 & 時間） ----------------------
    const date1 = form.elements["date1"];
    const time1 = form.elements["time1"];

    date1.setCustomValidity("");
    time1.setCustomValidity("");

    if (!date1.value || date1.value === "希望日を選択") {
      date1.setCustomValidity("第1希望の日付を選択してください。");
    }
    if (!time1.value || time1.value === "時間を選択") {
      time1.setCustomValidity("第1希望の時間を選択してください。");
    }

    // --- 持ち込み点数（0・マイナス不可） ----------------------
    const carryField = form.querySelector(".carry-row input");
    carryField.setCustomValidity("");

    if (carryField.value.trim() === "") {
      carryField.setCustomValidity("持ち込み点数を入力してください。");
    } else if (Number(carryField.value) <= 0) {
      carryField.setCustomValidity("1以上の数値を入力してください。");
    }

    // --- 来店人数（1以上のみ） ------------------------------
    const peopleField = form.querySelector(".people-count input");
    peopleField.setCustomValidity("");

    if (peopleField.value.trim() === "") {
      peopleField.setCustomValidity("来店人数を入力してください。");
    } else if (Number(peopleField.value) < 1) {
      peopleField.setCustomValidity("1人以上で入力してください。");
    }
  }

  // ====================================
  // 送信処理
  // ====================================
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    validateForm(); // ← 最終チェック

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // --- 送信 ---
    messageEl.textContent = "送信中です…";
    messageEl.style.color = "#555";
    messageEl.style.display = "block";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          messageEl.textContent = "送信が完了しました。ご予約ありがとうございます！";
          messageEl.style.color = "#1c2430";
          form.reset();

          const submitBtn = form.querySelector(".form-submit-btn");
          if (submitBtn) submitBtn.style.display = "none";
        } else {
          messageEl.textContent = "送信に失敗しました。もう一度お試しください。";
          messageEl.style.color = "red";
        }
      })
      .catch(() => {
        messageEl.textContent = "通信エラーが発生しました。";
        messageEl.style.color = "red";
      });
  });
}


// ===============================
// 複数希望で「同じ日時」を選べないようにする処理
// ===============================

const dateSelects = [
  document.querySelector('[name="date1"]'),
  document.querySelector('[name="date2"]'),
  document.querySelector('[name="date3"]')
];

const timeSelects = [
  document.querySelector('[name="time1"]'),
  document.querySelector('[name="time2"]'),
  document.querySelector('[name="time3"]')
];

function updateDisabledOptions() {
  const selectedPairs = [];

  dateSelects.forEach((dateSelect, index) => {
    const timeSelect = timeSelects[index];
    const date = dateSelect.value;
    const time = timeSelect.value;

    if (date !== "希望日を選択" && time !== "時間を選択") {
      selectedPairs.push(`${date}_${time}`);
    }
  });

  dateSelects.forEach((dateSelect, i) => {
    timeSelects[i].querySelectorAll("option").forEach(option => {
      option.disabled = false;
    });
  });

  dateSelects.forEach((dateSelect, i) => {
    timeSelects[i].querySelectorAll("option").forEach(option => {
      const date = dateSelect.value;
      const pair = `${date}_${option.value}`;

      if (selectedPairs.includes(pair)) {
        option.disabled = true;
      }
    });
  });
}

// 日付セレクト
if (dateSelects && dateSelects.length > 0) {
  dateSelects.forEach(select => {
    if (select) {
      select.addEventListener("change", updateDisabledOptions);
    }
  });
}

// 時間セレクト
if (timeSelects && timeSelects.length > 0) {
  timeSelects.forEach(select => {
    if (select) {
      select.addEventListener("change", updateDisabledOptions);
    }
  });
}


// =============================
// フェードイン（スクロール）
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll('.fade-target');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target); // 一度だけ発火
      }
    });
  }, { threshold: 0.2 });

  targets.forEach(target => observer.observe(target));
});
