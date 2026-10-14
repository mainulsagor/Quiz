
/* ========================================
   EUDAIMONIA - QUIZ WEBSITE JAVASCRIPT
======================================== */

/*
  IMPORTANT:
  Quiz files should be inside the quizzes folder.
  Example: quizzes/day43.htm
*/

const QUIZZES = [
  {
    title: "GRE Vocabulary",
    category: "Vocabulary",
    description:
      "Practice vocabulary questions from Day 1 to Day 100.",
    icon: "📘",

    sets: Array.from({ length: 100 }, (_, i) => ({
      title: `DAY ${i + 1}`,
      file: `quizzes/day${i + 1}.htm`
    }))
  },

  {
    title: "333 Barrons",
    category: "English",
    description: "Practice English and Barron's questions.",
    icon: "✍️",
    file: "barrons.html",
    details: "Grammar and vocabulary practice"
  },

  {
    title: "Word Smart Practice",
    category: "Model Test",
    description: "Improve your vocabulary with Word Smart practice.",
    icon: "📝",
    file: "wordsmart.html",
    details: "Vocabulary model test"
  }
];


/* ========================================
   GET HTML ELEMENTS
======================================== */

const quizGrid = document.getElementById("quizGrid");
const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const countElement = document.getElementById("count");


/* ========================================
   CATEGORY OPTIONS
======================================== */

function createCategoryOptions() {
  if (!categorySelect) return;

  const categories = [
    ...new Set(QUIZZES.map(quiz => quiz.category))
  ];

  categories.forEach(category => {
    const option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categorySelect.appendChild(option);
  });
}


/* ========================================
   CREATE QUIZ CARD
======================================== */

function createQuizCard(quiz, quizIndex) {
  const card = document.createElement("article");
  card.className = "quiz-card";

  /* Card header */
  const header = document.createElement("div");
  header.className = "quiz-card-header";

  const icon = document.createElement("div");
  icon.className = "quiz-icon";
  icon.textContent = quiz.icon || "📚";
  icon.setAttribute("aria-hidden", "true");

  const heading = document.createElement("div");

  const title = document.createElement("h3");
  title.textContent = quiz.title;

  const category = document.createElement("span");
  category.className = "quiz-category";
  category.textContent = quiz.category;

  heading.append(title, category);
  header.append(icon, heading);

  /* Description */
  const description = document.createElement("p");
  description.className = "quiz-description";
  description.textContent = quiz.description || "";

  card.append(header, description);

  /* Day / Set links */
  if (Array.isArray(quiz.sets) && quiz.sets.length > 0) {
    const setsContainer = document.createElement("div");
    setsContainer.className = "quiz-sets";

    const visibleDays = 6;

    quiz.sets.forEach((set, index) => {
      const link = document.createElement("a");

      link.className = "set-link";
      link.href = set.file;
      link.textContent = set.title;

      if (index >= visibleDays) {
        link.classList.add("hidden-set");
      }

      setsContainer.appendChild(link);
    });

    /* More Days button */
    if (quiz.sets.length > visibleDays) {
      const moreButton = document.createElement("button");

      moreButton.type = "button";
      moreButton.className = "more-days-btn";
      moreButton.textContent = "More Days ▼";
      moreButton.setAttribute("aria-expanded", "false");

      moreButton.addEventListener("click", () => {
        const expanded =
          moreButton.getAttribute("aria-expanded") === "true";

        const hiddenLinks =
          setsContainer.querySelectorAll(".set-link");

        hiddenLinks.forEach((link, index) => {
          if (index >= visibleDays) {
            link.classList.toggle("hidden-set", expanded);
          }
        });

        moreButton.setAttribute(
          "aria-expanded",
          String(!expanded)
        );

        moreButton.textContent = expanded
          ? "More Days ▼"
          : "Show Fewer ▲";
      });

      setsContainer.appendChild(moreButton);
    }

    card.appendChild(setsContainer);
  }

  /* Regular quiz button */
  else if (quiz.file) {
    const link = document.createElement("a");

    link.className = "quiz-main-btn";
    link.href = quiz.file;
    link.textContent = "Start Quiz →";

    card.appendChild(link);
  }

  return card;
}


/* ========================================
   RENDER QUIZZES
======================================== */

function renderQuizzes() {
  if (!quizGrid) return;

  const searchTerm = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const selectedCategory = categorySelect
    ? categorySelect.value
    : "all";

  const filteredQuizzes = QUIZZES.filter(quiz => {
    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm) ||
      quiz.category.toLowerCase().includes(searchTerm) ||
      (quiz.description || "").toLowerCase().includes(searchTerm) ||
      (quiz.sets || []).some(set =>
        set.title.toLowerCase().includes(searchTerm)
      );

    const matchesCategory =
      selectedCategory === "all" ||
      quiz.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  /* Remove previous cards */
  quizGrid.replaceChildren();

  /* Update result count */
  if (countElement) {
    countElement.textContent =
      `${filteredQuizzes.length} quiz collection(s) found`;
  }

  /* Empty search result */
  if (filteredQuizzes.length === 0) {
    const message = document.createElement("div");

    message.className = "no-results";
    message.textContent =
      "No quizzes found. Try another search or category.";

    quizGrid.appendChild(message);
    return;
  }

  /* Display quiz cards */
  filteredQuizzes.forEach((quiz, index) => {
    quizGrid.appendChild(createQuizCard(quiz, index));
  });
}


/* ========================================
   SEARCH AND FILTER EVENTS
======================================== */

if (searchInput) {
  searchInput.addEventListener("input", renderQuizzes);
}

if (categorySelect) {
  categorySelect.addEventListener("change", renderQuizzes);
}


/* ========================================
   START WEBSITE
======================================== */

createCategoryOptions();
renderQuizzes();
