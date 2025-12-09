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

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {
  const btn = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");

  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    if (isOpen) {
      answer.style.height = "0px";
      item.classList.remove("open");
    } else {
      answer.style.height = answer.scrollHeight + 20 + "px";
      item.classList.add("open");
    }
  });
});


const form = document.getElementById("reserve-form");
const messageEl = document.getElementById("message");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

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

    // --- 第1希望の必須チェック ------------------
    const date1 = form.elements["date1"];
    const time1 = form.elements["time1"];

    date1.setCustomValidity("");
    time1.setCustomValidity("");

    if (date1.value === "希望日を選択") {
     date1.setCustomValidity("第1希望の日付を選択してください。");
    }

    if (time1.value === "時間を選択") {
     time1.setCustomValidity("第1希望の時間を選択してください。");
    }
// -------------------------------------------


    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    messageEl.textContent = "送信中です…";
    messageEl.style.color = "#555";
    messageEl.style.display = "block";

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
    .then(response => {
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

dateSelects.forEach(select => {
  select.addEventListener("change", updateDisabledOptions);
});

timeSelects.forEach(select => {
  select.addEventListener("change", updateDisabledOptions);
});


// =============================
// フェードイン（スクロール）
// =============================
const fadeTargets = document.querySelectorAll('.fade-target');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, {
  threshold: 0.2 // 20%見えたら発火
});

fadeTargets.forEach(target => observer.observe(target));
