(function () {
  function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function initQuiz(data) {
    if (!data) {
      var node = document.getElementById("quiz-data");
      if (node) data = JSON.parse(node.textContent);
    }
    if (!data || !data.questions) return;
    window.__QUIZ__ = data;

    var form = document.getElementById("quiz-form");
    var results = document.getElementById("results");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      grade(data, form, results);
    });

    var retry = document.getElementById("quiz-retry");
    if (retry) {
      retry.addEventListener("click", function () {
        resetQuiz(form, results);
      });
    }
  }

  function grade(data, form, results) {
    var official = 0, correct = 0, answered = 0, suggested = 0, skipped = 0;

    data.questions.forEach(function (q, i) {
      var card = document.getElementById("q-" + i);
      if (!card) return;
      card.classList.remove("correct", "incorrect", "unscored");
      $$(".opt", card).forEach(function (el) {
        el.classList.remove("is-correct", "is-chosen-wrong");
      });
      var fb = card.querySelector(".q-feedback");
      if (fb) fb.remove();

      var chosen = form.querySelector('input[name="q' + i + '"]:checked');
      var textAns = form.querySelector('textarea[name="q' + i + '"]');
      if (chosen || (textAns && textAns.value.trim())) answered += 1;

      var feedback = document.createElement("div");
      feedback.className = "q-feedback";

      if (q.answerKnown === true && typeof q.correctIndex === "number") {
        official += 1;
        var ok = chosen && Number(chosen.value) === q.correctIndex;
        if (ok) {
          correct += 1;
          card.classList.add("correct");
          feedback.classList.add("ok");
          feedback.textContent = "Correct · Official key";
        } else {
          card.classList.add("incorrect");
          feedback.classList.add("bad");
          feedback.textContent = "Incorrect. Official key: " + (q.correctLabel || "");
        }
        var right = card.querySelector('.opt[data-index="' + q.correctIndex + '"]');
        if (right) right.classList.add("is-correct");
        if (chosen && Number(chosen.value) !== q.correctIndex) {
          var wrong = chosen.closest(".opt");
          if (wrong) wrong.classList.add("is-chosen-wrong");
        }
        card.appendChild(feedback);
      } else if (q.hasSuggested || typeof q.suggestedIndex === "number" || card.querySelector("details.suggest-spoiler")) {
        suggested += 1;
        card.classList.add("unscored");
        // Do not mark options or open the spoiler; suggested answers stay hidden until the user opens them.
      } else {
        skipped += 1;
        card.classList.add("unscored");
        feedback.classList.add("na");
        feedback.textContent = "This item is not a complete multiple-choice question in the source materials and is not scored.";
        card.appendChild(feedback);
      }
    });

    results.hidden = false;
    var pct = official ? Math.round((correct / official) * 100) : null;
    var html = "<h2>Results</h2>";
    if (official) {
      html += "<div class=\"score\">" + correct + " / " + official + "</div>";
      html += "<p>" + pct + "% of items that have an official answer key.</p>";
    } else {
      html += "<div class=\"score\">Practice</div>";
      html += "<p>This test has no official instructor key, so a score is not calculated.</p>";
    }
    html += "<p>You answered " + answered + " of " + data.questions.length + " items.</p>";
    if (suggested) {
      html += "<p>" + suggested + " question" + (suggested === 1 ? "" : "s") + " have a suggested answer you can open with “Show suggested answer” — they are not scored automatically and are not revealed until you choose to see them.</p>";
    }
    results.innerHTML = html;
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function resetQuiz(form, results) {
    form.reset();
    $$(".q-card").forEach(function (card) {
      card.classList.remove("correct", "incorrect", "unscored");
      $$(".opt", card).forEach(function (el) {
        el.classList.remove("is-correct", "is-chosen-wrong");
      });
      var fb = card.querySelector(".q-feedback");
      if (fb) fb.remove();
      $$("details.suggest-spoiler", card).forEach(function (d) { d.open = false; });
    });
    results.hidden = true;
    results.innerHTML = "";
    var first = document.querySelector(".q-card");
    if (first) first.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  window.initQuiz = initQuiz;
  document.addEventListener("DOMContentLoaded", function () {
    if (window.QUIZ_DATA) initQuiz(window.QUIZ_DATA);
    else if (document.getElementById("quiz-data")) initQuiz();
  });
})();
