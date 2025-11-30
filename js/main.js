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


//予約完了　
document.addEventListener("DOMContentLoaded", function ( ){
 const form = document.getElementById("reserve-form");
 const thanksMessage = document.querySelector(".form-thanks");

form.addEventListener("submit", function (e) {
   e.preventDefault();

  const formData = new FormData(form);

  fetch(form.action, {
    method: "POST",
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      form.reset();                // フォーム初期化
      form.style.display = "none"; // フォーム非表示
      thanksMessage.style.display = "block"; // 完了メッセージ表示
    } else {
      alert("送信に失敗しました。もう一度お試しください。");
    }
  }).catch(error => {
    alert("通信エラーが発生しました。");
  });
});
});
