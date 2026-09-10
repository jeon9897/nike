//------------------------------ 헤더 padding-top 조정

window.addEventListener('scroll', function() {
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const navTop = nav.offsetTop;

  if (window.scrollY >= navTop - 80) {
    header.classList.remove('pt30');
  } else {
    header.classList.add('pt30');
  }
});


//------------------------------ 스크롤 잠금 / 해제 함수
function lockScroll() {
  const scrollY = window.scrollY;
  document.body.classList.add('scroll-locked');
  document.body.style.top = `-${scrollY}px`;
  document.body.dataset.scrollY = scrollY;
}

function unlockScroll() {
  const scrollY = parseInt(document.body.dataset.scrollY || '0');
  document.body.classList.remove('scroll-locked');
  document.body.style.top = '';
  window.scrollTo(0, scrollY);
}

//------------------------------ 중간 이미지 확대 → 축소 스크롤 이벤트

let isScrollLocked = false;
let scrollCount = 0;
const maxScrollCount = 5;
let hasTriggered = false;
let isTransitioning = false;

// 화면 스크롤 감지
window.addEventListener('scroll', function() {
  const midImg = document.querySelector('.mid_img');
  const rect = midImg.getBoundingClientRect();

  if (rect.top <= 0 && rect.bottom >= 0 && !isScrollLocked && !hasTriggered) {
    lockScroll();
    midImg.classList.add('scroll-active');
    isScrollLocked = true;
    scrollCount = 0;
  }
});

// 휠 이벤트
window.addEventListener('wheel', function(e) {
  if (isScrollLocked && !hasTriggered && !isTransitioning) {
    e.preventDefault();
    const img = document.querySelector('.mid_img > img');
    const midImg = document.querySelector('.mid_img');

    if (e.deltaY > 0) {
      scrollCount++;
      const progress = scrollCount / maxScrollCount;
      const scale = 2 - progress;
      img.style.transform = `scale(${Math.max(scale, 1)})`;

      if (scrollCount >= maxScrollCount) {
        img.style.transform = `scale(1)`;
        isTransitioning = true;

        setTimeout(() => {
          unlockScroll();
          midImg.classList.remove('scroll-active');

          hasTriggered = true;
          isTransitioning = false;
        }, 500);
      }
    }
  }
}, { passive: false });

// 터치 이벤트
let touchStartY = 0;
let isTouch = false;

window.addEventListener('touchstart', function(e) {
  touchStartY = e.touches[0].clientY;
  isTouch = false;
});

window.addEventListener('touchmove', function(e) {
  if (isScrollLocked && !hasTriggered && !isTransitioning) {
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartY - touchY;

    if (deltaY > 50 && !isTouch) {
      isTouch = true;
      touchStartY = touchY;
      const img = document.querySelector('.mid_img > img');
      const midImg = document.querySelector('.mid_img');
      scrollCount++;
      const progress = scrollCount / maxScrollCount;
      const scale = 2 - progress;
      img.style.transform = `scale(${Math.max(scale, 1)})`;

      if (scrollCount >= maxScrollCount) {
        img.style.transform = `scale(1)`;
        isTransitioning = true;

        setTimeout(() => {
          unlockScroll();
          midImg.classList.remove('scroll-active');

          hasTriggered = true;
          isTransitioning = false;
        }, 500);
      }
    }
  }
}, { passive: false });

window.addEventListener('touchend', function() {
  isTouch = false;
});

//------------------------------ 선수 이름 호버 시 데이터 교체 + 자동 전환 기능

const heroData = {
  jordan: { name: '마이클 조던', position: '농구선수', achievement1: '6개의 NBA 챔피언십 / 5회 MVP', achievement2: 'NBA 역사상 최고의 선수', image: './images/hero_Jordan.png' },
  serena: { name: '세레나 윌리엄스', position: '테니스선수', achievement1: '23개의 그랜드슬램 단식 타이틀', achievement2: '끊임없는 도전을 보여준 전설적인 여정', image: './images/hero_serena.png' },
  ronaldo: { name: '크리스티아누 호날두', position: '축구선수', achievement1: 'UEFA 챔피언스리그 5회 우승 / 발롱도르 5회 수상', achievement2: '불가능을 가능으로 만든 아이콘', image: './images/hero_ronaldo.png' },
  lebron: { name: '르브론 제임스', position: '농구선수', achievement1: '4회 NBA 챔피언 / 4회 MVP', achievement2: '코트를 넘어 사회 변화를 이끄는 진정한 킹', image: './images/hero_lebron.png' },
  son: { name: '손흥민', position: '축구선수', achievement1: '프리미어리그 2회 골든부츠 수상', achievement2: '전 세계 팬들에게 사랑받는 축구 스타', image: './images/hero_son.png' },
  simone: { name: '시몬 바일스', position: '체조선수', achievement1: '7개의 올림픽 메달 보유', achievement2: '역동적 기술과 강인한 정신력의 소유자', image: './images/hero_simone.png' }
};

const heroItems = document.querySelectorAll('.ambassador ul li');
const changeWrap = document.querySelector('.change_wrap');
const heroImage = document.getElementById('heroImage');
const heroName = document.getElementById('heroName');
const heroPosition = document.getElementById('heroPosition');
const heroAchievement1 = document.getElementById('heroAchievement1');
const heroAchievement2 = document.getElementById('heroAchievement2');

// 자동 전환을 위한 변수들
let currentHeroIndex = 0;
let heroIntervalTime = 2000; // 3초마다 변경
let heroIntervalId;

function changeHeroContent(heroKey) {
  const hero = heroData[heroKey];
  changeWrap.classList.remove('active');
  heroImage.style.opacity = '0';

  setTimeout(() => {
    heroImage.src = hero.image;
    heroName.textContent = hero.name;
    heroPosition.textContent = hero.position;
    heroAchievement1.textContent = hero.achievement1;
    heroAchievement2.textContent = hero.achievement2;
    heroImage.style.opacity = '1';

    setTimeout(() => {
      changeWrap.classList.add('active');
    }, 100);
  }, 200);
}

// 자동 전환을 시작하는 함수
function startHeroInterval() {
  heroIntervalId = setInterval(function() {
    heroItems[currentHeroIndex].classList.remove('active');
    currentHeroIndex = (currentHeroIndex + 1) % heroItems.length;
    heroItems[currentHeroIndex].classList.add('active');
    
    const heroKey = heroItems[currentHeroIndex].getAttribute('data-hero');
    changeHeroContent(heroKey);
  }, heroIntervalTime);
}

// 호버 이벤트 및 자동 전환 로직
heroItems.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    clearInterval(heroIntervalId); // 자동 전환 멈춤
    
    heroItems.forEach(li => li.classList.remove('active'));
    item.classList.add('active');
    currentHeroIndex = index; // 현재 인덱스 업데이트
    
    const heroKey = item.getAttribute('data-hero');
    changeHeroContent(heroKey);
  });
  
  item.addEventListener('mouseleave', () => {
    startHeroInterval(); // 자동 전환 재시작
  });
});

document.addEventListener('DOMContentLoaded', () => {
  heroItems[0].classList.add('active');
  startHeroInterval(); // 자동 전환 시작
});


//------------------------------ nav a 클릭시 부드럽게 링크 이동
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // 기본 앵커 이동 막기
    const targetId = this.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);

    targetEl.scrollIntoView({ 
      behavior: 'smooth', // JS에서 부드럽게 이동
      block: 'start'      // 섹션의 시작 부분에 맞춤
    });
  });
});


//------------------------------ 스크롤 시 글만 움직이기
class HistoryScrollLock {
  constructor() {
    this.historySection = document.getElementById('history');
    this.timelineContainer = document.getElementById('timeline');

    // 요소가 없으면 실행하지 않음
    if (!this.historySection || !this.timelineContainer) {
      return;
    }

    this.isScrollLocked = false;
    this.init();
  }

  init() {
    // 윈도우 스크롤 이벤트 감지
    window.addEventListener('scroll', () => this.checkSectionPosition());
    
    // 휠 이벤트를 감지하여 dl로 전달
    window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    
    // 키보드 이벤트 감지
    window.addEventListener('keydown', (e) => this.handleKeyDown(e), { passive: false });
  }

  checkSectionPosition() {
    const rect = this.historySection.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // history 섹션이 뷰포트 상단에서 30px 지점에 도달하면 스크롤 잠금
    // rect.top <= 50 으로 수정
    if (rect.top <= 90 && rect.bottom >= windowHeight * 0.9 && !this.isScrollLocked) {
      this.lockScroll();
    }
  }

  handleWheel(e) {
    if (this.isScrollLocked) {
      e.preventDefault(); // 페이지 스크롤 방지
      const direction = e.deltaY > 0 ? 1 : -1;
      const scrollAmount = Math.abs(e.deltaY);

      // 휠 이벤트를 dl 컨테이너로 전달
      this.timelineContainer.scrollTop += direction * scrollAmount * 0.8;

      // dl 스크롤이 끝에 도달했는지 확인
      this.checkTimelineEnd();
    }
  }

  handleKeyDown(e) {
    if (this.isScrollLocked) {
      const scrollKeys = ['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End', ' '];
      if (scrollKeys.includes(e.key)) {
        e.preventDefault(); // 페이지 스크롤 방지
        let scrollAmount = 0;
        if (e.key === 'ArrowDown') scrollAmount = 50;
        else if (e.key === 'ArrowUp') scrollAmount = -50;
        else if (e.key === 'PageDown' || e.key === ' ') scrollAmount = 200;
        else if (e.key === 'PageUp') scrollAmount = -200;

        this.timelineContainer.scrollTop += scrollAmount;
        this.checkTimelineEnd();
      }
    }
  }

  checkTimelineEnd() {
    const container = this.timelineContainer;
    const isAtEnd = container.scrollHeight - container.scrollTop <= container.clientHeight + 1;
    const isAtStart = container.scrollTop <= 1;

    // dl 스크롤이 끝에 도달했거나 맨 위로 돌아왔을 때 잠금 해제
    if (isAtEnd || isAtStart) {
      this.unlockScroll();
    }
  }

  lockScroll() {
    this.isScrollLocked = true;
    document.body.style.overflow = 'hidden';
    this.timelineContainer.style.overflowY = 'auto';
    this.timelineContainer.focus(); // 키보드 스크롤을 위해 포커스 설정
  }

  unlockScroll() {
    if (!this.isScrollLocked) return;
    this.isScrollLocked = false;
    document.body.style.overflow = '';
    this.timelineContainer.style.overflowY = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HistoryScrollLock();
});


//------------------------------ 넘버 오르면서 카운팅 되는 애니메이션

// 페이지 로딩이 완료되면 실행
$(document).ready(function() {
  var isAnimated = false;
  var moveSection = $('#move');

  // 카운팅 애니메이션 실행 함수
  function startCountingAnimation() {
    $('.counting').each(function() {
      var $this = $(this),
          countTo = parseInt($this.attr('data-count'), 10);
      
      $({ countNum: $this.text() }).animate({
        countNum: countTo
      },
      {
        duration: 3000,
        easing: 'linear',
        step: function() {
          $this.text(Math.floor(this.countNum));
        },
        complete: function() {
          $this.text(this.countNum);
        }
      });
    });
  }

  // 스크롤 이벤트 핸들러
  $(window).on('scroll', function() {
    var windowBottom = $(window).scrollTop() + $(window).height();
    var sectionTop = moveSection.offset().top;

    // #move 섹션이 화면 하단에서 보이기 시작하고 아직 애니메이션이 실행되지 않았을 때
    if (windowBottom > sectionTop + 100 && !isAnimated) {
      startCountingAnimation();
      isAnimated = true;
    }
  });

  // 페이지 로드 시에도 스크롤 위치를 한 번 확인하여 이미 섹션이 보인다면 애니메이션 실행
  $(window).trigger('scroll');
});


//------------------------------ move 섹션 li hover 시 백그라운드 이미지 표시

$('.move ul li').hover(
  function() {
    // 마우스가 li 안으로 들어올 때
    $(this).addClass('active');
  },
  function() {
    // 마우스가 li 밖으로 나갈 때
    $(this).removeClass('active');
  }
);