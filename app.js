// app.js - BookFlow Client State & UI Controller

// 1. Initial State Database (Transcribed from the photo)
const DEFAULT_REQUESTS = [
  {
    id: 1,
    school: "明德高中",
    teacher: "姚香君",
    subject: "英",
    delivery: "郵寄",
    urgency: "急件",
    remarks: ["用書校"],
    books: [
      { code: "61003", qty: 1 },
      { code: "61004 (備用書)", qty: 1 },
      { code: "61871", qty: 1 }
    ],
    date: "2026-05-25"
  },
  {
    id: 2,
    school: "裕德高中/幼兒園",
    teacher: "板橋大澤/林永正經理",
    subject: "國",
    delivery: "郵寄",
    urgency: "急件",
    remarks: ["用書校"],
    books: [
      { code: "60115", qty: 2 },
      { code: "60002-TB", qty: 1 },
      { code: "60004-TB", qty: 1 }
    ],
    date: "2026-05-25"
  },
  {
    id: 3,
    school: "北一女中",
    teacher: "林佳潔",
    subject: "歷",
    delivery: "郵寄",
    urgency: "急件",
    remarks: ["推廣選書用"],
    books: [
      { code: "41104-R", qty: 1 },
      { code: "41102-R", qty: 1 }
    ],
    date: "2026-05-25"
  },
  {
    id: 4,
    school: "北一女中",
    teacher: "杜欣怡",
    subject: "物",
    delivery: "親送",
    urgency: "急件",
    remarks: ["推廣選書用"],
    books: [
      { code: "63003-A", qty: 1 },
      { code: "63006-R (備課服務)", qty: 1 }
    ],
    date: "2026-05-25"
  },
  {
    id: 5,
    school: "莊敬高職",
    teacher: "陳佩璵",
    subject: "化",
    delivery: "郵寄",
    urgency: "急件",
    remarks: ["推廣選書用"],
    books: [
      { code: "64003-A1", qty: 1 },
      { code: "64004-A1", qty: 1 },
      { code: "64005-A1", qty: 1 },
      { code: "64006-A1", qty: 1 }
    ],
    date: "2026-05-25"
  },
  {
    id: 6,
    school: "莊敬高職",
    teacher: "王鼎勳",
    subject: "數",
    delivery: "親送",
    urgency: "急件",
    remarks: ["推廣選書用"],
    books: [
      { code: "62607-R", qty: 7 },
      { code: "62603-R", qty: 7 },
      { code: "62604-R", qty: 7 }
    ],
    date: "2026-05-25"
  },
  {
    id: 7,
    school: "莊敬高職",
    teacher: "杜沛倫",
    subject: "物",
    delivery: "親送",
    urgency: "急件",
    remarks: ["用書校"],
    books: [
      { code: "63004-TB", qty: 1 }
    ],
    date: "2026-05-25"
  }
];

// Load from LocalStorage if available, otherwise use default transcribed set
let requests = JSON.parse(localStorage.getItem("bookflow_requests")) || DEFAULT_REQUESTS;

// 2. School-Teacher Database Setup
const DEFAULT_SCHOOL_TEACHERS = [
  { school: "明德高中", teacher: "姚香君" },
  { school: "裕德高中/幼兒園", teacher: "板橋大澤/林永正經理" },
  { school: "北一女中", teacher: "林佳潔" },
  { school: "北一女中", teacher: "杜欣怡" },
  { school: "莊敬高職", teacher: "陳佩璵" },
  { school: "莊敬高職", teacher: "王鼎勳" },
  { school: "莊敬高職", teacher: "杜沛倫" }
];

let schoolTeachers = JSON.parse(localStorage.getItem("bookflow_school_teachers")) || DEFAULT_SCHOOL_TEACHERS;



// Subject Mapping
const SUBJECT_MAP = {
  "國": "國文",
  "英": "英文",
  "數": "數學",
  "物": "物理",
  "化": "化學",
  "歷": "歷史"
};

// Books List mapped by Subject
const BOOKS_DATABASE = {
  "國": ["60115", "60002-TB", "60004-TB"],
  "英": ["61003", "61004 (備用書)", "61871"],
  "數": ["62607-R", "62603-R", "62604-R"],
  "物": ["63003-A", "63006-R (備課服務)", "63004-TB"],
  "化": ["64003-A1", "64004-A1", "64005-A1", "64006-A1"],
  "歷": ["41104-R", "41102-R"]
};

// Current Application View & State
let activeView = "dashboard";
let wizardStep = 1;

// Wizard State Object
let formData = {
  school: "",
  teacher: "",
  teacherId: "",
  subject: "",
  books: {}, // will map { "61003": 2, ... }
  delivery: "郵寄",
  urgency: "普通",
  remarks: []
};

// DOM References
const viewDashboard = document.getElementById("view-dashboard");
const viewWizard = document.getElementById("view-wizard");
const viewTitle = document.getElementById("view-title");
const viewSubtitle = document.getElementById("view-subtitle");
const requestsTableBody = document.getElementById("table-body");

// Dashboard DOM Metrics
const metricTotalRequests = document.getElementById("metric-total-requests");
const metricUrgentPct = document.getElementById("metric-urgent-pct");
const metricUrgentCount = document.getElementById("metric-urgent-count");
const metricTotalBooks = document.getElementById("metric-total-books");
const metricTotalSchools = document.getElementById("metric-total-schools");

// Filters DOM
const searchInput = document.getElementById("search-input");
const filterSubject = document.getElementById("filter-subject");
const filterDelivery = document.getElementById("filter-delivery");

// Wizard Navigation DOM
const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const nextIcon = document.getElementById("next-icon");
const wizardFormSteps = document.querySelectorAll(".form-step");
const stepIndicators = document.querySelectorAll(".step-indicator");
const stepLines = document.querySelectorAll(".step-line");

// Modal DOM
const successModal = document.getElementById("success-modal");
const detailModal = document.getElementById("detail-modal");

// Toast DOM
const toastContainer = document.getElementById("toast-container");

// ==================== INITIALIZATION & VIEW CONTROLS ====================

document.addEventListener("DOMContentLoaded", () => {
  // Bind Nav Links
  document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const targetView = item.getAttribute("data-view");
      showView(targetView);
    });
  });

  // Header quick buttons
  document.getElementById("btn-quick-new").addEventListener("click", () => showView("wizard"));
  document.getElementById("btn-quick-export").addEventListener("click", exportToCSV);
  
  const btnReset = document.getElementById("btn-quick-reset");
  if (btnReset) {
    btnReset.addEventListener("click", resetDataToDefault);
  }

  // Search & Filter listeners
  searchInput.addEventListener("input", renderDashboard);
  filterSubject.addEventListener("change", renderDashboard);
  filterDelivery.addEventListener("change", renderDashboard);

  // Wizard Navigation
  btnPrev.addEventListener("click", handleWizardPrev);
  btnNext.addEventListener("click", handleWizardNext);

  // Wizard Radio & Checkbox Card Selection bindings
  setupWizardInteractiveInputs();

  // Close modals
  document.getElementById("btn-close-success").addEventListener("click", () => {
    successModal.classList.remove("active");
    showView("dashboard");
  });
  document.getElementById("btn-close-detail").addEventListener("click", () => {
    detailModal.classList.remove("active");
  });

  // Cascading Dropdown Listeners
  const formSchool = document.getElementById("form-school");
  const formTeacher = document.getElementById("form-teacher");
  if (formSchool) {
    formSchool.addEventListener("change", () => {
      populateTeacherDropdown(formSchool.value);
    });
  }

  // Bind Add School/Teacher Modal Buttons
  const addSTModal = document.getElementById("add-school-teacher-modal");
  const btnAddST = document.getElementById("sidebar-add-school-teacher");
  const btnCloseAddST = document.getElementById("btn-close-add-school-teacher");
  const btnSubmitAddST = document.getElementById("btn-submit-add-school-teacher");

  if (btnAddST) {
    btnAddST.addEventListener("click", () => {
      document.getElementById("modal-add-school").value = "";
      document.getElementById("modal-add-subject").value = "";
      document.getElementById("modal-add-teacher").value = "";
      addSTModal.classList.add("active");
    });
  }

  if (btnCloseAddST) {
    btnCloseAddST.addEventListener("click", () => {
      addSTModal.classList.remove("active");
    });
  }

  if (btnSubmitAddST) {
    btnSubmitAddST.addEventListener("click", submitNewSchoolTeacher);
  }

  // ==================== MOBILE BOTTOM NAV ====================
  const mobileNavBtns = document.querySelectorAll(".mobile-nav-btn[data-view]");
  mobileNavBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      if (view) showView(view);
    });
  });

  const mobileAddST = document.getElementById("mobile-add-school-teacher");
  if (mobileAddST) {
    mobileAddST.addEventListener("click", () => {
      document.getElementById("modal-add-school").value = "";
      document.getElementById("modal-add-subject").value = "";
      document.getElementById("modal-add-teacher").value = "";
      document.getElementById("add-school-teacher-modal").classList.add("active");
    });
  }

  // Initial populate of cascading drop downs
  populateSchoolDropdown();
  populateTeacherDropdown("");

  // Render initial dashboard data
  renderDashboard();
  showToast("系統初始化成功", "載入 7 筆實時贈書數據。");
});

function showView(viewName) {
  activeView = viewName;

  // Toggle active styling in nav links
  document.querySelectorAll(".nav-item").forEach(item => {
    if (item.getAttribute("data-view") === viewName) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  if (viewName === "dashboard") {
    viewDashboard.classList.add("active");
    viewWizard.classList.remove("active");
    viewTitle.textContent = "贈書管理儀表板";
    viewSubtitle.textContent = "實時追蹤贈書申請進度與教材分發統計";
    renderDashboard();
  } else if (viewName === "wizard") {
    viewDashboard.classList.remove("active");
    viewWizard.classList.add("active");
    viewTitle.textContent = "申請新贈書單";
    viewSubtitle.textContent = "建立個人化贈書項目，支援分科智慧選書功能";
    resetWizard();
  }
}

// ==================== DASHBOARD RENDERING & ANALYTICS ====================

function renderDashboard() {
  // 1. Gather filtered list
  const query = searchInput.value.toLowerCase().trim();
  const subject = filterSubject.value;
  const delivery = filterDelivery.value;

  const filteredRequests = requests.filter(req => {
    // Text search (School or Teacher name)
    const matchesSearch = req.school.toLowerCase().includes(query) || 
                          req.teacher.toLowerCase().includes(query);
    // Subject filter
    const matchesSubject = subject === "all" || req.subject === subject;
    // Delivery filter
    const matchesDelivery = delivery === "all" || req.delivery === delivery;

    return matchesSearch && matchesSubject && matchesDelivery;
  });

  // 2. Render Table rows
  requestsTableBody.innerHTML = "";
  
  if (filteredRequests.length === 0) {
    requestsTableBody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 24px; margin-bottom: 12px; display: block;"></i>
          查無符合篩選條件的贈書單
        </td>
      </tr>
    `;
  } else {
    filteredRequests.forEach(req => {
      const row = document.createElement("tr");

      // Books column visual format
      let booksHtml = `<div class="books-list-cell">`;
      req.books.forEach(b => {
        booksHtml += `<span class="book-tag">${b.code} <span class="book-qty">${b.qty}本</span></span>`;
      });
      booksHtml += `</div>`;

      // Remarks pills
      let remarksHtml = "";
      req.remarks.forEach(rem => {
        remarksHtml += `<span class="badge badge-remark">${rem}</span>`;
      });

      // Badges classes mapping
      const deliveryClass = req.delivery === "郵寄" ? "badge-delivery-mail" : "badge-delivery-hand";
      const deliveryIcon = req.delivery === "郵寄" ? "fa-truck-fast" : "fa-person-walking-luggage";
      const urgencyClass = req.urgency === "急件" ? "badge-urgent" : "badge-remark";

      row.innerHTML = `
        <td style="font-weight: 600;">${req.school}</td>
        <td>${req.teacher}</td>
        <td><span class="badge badge-subject">${SUBJECT_MAP[req.subject] || req.subject}</span></td>
        <td><span class="badge ${deliveryClass}"><i class="fa-solid ${deliveryIcon}"></i> ${req.delivery}</span></td>
        <td><span class="badge ${urgencyClass}">${req.urgency}</span></td>
        <td>${remarksHtml}</td>
        <td>${booksHtml}</td>
        <td style="text-align: center;">
          <button class="btn-secondary" style="padding: 6px 12px; font-size: 13px;" onclick="viewRequestDetails(${req.id})">
            <i class="fa-solid fa-eye"></i>
            <span>檢視</span>
          </button>
        </td>
      `;
      requestsTableBody.appendChild(row);
    });
  }

  // 3. Recalculate Live Metrics
  calculateDashboardMetrics();
}

function calculateDashboardMetrics() {
  // Total Requests
  const totalRequests = requests.length;
  metricTotalRequests.textContent = totalRequests;

  // Urgent percentage & count
  const urgentCount = requests.filter(req => req.urgency === "急件").length;
  const urgentPct = totalRequests > 0 ? Math.round((urgentCount / totalRequests) * 100) : 0;
  metricUrgentPct.textContent = `${urgentPct}%`;
  metricUrgentCount.textContent = `${urgentCount} 件急需物流配送`;

  // Total Books Quantities Sum
  let totalBooksCount = 0;
  requests.forEach(req => {
    req.books.forEach(b => {
      totalBooksCount += b.qty;
    });
  });
  metricTotalBooks.textContent = totalBooksCount;

  // Total distinct schools
  const distinctSchools = [...new Set(requests.map(req => req.school))];
  metricTotalSchools.textContent = distinctSchools.length;
}

// Global scope listener helper to open single request details in a modal
window.viewRequestDetails = function(id) {
  const req = requests.find(r => r.id === id);
  if (!req) return;

  document.getElementById("modal-detail-school").textContent = req.school;
  document.getElementById("modal-detail-teacher").textContent = req.teacher;
  document.getElementById("modal-detail-subject").textContent = `${SUBJECT_MAP[req.subject]} (${req.subject})`;
  document.getElementById("modal-detail-delivery").textContent = req.delivery;
  document.getElementById("modal-detail-remarks").textContent = req.remarks.join(", ") || "無";
  
  // Set urgency class on modal badge
  const urgencyBadge = document.getElementById("modal-detail-urgency");
  urgencyBadge.textContent = req.urgency;
  if (req.urgency === "急件") {
    urgencyBadge.className = "badge badge-urgent";
    urgencyBadge.style.display = "inline-flex";
  } else {
    urgencyBadge.className = "badge badge-remark";
    urgencyBadge.style.display = "inline-flex";
  }

  // Books list rendering
  const booksContainer = document.getElementById("modal-detail-books-list");
  booksContainer.innerHTML = "";
  req.books.forEach(b => {
    const row = document.createElement("div");
    row.className = "summary-book-row";
    row.innerHTML = `
      <span style="font-family: var(--font-heading); font-weight: 500;">書號: ${b.code}</span>
      <span style="color: var(--color-cyan); font-weight: 700;">${b.qty} 本</span>
    `;
    booksContainer.appendChild(row);
  });

  detailModal.classList.add("active");
};

// ==================== INTERACTIVE WIZARD FORM ====================

function resetWizard() {
  wizardStep = 1;
  formData = {
    school: "",
    teacher: "",
    teacherId: "",
    subject: "",
    books: {},
    delivery: "郵寄",
    urgency: "普通",
    remarks: []
  };

  // Reset inputs & drop downs
  populateSchoolDropdown();
  populateTeacherDropdown("");
  document.getElementById("form-form-teacher-id").value = "";

  // Reset select input active indicators
  document.querySelectorAll(".option-card").forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    const checkbox = card.querySelector('input[type="checkbox"]');
    
    if (radio) {
      if (radio.name === "wizard-subject") {
        card.classList.remove("selected");
        radio.checked = false;
      } else if (radio.name === "wizard-delivery") {
        if (radio.value === "郵寄") {
          card.classList.add("selected");
          radio.checked = true;
        } else {
          card.classList.remove("selected");
          radio.checked = false;
        }
      } else if (radio.name === "wizard-urgency") {
        if (radio.value === "普通") {
          card.classList.add("selected");
          radio.checked = true;
        } else {
          card.classList.remove("selected");
          radio.checked = false;
        }
      }
    }

    if (checkbox) {
      card.classList.remove("selected");
      checkbox.checked = false;
    }
  });

  // Hide Dynamic Books Stepper
  document.getElementById("books-stepper-section").style.display = "none";
  document.getElementById("books-stepper-list").innerHTML = "";

  updateWizardUI();
}

function setupWizardInteractiveInputs() {
  document.querySelectorAll(".option-card").forEach(card => {
    card.addEventListener("click", (e) => {
      // Don't double trigger if clicking directly on input
      if (e.target.tagName === "INPUT") return;

      const radio = card.querySelector('input[type="radio"]');
      const checkbox = card.querySelector('input[type="checkbox"]');

      if (radio) {
        radio.checked = true;
        
        // Select sibling radio option-cards and de-select them
        const groupName = radio.name;
        document.querySelectorAll(`input[name="${groupName}"]`).forEach(r => {
          r.closest(".option-card").classList.remove("selected");
        });
        card.classList.add("selected");

        // Dynamic book list loading trigger on step 2
        if (groupName === "wizard-subject") {
          formData.subject = radio.value;
          formData.books = {}; // Reset previously chosen books
          loadDynamicBooksForSubject(radio.value);
        }
      }

      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) {
          card.classList.add("selected");
        } else {
          card.classList.remove("selected");
        }
      }
    });
  });
}

function loadDynamicBooksForSubject(subjectCode) {
  const booksList = BOOKS_DATABASE[subjectCode] || [];
  const container = document.getElementById("books-stepper-list");
  container.innerHTML = "";

  if (booksList.length === 0) return;

  booksList.forEach(code => {
    formData.books[code] = 0; // initialize to 0

    const row = document.createElement("div");
    row.className = "book-stepper-row";
    row.innerHTML = `
      <div class="book-stepper-info">
        <span class="book-stepper-code">${code}</span>
        <span class="book-stepper-desc">學科指定教材與補充用書</span>
      </div>
      <div class="stepper-controls">
        <button class="stepper-btn" onclick="updateBookQty('${code}', -1)"><i class="fa-solid fa-minus"></i></button>
        <span class="stepper-value" id="qty-${code}">0</span>
        <button class="stepper-btn" onclick="updateBookQty('${code}', 1)"><i class="fa-solid fa-plus"></i></button>
      </div>
    `;
    container.appendChild(row);
  });

  document.getElementById("books-stepper-section").style.display = "block";
}

// Global scope helper for book quantities modifier buttons
window.updateBookQty = function(code, change) {
  let currentQty = formData.books[code] || 0;
  let newQty = currentQty + change;
  if (newQty < 0) newQty = 0;

  formData.books[code] = newQty;
  document.getElementById(`qty-${code}`).textContent = newQty;
};

// ==================== WIZARD STEP NAVIGATION ====================

function handleWizardPrev() {
  if (wizardStep > 1) {
    wizardStep--;
    updateWizardUI();
  }
}

function handleWizardNext() {
  if (validateStep(wizardStep)) {
    if (wizardStep < 4) {
      wizardStep++;
      if (wizardStep === 4) {
        compileWizardSummary();
      }
      updateWizardUI();
    } else {
      // Submit form!
      submitWizardRequest();
    }
  }
}

function validateStep(step) {
  if (step === 1) {
    const schoolVal = document.getElementById("form-school").value;
    const teacherVal = document.getElementById("form-teacher").value;

    if (!schoolVal || !teacherVal) {
      showToast("輸入錯誤", "請選擇學校名稱與教師姓名！");
      return false;
    }
    formData.school = schoolVal;
    formData.teacher = teacherVal;
    formData.teacherId = document.getElementById("form-form-teacher-id").value.trim();
    return true;
  }

  if (step === 2) {
    if (!formData.subject) {
      showToast("輸入錯誤", "請選擇欲申請之學科科目！");
      return false;
    }
    // Ensure at least one book has qty > 0
    let totalBooksSelected = 0;
    Object.values(formData.books).forEach(qty => totalBooksSelected += qty);

    if (totalBooksSelected === 0) {
      showToast("輸入錯誤", "請至少選擇一本教材書籍！");
      return false;
    }
    return true;
  }

  if (step === 3) {
    // Gather delivery
    const deliveryInput = document.querySelector('input[name="wizard-delivery"]:checked');
    formData.delivery = deliveryInput ? deliveryInput.value : "郵寄";

    // Gather urgency
    const urgencyInput = document.querySelector('input[name="wizard-urgency"]:checked');
    formData.urgency = urgencyInput ? urgencyInput.value : "普通";

    // Gather remarks
    formData.remarks = [];
    document.querySelectorAll('input[name="wizard-remarks"]:checked').forEach(cb => {
      formData.remarks.push(cb.value);
    });

    if (formData.remarks.length === 0) {
      showToast("輸入錯誤", "請選擇至少一種書籍用途備註！");
      return false;
    }
    return true;
  }

  return true;
}

function updateWizardUI() {
  // Update progress indicators & lines
  stepIndicators.forEach((ind, index) => {
    const idx = index + 1;
    if (idx === wizardStep) {
      ind.className = "step-indicator active";
    } else if (idx < wizardStep) {
      ind.className = "step-indicator completed";
    } else {
      ind.className = "step-indicator";
    }
  });

  stepLines.forEach((line, index) => {
    const idx = index + 1;
    if (idx < wizardStep) {
      line.className = "step-line filled";
    } else {
      line.className = "step-line";
    }
  });

  // Toggle active form step
  wizardFormSteps.forEach(stepPanel => {
    const stepIdx = parseInt(stepPanel.getAttribute("data-step"));
    if (stepIdx === wizardStep) {
      stepPanel.classList.add("active");
    } else {
      stepPanel.classList.remove("active");
    }
  });

  // Back button visibility
  if (wizardStep === 1) {
    btnPrev.style.visibility = "hidden";
  } else {
    btnPrev.style.visibility = "visible";
  }

  // Next / Submit button text
  if (wizardStep === 4) {
    btnNext.querySelector("span").textContent = "送出申請";
    nextIcon.className = "fa-solid fa-check";
  } else {
    btnNext.querySelector("span").textContent = "下一步";
    nextIcon.className = "fa-solid fa-arrow-right";
  }
}

function compileWizardSummary() {
  document.getElementById("summary-badge-subject").textContent = SUBJECT_MAP[formData.subject];
  document.getElementById("summary-school").textContent = formData.school;
  document.getElementById("summary-teacher").textContent = formData.teacher;
  document.getElementById("summary-delivery").textContent = formData.delivery;
  document.getElementById("summary-urgency").textContent = formData.urgency;
  document.getElementById("summary-remarks").textContent = formData.remarks.join(", ");

  // Books confirmation list
  const listContainer = document.getElementById("summary-books-list");
  listContainer.innerHTML = "";

  Object.entries(formData.books).forEach(([code, qty]) => {
    if (qty > 0) {
      const row = document.createElement("div");
      row.className = "summary-book-row";
      row.innerHTML = `
        <span style="font-family: var(--font-heading); font-weight: 500;">書號: ${code}</span>
        <span style="color: var(--color-cyan); font-weight: 700;">${qty} 本</span>
      `;
      listContainer.appendChild(row);
    }
  });
}

function submitWizardRequest() {
  // Create final books array structure
  const chosenBooks = [];
  Object.entries(formData.books).forEach(([code, qty]) => {
    if (qty > 0) {
      chosenBooks.push({ code: code, qty: qty });
    }
  });

  const newRequest = {
    id: requests.length + 1,
    school: formData.school,
    teacher: formData.teacher,
    subject: formData.subject,
    delivery: formData.delivery,
    urgency: formData.urgency,
    remarks: [...formData.remarks],
    books: chosenBooks,
    date: new Date().toISOString().split('T')[0]
  };

  // Push new request to local DB
  requests.unshift(newRequest); // Add to the top of list
  
  // Save to LocalStorage for persistence
  localStorage.setItem("bookflow_requests", JSON.stringify(requests));
  
  // Show success modal
  successModal.classList.add("active");
  showToast("表單提交成功", `已成功儲存「${formData.school}」的教材申請。`);
}

// ==================== RESET DATA UTILITY ====================

function resetDataToDefault() {
  if (confirm("您確定要將所有數據重設回預設的 7 筆手寫單據資料嗎？這將會清除您自行新增的項目。")) {
    requests = [...DEFAULT_REQUESTS];
    localStorage.setItem("bookflow_requests", JSON.stringify(requests));
    
    schoolTeachers = [...DEFAULT_SCHOOL_TEACHERS];
    localStorage.setItem("bookflow_school_teachers", JSON.stringify(schoolTeachers));
    
    renderDashboard();
    showToast("重設成功", "數據與學校教師庫已回復至初始預設值。");
  }
}

// ==================== CASCADING DROPDOWNS & SCHOOL/TEACHER DATABASE ====================

function populateSchoolDropdown() {
  const formSchool = document.getElementById("form-school");
  if (!formSchool) return;

  formSchool.innerHTML = '<option value="">請選擇學校...</option>';

  // Get unique school names
  const uniqueSchools = [...new Set(schoolTeachers.map(pair => pair.school))];
  
  uniqueSchools.forEach(school => {
    const opt = document.createElement("option");
    opt.value = school;
    opt.textContent = school;
    formSchool.appendChild(opt);
  });
}

function populateTeacherDropdown(selectedSchool) {
  const formTeacher = document.getElementById("form-teacher");
  if (!formTeacher) return;

  formTeacher.innerHTML = '<option value="">請選擇教師...</option>';

  if (!selectedSchool) return;

  // Filter teachers registered under this school
  const teachers = schoolTeachers
    .filter(pair => pair.school === selectedSchool)
    .map(pair => pair.teacher);

  teachers.forEach(teacher => {
    const opt = document.createElement("option");
    opt.value = teacher;
    opt.textContent = teacher;
    formTeacher.appendChild(opt);
  });
}

function submitNewSchoolTeacher() {
  const schoolInput = document.getElementById("modal-add-school").value.trim();
  const subjectInput = document.getElementById("modal-add-subject").value.trim();
  const teacherInput = document.getElementById("modal-add-teacher").value.trim();

  if (!schoolInput || !subjectInput || !teacherInput) {
    showToast("輸入錯誤", "請完整填寫學校、科目與教師名稱！");
    return;
  }

  // Check if pairing already exists
  const exists = schoolTeachers.some(
    pair => pair.school.toLowerCase() === schoolInput.toLowerCase() && 
            pair.teacher.toLowerCase() === teacherInput.toLowerCase() &&
            (pair.subject || "").toLowerCase() === subjectInput.toLowerCase()
  );

  if (!exists) {
    schoolTeachers.push({ school: schoolInput, subject: subjectInput, teacher: teacherInput });
    localStorage.setItem("bookflow_school_teachers", JSON.stringify(schoolTeachers));
  }

  // Close modal
  document.getElementById("add-school-teacher-modal").classList.remove("active");

  // Re-populate dropdown and select
  populateSchoolDropdown();
  const formSchool = document.getElementById("form-school");
  formSchool.value = schoolInput;
  
  populateTeacherDropdown(schoolInput);
  const formTeacher = document.getElementById("form-teacher");
  formTeacher.value = teacherInput;

  formData.school = schoolInput;
  formData.subject = subjectInput;
  formData.teacher = teacherInput;

  showToast("新增成功", `已成功登錄「${schoolInput} - ${subjectInput} - ${teacherInput}」！`);
}

// ==================== CSV EXPORT (PREMIUM FEATURE) ====================

function exportToCSV() {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Headers (Chinese UTF-8)
  csvContent += "\uFEFF"; // Add BOM for Excel compatibility in Chinese
  csvContent += "申請日期,學校名稱,教師姓名,學科,寄送方式,優先屬性,用途備註,申請書籍明細\n";

  requests.forEach(req => {
    const booksStr = req.books.map(b => `${b.code}(${b.qty}本)`).join("; ");
    const remarksStr = req.remarks.join("; ");
    const subjectName = SUBJECT_MAP[req.subject] || req.subject;
    
    // Safely wrap text containing commas
    const row = [
      req.date,
      `"${req.school}"`,
      `"${req.teacher}"`,
      subjectName,
      req.delivery,
      req.urgency,
      `"${remarksStr}"`,
      `"${booksStr}"`
    ].join(",");
    
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `北區贈書單資料表_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("匯出成功", "CSV 數據檔案已開始下載！");
}

// ==================== UTILITY: CUSTOM TOAST ALERTS ====================

function showToast(title, message) {
  const toast = document.createElement("div");
  toast.className = "toast success";
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <div style="display: flex; flex-direction: column;">
      <span style="font-weight: 600; font-size: 14px;">${title}</span>
      <span style="font-size: 12px; color: var(--text-secondary);">${message}</span>
    </div>
  `;

  toastContainer.appendChild(toast);

  // Remove toast after 3.5 seconds
  setTimeout(() => {
    toast.style.animation = "fadeOut 0.4s ease forwards";
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 3500);
}
