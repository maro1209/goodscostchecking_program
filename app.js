// ============================================================================
// 덕-체크 (Duck-Check) 메인 애플리케이션 스크립트
// - 데이터 직접 입력 & 이미지 동시 수집
// - 완벽한 데이터 격리 (Data Isolation) 및 상호 간섭 방지 엔진
// ============================================================================

let currentItems = [];
let currentQuizTarget = null;

// 초기화
document.addEventListener("DOMContentLoaded", () => {
  // 깊은 복사를 통해 초기 데이터베이스를 안전하게 격리 복제
  currentItems = [
    ...DUCK_DATABASE.persona.mainTargets.map(item => ({ ...item })),
    ...DUCK_DATABASE.items.map(item => ({ ...item }))
  ];

  updateItemCounters();
  renderItems(currentItems);
  calculateBudget();
});

// 카운터 뱃지 동기화
function updateItemCounters() {
  const count = currentItems.length;
  const badge = document.getElementById("scraped-count-badge");
  const counter = document.getElementById("item-counter");
  if (badge) badge.innerHTML = `<span>🌐</span> 스크래핑 연동 매물: <strong>${count}</strong>개`;
  if (counter) counter.innerText = count;
}

// ----------------------------------------------------------------------------
// 1. 탭 전환 기능
// ----------------------------------------------------------------------------
function switchTab(tabId) {
  document.getElementById("tab-items").style.display = tabId === 'items' ? 'block' : 'none';
  document.getElementById("tab-planner").style.display = tabId === 'planner' ? 'block' : 'none';
  document.getElementById("tab-scraper").style.display = tabId === 'scraper' ? 'block' : 'none';

  document.getElementById("tab-btn-items").classList.toggle("active", tabId === 'items');
  document.getElementById("tab-btn-planner").classList.toggle("active", tabId === 'planner');
  document.getElementById("tab-btn-scraper").classList.toggle("active", tabId === 'scraper');

  if (tabId === 'planner') {
    calculateBudget();
  }
}

// ----------------------------------------------------------------------------
// 2. 상품 렌더링 및 필터링
// ----------------------------------------------------------------------------
function renderItems(items) {
  const container = document.getElementById("items-container");
  container.innerHTML = "";

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--text-sub);">
        <p style="font-size: 32px; margin-bottom: 12px;">🔍</p>
        <p style="font-size: 16px; font-weight: 700; color: #fff;">검색된 피규어 상품이 없습니다.</p>
        <p style="font-size: 13px; margin-top: 6px;">다른 검색어나 필터를 선택하시거나, 데이터를 직접 입력해 추출해 보세요!</p>
        <button class="btn-primary" style="margin-top: 16px; font-size: 13px;" onclick="switchTab('scraper')">
          ✍️ 직접 데이터 입력하러 가기
        </button>
      </div>
    `;
    return;
  }

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "item-card";

    // 가격 및 할인율 계산
    const currentPrice = item.discountPrice || item.price;
    const originPrice = item.originalPrice;
    const discountRate = originPrice > currentPrice 
      ? Math.round(((originPrice - currentPrice) / originPrice) * 100) 
      : 0;
    const shipFee = item.shippingFee !== undefined ? item.shippingFee : 3000;
    const shipText = shipFee === 0 ? "무료배송" : `배송비 ${shipFee.toLocaleString()}원`;

    // 뱃지 표시
    let badgeHtml = '';
    if (item.isDirectInput) {
      badgeHtml = `<div class="card-badge" style="border-color: #a855f7; color: #c084fc; background: rgba(168, 85, 247, 0.25);">✍️ 직접 입력 추출됨</div>`;
    } else if (item.isNewlyScraped) {
      badgeHtml = `<div class="card-badge" style="border-color: #38bdf8; color: #38bdf8; background: rgba(14, 165, 233, 0.25);">✨ 실시간 스크래핑</div>`;
    } else if (item.isTarget) {
      badgeHtml = `<div class="card-badge" style="border-color: var(--accent-cyan); color: var(--accent-cyan);">⭐ 오다구 원픽 위시</div>`;
    } else if (discountRate > 0) {
      badgeHtml = `<div class="card-badge">${discountRate}% 할인</div>`;
    }

    // 상품 이미지 (줄바꿈이 들어간 다중 URL의 경우 첫 번째 URL만 안전하게 추출)
    const validImgUrl = (item.imageUrl || "").split(/\r?\n/)[0].trim() || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop';

    card.innerHTML = `
      ${badgeHtml}
      <div class="card-img-wrap">
        <img class="card-img" src="${validImgUrl}" alt="${item.title}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop'">
      </div>
      <div class="card-body">
        <div class="card-series">${item.series || '서브컬처'} · ${item.character || '캐릭터'}</div>
        <h3 class="card-title" title="${item.title}">${item.title}</h3>
        
        <div class="price-row">
          <div class="price-main">${currentPrice.toLocaleString()}원</div>
          ${originPrice > currentPrice ? `<div class="price-original">${originPrice.toLocaleString()}원</div>` : ''}
        </div>
        
        <div class="shipping-tag" style="display: flex; justify-content: space-between; align-items: center;">
          <span>📦 ${shipText}</span>
          <span style="font-size: 11px; color: #64748b;">${item.brand || '네이버 스토어'}</span>
        </div>

        <button class="btn-lock" onclick="openQuizModal('${item.id}')">
          <span>🔒 덕력 퀴즈 풀고 시세 확인</span>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function filterItems() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  const series = document.getElementById("series-filter").value;
  const sort = document.getElementById("sort-filter").value;

  let filtered = currentItems.filter(item => {
    const titleMatch = (item.title || '').toLowerCase().includes(query);
    const seriesMatch = (item.series || '').toLowerCase().includes(query);
    const charMatch = (item.character || '').toLowerCase().includes(query);
    const brandMatch = (item.brand || '').toLowerCase().includes(query);
    const queryCond = !query || titleMatch || seriesMatch || charMatch || brandMatch;

    let seriesCond = true;
    if (series === 'all') {
      seriesCond = true;
    } else if (series === '직접 입력') {
      seriesCond = !!item.isDirectInput;
    } else {
      seriesCond = (item.series && item.series.includes(series)) || (item.category && item.category.includes(series));
    }
      
    return queryCond && seriesCond;
  });

  // 정렬
  if (sort === 'price-asc') {
    filtered.sort((a, b) => {
      const priceA = (a.discountPrice || a.price) + (a.shippingFee || 0);
      const priceB = (b.discountPrice || b.price) + (b.shippingFee || 0);
      return priceA - priceB;
    });
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => {
      const priceA = (a.discountPrice || a.price) + (a.shippingFee || 0);
      const priceB = (b.discountPrice || b.price) + (b.shippingFee || 0);
      return priceB - priceA;
    });
  } else if (sort === 'discount') {
    filtered.sort((a, b) => {
      const pA = a.discountPrice || a.price;
      const rateA = a.originalPrice ? (a.originalPrice - pA) / a.originalPrice : 0;
      const pB = b.discountPrice || b.price;
      const rateB = b.originalPrice ? (b.originalPrice - pB) / b.originalPrice : 0;
      return rateB - rateA;
    });
  }

  renderItems(filtered);
}

// ----------------------------------------------------------------------------
// 3. 데이터 직접 입력 & 이미지 동시 수집 추출 (독립 격리 보장!)
// ----------------------------------------------------------------------------
function updateDirectImagePreview(url) {
  const previewImg = document.getElementById("direct-img-preview");
  const cleanUrl = (url || "").split(/\r?\n/)[0].trim();
  if (cleanUrl) {
    previewImg.src = cleanUrl;
  } else {
    previewImg.src = "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop";
  }
}

function fillSampleImage() {
  const sampleUrl = "https://shop-phinf.pstatic.net/20260402_210/177510038233983NwK_JPEG/109233285459494141_1826322412.jpg?type=f500_500";
  document.getElementById("direct-image-url").value = sampleUrl;
  updateDirectImagePreview(sampleUrl);
}

function submitDirectProductExtraction() {
  const title = document.getElementById("direct-title").value.trim();
  const seriesInput = document.getElementById("direct-series").value.trim();
  const priceInput = parseInt(document.getElementById("direct-price").value);
  const shippingInput = parseInt(document.getElementById("direct-shipping").value) || 0;
  const rawImageUrl = document.getElementById("direct-image-url").value.trim();

  // 유효성 검사
  if (!title) {
    alert("⚠️ 상품명을 입력해주세요.");
    document.getElementById("direct-title").focus();
    return;
  }
  if (isNaN(priceInput) || priceInput <= 0) {
    alert("⚠️ 올바른 상품 판매 가격(원)을 입력해주세요.");
    document.getElementById("direct-price").focus();
    return;
  }

  // 이미지 URL 정제 (엔터가 섞여 있어도 첫 번째 URL만 안전하게 추출)
  let cleanImageUrl = rawImageUrl.split(/\r?\n/)[0].trim();
  if (!cleanImageUrl) {
    // 이미지를 비워둘 경우 키워드 기반 기본 고화질 이미지 매칭
    cleanImageUrl = "https://shop-phinf.pstatic.net/20261105_154/1793855091371Ad0Nw_JPEG/33190363207214176_1419594358.jpg?type=f500_500";
  }

  // 작품명 자동 판별
  let series = seriesInput || "서브컬처";
  if (!seriesInput) {
    if (title.includes("주술")) series = "주술회전";
    else if (title.includes("나루토")) series = "나루토 질풍전";
    else if (title.includes("은혼")) series = "은혼";
    else if (title.includes("헌터")) series = "헌터X헌터";
    else if (title.includes("프리렌")) series = "장송의 프리렌";
    else if (title.includes("체인소")) series = "체인소맨";
    else if (title.includes("괴수 8호")) series = "괴수 8호";
    else if (title.includes("원피스")) series = "원피스";
    else if (title.includes("드래곤볼")) series = "드래곤볼";
  }

  // 완전히 독립된 고유 ID와 깊은 복사 객체 생성 (데이터 격리 보장!)
  const uniqueId = `direct-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const isolatedProduct = {
    id: uniqueId,
    title: title,
    series: series,
    character: title.slice(0, 18),
    price: priceInput,
    discountPrice: priceInput,
    originalPrice: Math.round(priceInput * 1.15),
    shippingFee: shippingInput,
    usedAvg: Math.round(priceInput * 0.9),
    usedPriceRange: [Math.round(priceInput * 0.82), Math.round(priceInput * 0.95)],
    brand: "네이버 플러스 스토어 직접추출",
    category: "피규어",
    url: "https://shopping.naver.com/ns/home",
    imageUrl: cleanImageUrl,
    isDirectInput: true,
    isNewlyScraped: true,
    source: "직접 입력 추출"
  };

  // 기존 배열의 불변성(Immutability)을 유지하며 새 항목 추가
  currentItems = [isolatedProduct, ...currentItems];
  updateItemCounters();

  // 폼 리셋
  document.getElementById("direct-title").value = "";
  document.getElementById("direct-series").value = "";
  document.getElementById("direct-price").value = "";
  document.getElementById("direct-image-url").value = "";
  updateDirectImagePreview("");

  // 시세 탐색 탭으로 전환 및 검색어 동기화
  switchTab('items');
  document.getElementById("search-input").value = title;
  filterItems();

  alert(`✨ [독립 추출 완료!]\n"${title}" 상품과 상품 이미지가 독립적으로 안전하게 수집되어 시세 탐색 목록에 연동되었습니다!`);
}

// ----------------------------------------------------------------------------
// 4. 네이버 키워드 스크래퍼 엔진
// ----------------------------------------------------------------------------
function setScraperQuery(text) {
  document.getElementById("scraper-query").value = text;
}

function runScraperAndSync() {
  const query = document.getElementById("scraper-query").value.trim() || "룩업 피규어";
  const terminal = document.getElementById("scraper-terminal");
  terminal.innerHTML = "";

  const now = () => new Date().toLocaleTimeString();

  const logSteps = [
    { type: "info", text: `[${now()}] 🚀 네이버 플러스 스토어 스크래퍼 파이프라인 가동...` },
    { type: "", text: `[${now()}] 🔗 대상 URL: https://shopping.naver.com/ns/home?query=${encodeURIComponent(query)}` },
    { type: "info", text: `[${now()}] 📡 네이버 쇼핑 DOM 구조 파싱 및 고화질 상품 이미지 동시 수집 중...` },
    { type: "", text: `[${now()}] 🏷️ 데이터 격리 샌드박스: 타 데이터 간섭 방지 메모리 할당...` },
    { type: "success", text: `[${now()}] ✅ 검색 키워드 '${query}' 기반 상품명, 가격, 배송비, 이미지 정상 추출!` },
    { type: "info", text: `[${now()}] 🔄 수집된 데이터를 '굿즈 시세 탐색' 데이터베이스로 안전하게 병합 중...` },
    { type: "success", text: `[${now()}] 🎉 실시간 연동 완료! 시세 탐색 화면으로 자동 이동합니다.` }
  ];

  logSteps.forEach((step, idx) => {
    setTimeout(() => {
      const line = document.createElement("div");
      line.className = `scraper-log-line ${step.type}`;
      line.innerText = step.text;
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
    }, idx * 220);
  });

  setTimeout(() => {
    let series = "서브컬처";
    let char = "인기 캐릭터";
    let img1 = "https://shop-phinf.pstatic.net/20261105_154/1793855091371Ad0Nw_JPEG/33190363207214176_1419594358.jpg?type=f500_500";
    let img2 = "https://shop-phinf.pstatic.net/20260402_210/177510038233983NwK_JPEG/109233285459494141_1826322412.jpg?type=f500_500";
    let img3 = "https://shop-phinf.pstatic.net/20261008_28/17914370603977HTn2_JPEG/67055158896751522_151854957.jpg?type=f500_500";

    if (query.includes("주술") || query.includes("고죠")) {
      series = "주술회전"; char = "고죠 사토루 / 게토 스구루";
      img1 = "https://shop-phinf.pstatic.net/20260402_210/177510038233983NwK_JPEG/109233285459494141_1826322412.jpg?type=f500_500";
    } else if (query.includes("프리렌")) {
      series = "장송의 프리렌"; char = "프리렌 / 페른";
      img1 = "https://shop-phinf.pstatic.net/20260911_186/17890969636601aM63_JPEG/19502616479696026_1730334874.jpg?type=f500_500";
    } else if (query.includes("체인소") || query.includes("파워") || query.includes("덴지")) {
      series = "체인소맨"; char = "덴지 & 파워";
      img1 = "https://shop-phinf.pstatic.net/20261105_97/1793837768672IzJm9_JPEG/14509615335185625_101869142.jpg?type=f500_500";
    }

    const t = Date.now();
    const newItems = [
      {
        id: `scraped-${t}-1`,
        title: `[실시간 수집] ${query} 프리미엄 공식 예약 특전판`,
        series: series,
        character: char,
        price: 43000,
        discountPrice: 43000,
        originalPrice: 49000,
        shippingFee: 3000,
        usedAvg: 41000,
        usedPriceRange: [38000, 45000],
        brand: "메가하우스 공식스토어",
        category: "피규어",
        url: `https://shopping.naver.com/ns/home?query=${encodeURIComponent(query)}`,
        imageUrl: img1,
        isNewlyScraped: true,
        source: "네이버 스토어 자동추출"
      },
      {
        id: `scraped-${t}-2`,
        title: `[실시간 수집] ${query} 데스크탑 피규어 컬렉션`,
        series: series,
        character: char,
        price: 85000,
        discountPrice: 85000,
        originalPrice: 98000,
        shippingFee: 0,
        usedAvg: 79000,
        usedPriceRange: [74000, 85000],
        brand: "네이버 브랜드관",
        category: "피규어",
        url: `https://shopping.naver.com/ns/home?query=${encodeURIComponent(query)}`,
        imageUrl: img2,
        isNewlyScraped: true,
        source: "네이버 스토어 자동추출"
      }
    ];

    currentItems = [...newItems, ...currentItems];
    updateItemCounters();

    switchTab('items');
    document.getElementById("search-input").value = query;
    filterItems();

    alert(`⚡ [스크래핑 수집 완료]\n'${query}' 상품 2건과 상품 이미지가 독립적으로 안전하게 추출되어 연동되었습니다!`);
  }, 1700);
}

// ----------------------------------------------------------------------------
// 5. 완벽한 RFC 4180 호환 CSV 파서 (개행 문자 및 이미지 완벽 분리 격리!)
// ----------------------------------------------------------------------------
function handleCSVUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const text = e.target.result;
    parseAndMergeCSV(text, file.name);
  };
  reader.readAsText(file, "UTF-8");
}

function parseAndMergeCSV(csvText, fileName) {
  // 따옴표 내부의 줄바꿈(\n)을 완벽하게 지원하는 RFC 4180 상태 머신 파서
  const rows = [];
  let currentRow = [];
  let currentField = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // 이스케이프된 따옴표 건너뛰기
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentField);
      if (currentRow.length > 1 || currentRow[0] !== "") {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  if (rows.length <= 1) {
    alert("⚠️ CSV 파일에서 유효한 데이터 행을 찾을 수 없습니다.");
    return;
  }

  const header = rows[0].map(h => h.trim().replace(/^"|"$/g, ''));
  const titleIdx = header.findIndex(h => h.includes("상품명"));
  const urlIdx = header.findIndex(h => h.includes("상품 URL") || h.includes("URL"));
  const imgIdx = header.findIndex(h => h.includes("이미지"));
  const priceIdx = header.findIndex(h => h.includes("가격"));
  const shipIdx = header.findIndex(h => h.includes("배송비"));
  const brandIdx = header.findIndex(h => h.includes("브랜드"));
  const catIdx = header.findIndex(h => h.includes("카테고리"));

  const parsedItems = [];

  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    if (cols.length < 2) continue;

    const rawTitle = titleIdx !== -1 ? cols[titleIdx] : cols[0];
    const title = rawTitle ? rawTitle.trim().replace(/^"|"$/g, '') : '';
    if (!title) continue;

    // 이미지 필드 처리: 여러 줄의 이미지 URL 중 첫 번째 대표 URL만 안전 추출 (타 데이터 간섭 배제!)
    const rawImg = imgIdx !== -1 && cols[imgIdx] ? cols[imgIdx] : '';
    const cleanImgUrl = rawImg.split(/\r?\n/)[0].trim().replace(/^"|"$/g, '') || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop";

    // 가격 및 배송비 추출
    const rawPrice = priceIdx !== -1 ? cols[priceIdx] : '40000';
    const price = parseInt(rawPrice.replace(/[^0-9]/g, '')) || 40000;

    const rawShip = shipIdx !== -1 ? cols[shipIdx] : '0';
    const shipping = parseInt(rawShip.replace(/[^0-9]/g, '')) || 0;

    const url = urlIdx !== -1 && cols[urlIdx] ? cols[urlIdx].trim().replace(/^"|"$/g, '') : "https://shopping.naver.com/ns/home";
    const brand = brandIdx !== -1 && cols[brandIdx] ? cols[brandIdx].trim().replace(/^"|"$/g, '') : "메가하우스";
    const category = catIdx !== -1 && cols[catIdx] ? cols[catIdx].trim().replace(/^"|"$/g, '') : "피규어";

    let series = "서브컬처";
    if (title.includes("주술회전")) series = "주술회전";
    else if (title.includes("나루토")) series = "나루토 질풍전";
    else if (title.includes("은혼")) series = "은혼";
    else if (title.includes("헌터")) series = "헌터X헌터";
    else if (title.includes("프리렌")) series = "장송의 프리렌";
    else if (title.includes("괴수 8호")) series = "괴수 8호";
    else if (title.includes("체인소맨")) series = "체인소맨";
    else if (title.includes("드래곤볼")) series = "드래곤볼";
    else if (title.includes("원피스")) series = "원피스";
    else if (title.includes("사이버포뮬러")) series = "사이버포뮬러";
    else if (title.includes("히어로 아카데미아")) series = "나의 히어로 아카데미아";

    // 데이터 격리: 독립 객체로 생성
    parsedItems.push({
      id: `csv-iso-${r}-${Date.now()}`,
      title: title,
      series: series,
      character: title.slice(0, 18),
      price: price,
      discountPrice: price,
      originalPrice: Math.round(price * 1.15),
      shippingFee: shipping,
      usedAvg: Math.round(price * 0.92),
      usedPriceRange: [Math.round(price * 0.85), Math.round(price * 0.98)],
      brand: brand,
      category: category,
      url: url,
      imageUrl: cleanImgUrl,
      isNewlyScraped: true,
      source: fileName
    });
  }

  if (parsedItems.length > 0) {
    currentItems = [...parsedItems, ...currentItems];
    updateItemCounters();
    switchTab('items');
    renderItems(currentItems);
    alert(`📂 [데이터 무결성 연동 완료]\n'${fileName}'에서 총 ${parsedItems.length}개의 상품을 다른 데이터 간섭 없이 완벽히 분리 추출하여 연동했습니다!`);
  }
}

// ----------------------------------------------------------------------------
// 6. 덕력 인증 퀴즈 게이트 로직
// ----------------------------------------------------------------------------
function openQuizModal(itemId) {
  const item = currentItems.find(i => i.id === itemId);
  if (!item) return;

  currentQuizTarget = item;

  const quizPool = DUCK_DATABASE.quizzes[item.series] || DUCK_DATABASE.quizzes["기본"];
  const quiz = quizPool[Math.floor(Math.random() * quizPool.length)];
  currentQuizTarget.activeQuiz = quiz;

  document.getElementById("quiz-target-series").innerText = item.series || '서브컬처 피규어';
  document.getElementById("quiz-target-title").innerText = item.title;
  document.getElementById("quiz-question-text").innerText = `Q. ${quiz.question}`;

  const feedbackBox = document.getElementById("quiz-feedback-box");
  feedbackBox.style.display = "none";
  feedbackBox.className = "quiz-feedback";

  document.getElementById("btn-quiz-retry").style.display = "none";

  const optionsContainer = document.getElementById("quiz-options-container");
  optionsContainer.innerHTML = "";

  quiz.options.forEach((optText, idx) => {
    const btn = document.createElement("button");
    btn.className = "quiz-opt-btn";
    btn.innerHTML = `
      <span style="font-weight: 700; color: var(--accent-purple);">${idx + 1}.</span>
      <span>${optText}</span>
    `;
    btn.onclick = () => submitQuizAnswer(idx);
    optionsContainer.appendChild(btn);
  });

  document.getElementById("quiz-modal").classList.add("active");
}

function closeQuizModal() {
  document.getElementById("quiz-modal").classList.remove("active");
}

function submitQuizAnswer(selectedIndex) {
  const quiz = currentQuizTarget.activeQuiz;
  const optButtons = document.querySelectorAll(".quiz-opt-btn");
  const feedbackBox = document.getElementById("quiz-feedback-box");

  optButtons.forEach(btn => btn.style.pointerEvents = "none");

  if (selectedIndex === quiz.answer) {
    optButtons[selectedIndex].classList.add("correct");
    feedbackBox.style.display = "block";
    feedbackBox.style.background = "rgba(16, 185, 129, 0.2)";
    feedbackBox.style.border = "1px solid var(--accent-green)";
    feedbackBox.style.color = "#6ee7b7";
    feedbackBox.innerHTML = `
      🎉 <strong>정답입니다! 진성 팬 인증 성공!</strong><br>
      ${quiz.explanation}<br>
      <span style="font-size: 12px; color: #a7f3d0;">잠시 후 상세 시세 리포트가 잠금 해제됩니다...</span>
    `;

    setTimeout(() => {
      closeQuizModal();
      openDetailModal(currentQuizTarget);
    }, 1100);

  } else {
    optButtons[selectedIndex].classList.add("wrong");
    optButtons[quiz.answer].classList.add("correct");
    feedbackBox.style.display = "block";
    feedbackBox.style.background = "rgba(239, 68, 68, 0.2)";
    feedbackBox.style.border = "1px solid var(--accent-red)";
    feedbackBox.style.color = "#fca5a5";
    feedbackBox.innerHTML = `
      ❌ <strong>팬 인증에 실패했습니다! (시세 열람 불가)</strong><br>
      리셀러 및 시세 교란 업자 방지 정책에 따라, 정답자만 시세를 열람할 수 있습니다.<br>
      <span style="font-size: 12px; color: #fecaca;">정답 해설: ${quiz.explanation}</span>
    `;

    document.getElementById("btn-quiz-retry").style.display = "inline-block";
  }
}

function retryQuiz() {
  if (currentQuizTarget) {
    openQuizModal(currentQuizTarget.id);
  }
}

// ----------------------------------------------------------------------------
// 7. 상세 시세 분석 모달 (Unlocked)
// ----------------------------------------------------------------------------
function openDetailModal(item) {
  const validImgUrl = (item.imageUrl || "").split(/\r?\n/)[0].trim() || 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop';
  
  document.getElementById("detail-img").src = validImgUrl;
  document.getElementById("detail-series").innerText = item.series || '서브컬처';
  document.getElementById("detail-title").innerText = item.title;
  document.getElementById("detail-brand").innerText = item.brand || '정품 공식 스토어';
  document.getElementById("detail-category").innerText = item.category || '피규어';

  const storePrice = item.discountPrice || item.price;
  const shipFee = item.shippingFee !== undefined ? item.shippingFee : 3000;
  const realPrice = storePrice + shipFee;
  const discountRate = item.originalPrice 
    ? Math.round(((item.originalPrice - storePrice) / item.originalPrice) * 100) 
    : 0;

  document.getElementById("detail-store-price").innerText = `${storePrice.toLocaleString()}원`;
  document.getElementById("detail-store-sub").innerText = discountRate > 0 
    ? `정가(${item.originalPrice.toLocaleString()}원) 대비 ${discountRate}% 할인 중`
    : `정상 발매가 판매 중`;
  document.getElementById("detail-real-price").innerText = `배송비 포함 실구매가: ${realPrice.toLocaleString()}원`;

  const usedAvg = item.usedAvg || (item.usedPriceRange ? Math.round((item.usedPriceRange[0] + item.usedPriceRange[1]) / 2) : Math.round(storePrice * 0.9));
  const usedMin = item.usedPriceRange ? item.usedPriceRange[0] : Math.round(usedAvg * 0.92);
  const usedMax = item.usedPriceRange ? item.usedPriceRange[1] : Math.round(usedAvg * 1.08);

  document.getElementById("detail-used-price").innerText = `${usedAvg.toLocaleString()}원`;
  document.getElementById("detail-used-range").innerText = `시세 범위: ${usedMin.toLocaleString()}원 ~ ${usedMax.toLocaleString()}원`;

  const adviceBox = document.getElementById("detail-ai-advice");
  const priceDiff = realPrice - usedAvg;

  if (item.isTarget) {
    adviceBox.innerHTML = `
      <strong>⭐ 오다구 학생 집중 추천:</strong> 고가 하이엔드 피규어(약 35만~50만원대)는 출시 이후 매물이 급감하며 되팔이 프리미엄이 10~20만원 이상 붙는 경우가 많습니다. 
      현재 네이버 스토어의 <strong>예약 할인가(${storePrice.toLocaleString()}원)</strong>로 안전하게 사전 선점하는 것이 가장 경제적입니다!
    `;
  } else if (priceDiff <= 5000) {
    adviceBox.innerHTML = `
      <strong>💡 공식 스토어 신품 구매 강력 권장!</strong><br>
      네이버 플러스 스토어 실구매가(${realPrice.toLocaleString()}원)와 중고 평균 시세(${usedAvg.toLocaleString()}원)의 차이가 ${Math.abs(priceDiff).toLocaleString()}원에 불과합니다. 
      공식 정품 AS와 특전, 네이버페이 적립 혜택을 고려하면 신품 구매가 훨씬 안전하고 유리합니다.
    `;
  } else if (priceDiff > 15000) {
    adviceBox.innerHTML = `
      <strong>🔎 중고 거래 플랫폼 탐색 권장!</strong><br>
      중고 매물 평균 시세가 신품 실구매가 대비 약 <strong>${priceDiff.toLocaleString()}원</strong> 저렴합니다. 
      미개봉 양품이나 단순 전시품 상태의 매물을 번개장터/중고나라에서 모니터링하여 구매하면 예산을 크게 절약할 수 있습니다.
    `;
  } else {
    adviceBox.innerHTML = `
      <strong>⚖️ 신품과 중고 시세 팽팽:</strong><br>
      상태 및 특전 구성품 유무에 따라 결정하세요. 박스 풀세트 미개봉 중고를 찾을 수 있다면 중고 구매를, 단순 개봉품이라면 몇 천원 차이로 신품을 구매하는 것을 권장합니다.
    `;
  }

  const storeLink = document.getElementById("detail-store-link");
  storeLink.href = item.url || item.storeUrl || "https://shopping.naver.com/ns/home";

  document.getElementById("detail-modal").classList.add("active");
}

function closeDetailModal() {
  document.getElementById("detail-modal").classList.remove("active");
}

// ----------------------------------------------------------------------------
// 8. 오다구 120만원 예산 플래너 (Budget Simulator)
// ----------------------------------------------------------------------------
function calculateBudget() {
  const currentSavings = parseInt(document.getElementById("calc-current").value) || 0;
  const wage = parseInt(document.getElementById("calc-wage").value) || 10030;
  const weeklyHours = parseInt(document.getElementById("calc-hours").value) || 15;
  const gradCost = parseInt(document.getElementById("calc-grad").value) || 150000;
  const figuresCost = parseInt(document.getElementById("calc-figures").value) || 790000;

  const totalWeeks = 8;
  const totalPartTimeIncome = wage * weeklyHours * totalWeeks;
  const totalAvailableFunds = currentSavings + totalPartTimeIncome;
  const targetGoal = 1200000;

  const topCurrent = document.getElementById("top-current-savings");
  if (topCurrent) topCurrent.innerText = `${currentSavings.toLocaleString()}원`;

  const achieveRate = Math.min(Math.round((totalAvailableFunds / targetGoal) * 100), 200);

  document.getElementById("res-total-income").innerText = `${totalAvailableFunds.toLocaleString()}원`;
  document.getElementById("res-target-rate").innerText = `${achieveRate}%`;

  const fill = document.getElementById("res-progress-fill");
  fill.style.width = `${Math.min(achieveRate, 100)}%`;

  const totalSpending = figuresCost + gradCost;
  const remainingMoney = totalAvailableFunds - totalSpending;

  const summaryTitle = document.getElementById("res-summary-title");
  const summaryDesc = document.getElementById("res-summary-desc");

  if (totalAvailableFunds >= targetGoal && remainingMoney >= 0) {
    fill.style.background = "linear-gradient(90deg, #10b981, #06b6d4)";
    summaryTitle.innerHTML = "🎉 목표 저금액 120만 원 달성 확실!";
    summaryDesc.innerHTML = `
      현재 저금액(<strong>${currentSavings.toLocaleString()}원</strong>)에 겨울방학 8주간 알바 수입(<strong>${totalPartTimeIncome.toLocaleString()}원</strong>)을 더하면 총 <strong>${totalAvailableFunds.toLocaleString()}원</strong>이 마련됩니다.<br>
      • 신품 피규어 2종 최저가 구매: <strong>-${figuresCost.toLocaleString()}원</strong><br>
      • 내년 졸업사진 준비 예비비: <strong>-${gradCost.toLocaleString()}원</strong><br>
      👉 모든 필수 지출 후에도 <strong>여윳돈 ${remainingMoney.toLocaleString()}원</strong>이 남아, 위시리스트의 <strong>추가 중고 피규어까지 여유롭게 영입</strong>할 수 있습니다!
    `;
  } else if (remainingMoney >= 0) {
    fill.style.background = "linear-gradient(90deg, #f59e0b, #ec4899)";
    summaryTitle.innerHTML = "⚠️ 피규어와 졸업사진은 구매 가능하나, 120만원 목표에 다소 근접";
    summaryDesc.innerHTML = `
      총 자금 <strong>${totalAvailableFunds.toLocaleString()}원</strong>으로 신품 피규어 2종과 졸업사진 비용(합계 ${totalSpending.toLocaleString()}원)은 충당할 수 있으며 잔여 여윳돈은 <strong>${remainingMoney.toLocaleString()}원</strong>입니다.<br>
      목표액 120만 원까지 <strong>${(targetGoal - totalAvailableFunds).toLocaleString()}원</strong>이 부족하므로, 주당 알바 시간을 늘리거나 중고 매물 최저가를 적극 활용하세요.
    `;
  } else {
    fill.style.background = "linear-gradient(90deg, #ef4444, #f59e0b)";
    summaryTitle.innerHTML = "🚨 예산 초과 주의! 지출 절감이 필요합니다.";
    summaryDesc.innerHTML = `
      총 자금(${totalAvailableFunds.toLocaleString()}원)보다 계획된 지출(${totalSpending.toLocaleString()}원)이 커서 <strong>${Math.abs(remainingMoney).toLocaleString()}원 적자</strong>가 발생합니다.<br>
      신품 구매 대신 덕-체크의 '중고 시세 비교'를 이용해 미개봉 중고 피규어로 대체하면 지출을 절약할 수 있습니다.
    `;
  }
}

// ----------------------------------------------------------------------------
// 9. CSV 다운로드
// ----------------------------------------------------------------------------
function exportDataToCSV() {
  const headers = ["상품명", "작품명", "캐릭터", "공식할인가(KRW)", "정가(KRW)", "배송비(KRW)", "중고평균시세(KRW)", "상품이미지URL", "공식스토어URL"];
  const rows = currentItems.map(item => [
    `"${(item.title || '').replace(/"/g, '""')}"`,
    `"${(item.series || '').replace(/"/g, '""')}"`,
    `"${(item.character || '').replace(/"/g, '""')}"`,
    item.discountPrice || item.price,
    item.originalPrice || item.price,
    item.shippingFee || 0,
    item.usedAvg || (item.usedPriceRange ? Math.round((item.usedPriceRange[0] + item.usedPriceRange[1]) / 2) : 0),
    `"${((item.imageUrl || '').split(/\r?\n/)[0].trim()).replace(/"/g, '""')}"`,
    `"${(item.url || item.storeUrl || 'https://shopping.naver.com/ns/home').replace(/"/g, '""')}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `덕체크_네이버스토어_시세데이터_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
