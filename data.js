// ============================================================================
// 덕-체크 (Duck-Check) 데이터베이스 및 스크래핑 연동 모듈
// ============================================================================

const DUCK_DATABASE = {
  // 페르소나 오다구(18세) 프로필
  persona: {
    name: "오다구",
    age: 18,
    job: "고등학교 재학생 (겨울방학 학원 알바 예정)",
    hobbies: ["애니메이션/피규어 덕질", "음악 감상", "게임"],
    currentSavings: 250000,
    targetSavings: 1200000,
    mainTargets: [
      {
        id: "wish-01",
        title: "[예약 한정] 1/4 스케일 프리미엄 피규어 (오다구 최애 한정판)",
        character: "최애 캐릭터 A",
        series: "오다구 원픽",
        price: 470000,
        discountPrice: 470000,
        originalPrice: 500000,
        shippingFee: 0,
        usedAvg: 490000,
        usedPriceRange: [460000, 520000],
        imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&auto=format&fit=crop",
        url: "https://shopping.naver.com/ns/home",
        brand: "굿스마일 프리미엄",
        category: "스케일 피규어",
        isTarget: true,
        source: "페르소나 위시"
      },
      {
        id: "wish-02",
        title: "[예약] 1/7 스케일 딜럭스 에디션 피규어 (오다구 차애 스페셜)",
        character: "최애 캐릭터 B",
        series: "오다구 원픽",
        price: 320000,
        discountPrice: 320000,
        originalPrice: 350000,
        shippingFee: 3000,
        usedAvg: 330000,
        usedPriceRange: [310000, 360000],
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=500&auto=format&fit=crop",
        url: "https://shopping.naver.com/ns/home",
        brand: "알터 딜럭스",
        category: "스케일 피규어",
        isTarget: true,
        source: "페르소나 위시"
      }
    ]
  },

  // 작품별 덕력 인증 퀴즈 데이터베이스
  quizzes: {
    "주술회전": [
      {
        question: "주술회전의 '고죠 사토루'가 사용하는 무하한 주술의 극번이자 인력과 척력을 충돌시켜 만든 기술은?",
        options: ["술식 순전 '창'", "술식 반전 '혁'", "허식 '자'", "영역 전개 '복마어주자'"],
        answer: 2,
        explanation: "허식 '자'는 무하한 주술의 창(인력)과 혁(척력)을 충돌시켜 생성하는 고죠 사토루의 최강 술식입니다."
      },
      {
        question: "고죠 사토루의 영역 전개 명칭으로 올바른 것은?",
        options: ["무량공처 (無量空處)", "자폐원돈과 (自閉圓頓裹)", "탕탕평평", "복마어주자"],
        answer: 0,
        explanation: "고죠 사토루의 영역 전개는 상대의 뇌에 무한한 정보를 흘려보내는 '무량공처'입니다."
      }
    ],
    "나의 히어로 아카데미아": [
      {
        question: "'나의 히어로 아카데미아'의 주인공 미도리야 이즈쿠가 올마이트에게 계승받은 개성의 이름은?",
        options: ["폭파", "원 포 올 (One For All)", "반랭반열", "올 포 원 (All For One)"],
        answer: 1,
        explanation: "미도리야는 평화의 상징 올마이트로부터 '원 포 올'을 9대 계승자로 물려받았습니다."
      }
    ],
    "나루토 질풍전": [
      {
        question: "나루토 질풍전에 등장하는 아카츠키 멤버 '사소리'의 별칭은 무엇일까요?",
        options: ["붉은 모래의 사소리", "푸른 안개의 사소리", "검은 번개의 사소리", "황금 불꽃의 사소리"],
        answer: 0,
        explanation: "사소리는 모래 마을 출신의 천재 꼭두각시 술사로 '붉은 모래의 사소리'라 불립니다."
      },
      {
        question: "카카시 선생님이 사용하는 번개 속성의 오리지널 닌술은?",
        options: ["나선환", "치도리 (뇌절)", "화둔 호화구술", "사륜안 카무이"],
        answer: 1,
        explanation: "하타케 카카시가 개발한 번개 속성의 암살 술식이 '치도리(뇌절)'입니다."
      }
    ],
    "은혼": [
      {
        question: "은혼의 여주인공 카구라가 속한 우주 최강의 전투 종족 이름은?",
        options: ["야토족 (夜兎族)", "천인족", "귀병대", "진선조"],
        answer: 0,
        explanation: "카구라는 햇빛에 취약하지만 괴력을 지닌 우주 최강 전투 종족 '야토족'입니다."
      },
      {
        question: "진선조(신센구미)의 부장 히지카타 토시로의 광적인 최애 음식 조합은?",
        options: ["단팥빵과 녹차", "모든 음식 위에 마요네즈 듬뿍 (마요라)", "딸기 우유와 파르페", "매운 라멘"],
        answer: 1,
        explanation: "히지카타는 밥이나 커피에도 마요네즈를 뿌려 먹는 지독한 '마요라'입니다."
      }
    ],
    "헌터X헌터": [
      {
        question: "환영여단의 단장 '클로로 루실후르'의 넨 능력(도적의 극의)의 특징은?",
        options: ["타인의 넨 능력을 책에 훔쳐와 사용한다", "번개를 전신에 둘러 초고속 이동한다", "사슬로 상대를 포박한다", "카드를 던져 폭발시킨다"],
        answer: 0,
        explanation: "클로로의 능력은 조건을 만족하여 타인의 넨 능력을 책에 수록하고 사용하는 '스킬 헌터'입니다."
      },
      {
        question: "히소카 모로가 사용하는 껌과 고무의 성질을 지닌 오라 기술의 이름은?",
        options: ["깜짝 텍스처", "번지 검 (Bungee Gum)", "드래곤 다이브", "백식관음"],
        answer: 1,
        explanation: "히소카의 주력 오라 기술은 어린 시절 좋아한 껌 브랜드에서 딴 '번지 검'입니다."
      }
    ],
    "장송의 프리렌": [
      {
        question: "천 년 이상 살아온 엘프 마법사 '프리렌'이 마왕을 토벌한 용사 파티의 리더는 누구였을까요?",
        options: ["하이터", "아이젠", "힘멜", "슈타르크"],
        answer: 2,
        explanation: "프리렌에게 인간의 따뜻함과 기억의 소중함을 알려준 용사는 '힘멜'입니다."
      }
    ],
    "괴수 8호": [
      {
        question: "괴수 8호 방위대 제1부대 대장이자 최강의 대괴수 실력자인 '나루미 겐'의 취미는?",
        options: ["요리하기", "게임과 프라모델 수집 (덕질)", "마라톤", "독서"],
        answer: 1,
        explanation: "나루미 겐 대장은 작전 시에는 압도적이지만 평소에는 방에서 게임과 피규어 수집에 빠져 사는 겜덕후 캐릭터입니다."
      }
    ],
    "체인소맨": [
      {
        question: "체인소맨 레제편의 여주인공 '레제'의 정체이자 계약한 악마는?",
        options: ["폭탄의 악마 (밤)", "피의 악마", "여우의 악마", "총의 악마"],
        answer: 0,
        explanation: "레제는 목의 핀을 뽑아 폭발을 일으키며 변신하는 '폭탄의 악마(밤)' 하이브리드입니다."
      }
    ],
    "사이버포뮬러": [
      {
        question: "사이버포뮬러의 주인공 카자미 하야토가 탑승하는 인공지능 네비게이션 시스템 머신의 이름은?",
        options: ["아스라다 (ASURADA)", "오거 (OGRE)", "가랜드", "이슈자크"],
        answer: 0,
        explanation: "카자미 하야토의 성장과 함께 학습하는 인공지능 뉴로 컴퓨터 머신은 '아스라다'입니다."
      }
    ],
    "원피스": [
      {
        question: "하트 해적단의 선장이자 '수술수술 열매'의 능력자인 트라팔가 로우의 풀네임에 숨겨진 이름은?",
        options: ["몽키 D.", "골 D.", "트라팔가 D. 워텔 로우", "포트거스 D."],
        answer: 2,
        explanation: "로우의 본명은 D의 일족인 '트라팔가 D. 워텔 로우'입니다."
      }
    ],
    "드래곤볼": [
      {
        question: "드래곤볼에서 소원을 들어주는 신룡을 소환하기 위해 모아야 하는 드래곤볼의 총 개수는?",
        options: ["5개", "6개", "7개", "8개"],
        answer: 2,
        explanation: "드래곤볼은 1성구부터 7성구까지 총 7개입니다."
      }
    ],
    "블리치": [
      {
        question: "바이저드의 리더이자 호정 13대 5번대 대장인 '히라코 신지'의 참백도 참백도 해방 언령과 명칭은?",
        options: ["쓰러져라, 역무", "흩날려라, 천본앵", "울부짖어라, 비매", "깨어져라, 경화수월"],
        answer: 0,
        explanation: "히라코 신지의 참백도는 시야와 감각을 상하좌우 반전시키는 '쓰러져라, 역무(逆撫)'입니다."
      }
    ],
    "도검난무": [
      {
        question: "도검난무의 순백의 태도 '츠루마루 쿠니나가'가 입에 달고 사는 말버릇은?",
        options: ["놀라움이 필요해!", "명예를 지키겠다", "차 한잔의 여유", "베어 넘기겠다"],
        answer: 0,
        explanation: "츠루마루 쿠니나가는 지루함을 질색하고 인생에 '놀라움(경악)'이 중요하다고 강조하는 캐릭터입니다."
      }
    ],
    "에일리언 스테이지": [
      {
        question: "에일리언 스테이지(ALNST)에서 틸(Till)을 향한 깊은 집착과 서사를 보여주는 캐릭터는?",
        options: ["이반 (Ivan)", "루카 (Luka)", "미지 (Mizi)", "수아 (Sua)"],
        answer: 0,
        explanation: "이반은 틸에 대한 감정과 비극적인 무대로 큰 반향을 일으킨 에일리언 스테이지의 주역입니다."
      }
    ],
    "기본": [
      {
        question: "피규어 덕질 용어 중 '재판(再版)'의 올바른 의미는?",
        options: ["법원에서 다시 재판을 받는 것", "인기 있는 기존 발매 제품을 제조사에서 다시 생산하여 판매하는 것", "중고로 되파는 것", "도색이 불량하여 교환받는 것"],
        answer: 1,
        explanation: "'재판'은 수요가 높은 인기 피규어를 제조사에서 다시 생산해 출시하는 정규 재생산 방식입니다."
      }
    ]
  },

  // Thunderbit 크롤러로 네이버 플러스 스토어에서 직접 수집된 실데이터 (총 30개 전체 연동)
  items: [
    {
      id: "csv-01",
      title: "[예약] 나의 히어로 아카데미아 룩업 미니어처 컬렉션 (4종세트)",
      series: "나의 히어로 아카데미아",
      character: "미도리야/바쿠고/토도로키/우라라카",
      price: 32000,
      originalPrice: 38000,
      shippingFee: 3000,
      usedAvg: 27000,
      usedPriceRange: [24000, 30000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13795779085",
      imageUrl: "https://shop-phinf.pstatic.net/20261008_28/17914370603977HTn2_JPEG/67055158896751522_151854957.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-02",
      title: "고죠 사토루 고전 버전 룩업 l 주술회전 (재판)",
      series: "주술회전",
      character: "고죠 사토루",
      price: 40000,
      originalPrice: 48000,
      shippingFee: 3000,
      usedAvg: 42000,
      usedPriceRange: [38000, 46000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13330454771",
      imageUrl: "https://shop-phinf.pstatic.net/20260402_210/177510038233983NwK_JPEG/109233285459494141_1826322412.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-03",
      title: "[예약] 사소리 룩업 l 나루토 질풍전 (재판)",
      series: "나루토 질풍전",
      character: "사소리",
      price: 42000,
      originalPrice: 49000,
      shippingFee: 3000,
      usedAvg: 44000,
      usedPriceRange: [40000, 48000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13844573053",
      imageUrl: "https://shop-phinf.pstatic.net/20261105_154/1793855091371Ad0Nw_JPEG/33190363207214176_1419594358.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-04",
      title: "[예약] 데스크탑 리얼 맥코이 EX 손오공 브루마 공룡 l 드래곤볼",
      series: "드래곤볼",
      character: "손오공, 브루마",
      price: 305000,
      originalPrice: 340000,
      shippingFee: 0,
      usedAvg: 310000,
      usedPriceRange: [290000, 330000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13853021414",
      imageUrl: "https://shop-phinf.pstatic.net/20261105_183/1793836913119GzYHh_JPEG/127969885228056917_1208594607.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-05",
      title: "[예약] GEM 테노히라 카구라짱 l 은혼",
      series: "은혼",
      character: "카구라",
      price: 80000,
      originalPrice: 92000,
      shippingFee: 0,
      usedAvg: 72000,
      usedPriceRange: [65000, 78000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13850935059",
      imageUrl: "https://shop-phinf.pstatic.net/20261104_96/1793782731838WGY6T_JPEG/111098802769920236_26562302.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-06",
      title: "[예약] GEM 테노히라 카츠라씨 l 은혼",
      series: "은혼",
      character: "카츠라 코타로",
      price: 80000,
      originalPrice: 92000,
      shippingFee: 0,
      usedAvg: 74000,
      usedPriceRange: [68000, 79000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13850932288",
      imageUrl: "https://shop-phinf.pstatic.net/20261104_169/1793782700051N2J5v_JPEG/127915548072309917_84180934.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-07",
      title: "[예약][특전] 2종세트 클로로 히소카 룩업 l 헌터X헌터",
      series: "헌터X헌터",
      character: "클로로, 히소카",
      price: 104000,
      originalPrice: 120000,
      shippingFee: 0,
      usedAvg: 105000,
      usedPriceRange: [95000, 115000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13850867728",
      imageUrl: "https://shop-phinf.pstatic.net/20261104_215/1793783368943gwkgN_JPEG/10984330855759137_1379181962.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-08",
      title: "[예약] 클로로 룩업 l 헌터x헌터",
      series: "헌터X헌터",
      character: "클로로 루실후르",
      price: 44000,
      originalPrice: 51000,
      shippingFee: 3000,
      usedAvg: 45000,
      usedPriceRange: [41000, 48000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13850718970",
      imageUrl: "https://shop-phinf.pstatic.net/20261104_256/17937832833952V34R_JPEG/107718964340502841_526501048.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-09",
      title: "[예약][특전] 나루미 겐 의욕 버전 룩업 l 괴수 8호",
      series: "괴수 8호",
      character: "나루미 겐",
      price: 56000,
      originalPrice: 65000,
      shippingFee: 0,
      usedAvg: 58000,
      usedPriceRange: [53000, 63000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13753094834",
      imageUrl: "https://shop-phinf.pstatic.net/20260805_12/17859148551505uidz_JPEG/120047660207135183_1280122473.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-10",
      title: "[예약] 배리어블 액션 2nd LAP 슈퍼 아스라다 SA-01/C l 사이버포뮬러",
      series: "사이버포뮬러",
      character: "카자미 하야토 / 아스라다",
      price: 256000,
      originalPrice: 285000,
      shippingFee: 0,
      usedAvg: 255000,
      usedPriceRange: [240000, 270000],
      brand: "메가하우스",
      category: "완제품 모델",
      url: "https://brand.naver.com/megahouse/products/13746547654",
      imageUrl: "https://shop-phinf.pstatic.net/20260909_57/1788936769705zlIJn_JPEG/123069536141124357_2134225613.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-11",
      title: "[예약] POP SOC 트라팔가 로우 R 버전 l 원피스",
      series: "원피스",
      character: "트라팔가 로우",
      price: 221000,
      originalPrice: 245000,
      shippingFee: 0,
      usedAvg: 215000,
      usedPriceRange: [200000, 230000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13694631607",
      imageUrl: "https://shop-phinf.pstatic.net/20260803_205/1785741653355UO5Gx_JPEG/41561584467720748_1569280694.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-12",
      title: "주술회전 5주년 룩업 판초 2종 (고죠 사토루, 게토 스구루)",
      series: "주술회전",
      character: "고죠 사토루, 게토 스구루",
      price: 19000,
      originalPrice: 24000,
      shippingFee: 3000,
      usedAvg: 18000,
      usedPriceRange: [15000, 20000],
      brand: "메가하우스",
      category: "굿즈 소품",
      url: "https://brand.naver.com/megahouse/products/13337277969",
      imageUrl: "https://shop-phinf.pstatic.net/20260401_193/1775028810011oqPMC_JPEG/4948231119311727_1535100469.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-13",
      title: "[특전] 2종세트 이반 틸 룩업 l 에일리언 스테이지",
      series: "에일리언 스테이지",
      character: "이반, 틸",
      price: 111000,
      originalPrice: 125000,
      shippingFee: 0,
      usedAvg: 118000,
      usedPriceRange: [110000, 130000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13337251065",
      imageUrl: "https://shop-phinf.pstatic.net/20260612_184/1781244728293tLK6D_JPEG/514273425834785_690016069.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-14",
      title: "GEM 테노히라 하타케 카카시 선생님 l 나루토 질풍전 (재판)",
      series: "나루토 질풍전",
      character: "하타케 카카시",
      price: 80000,
      originalPrice: 90000,
      shippingFee: 0,
      usedAvg: 75000,
      usedPriceRange: [70000, 82000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13327311141",
      imageUrl: "https://shop-phinf.pstatic.net/20260330_57/1774859945654jPeBq_JPEG/92554024452393234_1417581761.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-15",
      title: "GEM 테노히라 히지카타상 (히지카타 토시로) l 은혼",
      series: "은혼",
      character: "히지카타 토시로",
      price: 80000,
      originalPrice: 90000,
      shippingFee: 0,
      usedAvg: 73000,
      usedPriceRange: [68000, 80000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/11668218771",
      imageUrl: "https://shop-phinf.pstatic.net/20250930_228/1759209792617vdUP8_JPEG/9073444153923312_1164342502.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-16",
      title: "[예약][특전미포함] 2종세트 클로로 히소카 룩업 l 헌터X헌터",
      series: "헌터X헌터",
      character: "클로로, 히소카",
      price: 88000,
      originalPrice: 99000,
      shippingFee: 0,
      usedAvg: 85000,
      usedPriceRange: [79000, 90000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13850863201",
      imageUrl: "https://shop-phinf.pstatic.net/20261104_24/179378336439825bPV_JPEG/33953302518905947_422528697.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-17",
      title: "[예약] 히소카 룩업 l 헌터x헌터",
      series: "헌터X헌터",
      character: "히소카",
      price: 44000,
      originalPrice: 51000,
      shippingFee: 3000,
      usedAvg: 43000,
      usedPriceRange: [39000, 46000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13850839863",
      imageUrl: "https://shop-phinf.pstatic.net/20261104_68/1793783325136go7Ej_JPEG/10984287049121888_366550880.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-18",
      title: "[예약] 츠루마루 쿠니나가 룩업 l 도검난무",
      series: "도검난무",
      character: "츠루마루 쿠니나가",
      price: 49000,
      originalPrice: 55000,
      shippingFee: 3000,
      usedAvg: 48000,
      usedPriceRange: [44000, 52000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13850585900",
      imageUrl: "https://shop-phinf.pstatic.net/20261104_189/1793780299441emY5p_JPEG/85124165743118492_2026827044.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-19",
      title: "[예약] 오챠토모 시리즈 체인소맨 레제편 BREAK TIME CAFE (6종세트)",
      series: "체인소맨",
      character: "덴지, 레제, 파워, 아키 등",
      price: 54000,
      originalPrice: 62000,
      shippingFee: 0,
      usedAvg: 50000,
      usedPriceRange: [45000, 55000],
      brand: "메가하우스",
      category: "미니 피규어",
      url: "https://brand.naver.com/megahouse/products/13850446632",
      imageUrl: "https://shop-phinf.pstatic.net/20261105_97/1793837768672IzJm9_JPEG/14509615335185625_101869142.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-20",
      title: "[예약] 셋쇼마루 룩업 l 이누야샤 (재판)",
      series: "이누야샤",
      character: "셋쇼마루",
      price: 44000,
      originalPrice: 50000,
      shippingFee: 3000,
      usedAvg: 43000,
      usedPriceRange: [39000, 47000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13844429396",
      imageUrl: "https://shop-phinf.pstatic.net/20250903_117/1756884823548brmJj_JPEG/3785563794807791_1128496949.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-21",
      title: "[예약] 메가캣 냥토 거대한 냐루토 리부트 우즈마키 나루토 l 나루토 질풍전 (재판)",
      series: "나루토 질풍전",
      character: "우즈마키 나루토",
      price: 42000,
      originalPrice: 48000,
      shippingFee: 3000,
      usedAvg: 40000,
      usedPriceRange: [36000, 43000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13844405647",
      imageUrl: "https://shop-phinf.pstatic.net/20261102_69/1793586519242Cs51V_JPEG/127719453258541257_1819502267.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-22",
      title: "[예약] 메가캣 냥토 거대한 냐루토 리부트 우치하 사스케 l 나루토 질풍전 (재판)",
      series: "나루토 질풍전",
      character: "우치하 사스케",
      price: 42000,
      originalPrice: 48000,
      shippingFee: 3000,
      usedAvg: 40000,
      usedPriceRange: [36000, 43000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13844393502",
      imageUrl: "https://shop-phinf.pstatic.net/20261102_30/1793586299134S38IW_JPEG/36600876948709917_1648910833.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-23",
      title: "[예약] 메가캣 냥토 거대한 냐루토 리부트 하타케 카카시 l 나루토 질풍전 (재판)",
      series: "나루토 질풍전",
      character: "하타케 카카시",
      price: 42000,
      originalPrice: 48000,
      shippingFee: 3000,
      usedAvg: 41000,
      usedPriceRange: [37000, 44000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13844377626",
      imageUrl: "https://shop-phinf.pstatic.net/20261102_49/1793585780362IOH16_JPEG/2859981251459297_1145173973.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-24",
      title: "[예약] 메가캣 냥토 거대한 냐루토 리부트 우치하 이타치 l 나루토 질풍전 (재판)",
      series: "나루토 질풍전",
      character: "우치하 이타치",
      price: 42000,
      originalPrice: 48000,
      shippingFee: 3000,
      usedAvg: 43000,
      usedPriceRange: [39000, 47000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13844368631",
      imageUrl: "https://shop-phinf.pstatic.net/20261102_136/1793585540105d2EDz_JPEG/127718388114518125_1417645276.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-25",
      title: "[예약] GEM 시리즈 레나몬&은세나(마키노 루키) l 디지몬 테이머즈 (재판)",
      series: "디지몬 테이머즈",
      character: "은세나, 레나몬",
      price: 108000,
      originalPrice: 125000,
      shippingFee: 0,
      usedAvg: 106000,
      usedPriceRange: [98000, 115000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13794200458",
      imageUrl: "https://shop-phinf.pstatic.net/20261006_199/1791265157615ATbhK_JPEG/18679011738917473_1502716137.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-26",
      title: "[예약][특전미포함] 2종세트 크라피카 레오리오 룩업 l 헌터x헌터",
      series: "헌터X헌터",
      character: "크라피카, 레오리오",
      price: 88000,
      originalPrice: 99000,
      shippingFee: 0,
      usedAvg: 86000,
      usedPriceRange: [80000, 92000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13746516137",
      imageUrl: "https://shop-phinf.pstatic.net/20260909_168/17889403456049VrdT_JPEG/37495230448916538_122214549.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-27",
      title: "[예약] 프리렌 룩업 l 장송의 프리렌 (재판)",
      series: "장송의 프리렌",
      character: "프리렌",
      price: 44000,
      originalPrice: 52000,
      shippingFee: 3000,
      usedAvg: 46000,
      usedPriceRange: [42000, 50000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13746371361",
      imageUrl: "https://shop-phinf.pstatic.net/20260911_186/17890969636601aM63_JPEG/19502616479696026_1730334874.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-28",
      title: "[예약] 카구라 룩업 l 은혼 (재판)",
      series: "은혼",
      character: "카구라",
      price: 42000,
      originalPrice: 48000,
      shippingFee: 3000,
      usedAvg: 40000,
      usedPriceRange: [37000, 44000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13746362325",
      imageUrl: "https://shop-phinf.pstatic.net/20260909_2/1788920400760Cr3t9_JPEG/11473681898974694_574847210.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-29",
      title: "[예약][특전] 2종세트 이루마 오페라 룩업 l 악마 입문했습니다 이루마군",
      series: "악마 입문했습니다 이루마군",
      character: "이루마, 오페라",
      price: 107000,
      originalPrice: 122000,
      shippingFee: 0,
      usedAvg: 105000,
      usedPriceRange: [98000, 114000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13700586573",
      imageUrl: "https://shop-phinf.pstatic.net/20260805_140/1785918320481EckG8_JPEG/17133933468388002_653609621.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    },
    {
      id: "csv-30",
      title: "[예약] 히라코 신지 룩업 l 블리치",
      series: "블리치",
      character: "히라코 신지",
      price: 46000,
      originalPrice: 53000,
      shippingFee: 3000,
      usedAvg: 45000,
      usedPriceRange: [41000, 49000],
      brand: "메가하우스",
      category: "피규어",
      url: "https://brand.naver.com/megahouse/products/13700486222",
      imageUrl: "https://shop-phinf.pstatic.net/20260807_209/1786083125743XJYhI_JPEG/9839564556647514_152359114.jpg?type=f500_500",
      source: "네이버 스크래퍼"
    }
  ]
};
