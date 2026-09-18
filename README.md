# portfolio_web

이지원의 포트폴리오 사이트입니다. 빌드 과정 없이 HTML, CSS, JS만으로 만든 정적 사이트이고, GitHub Pages로 배포합니다.

배포 주소: https://jiwonlee42.github.io/portfolio_web/

## 구조

```
site/                  배포되는 폴더 (이 안의 파일만 공개됩니다)
  index.html           홈
  projects/            프로젝트 상세 4페이지
  404.html
  assets/
    style.css          스타일. 색은 Wanted Montage semantic 토큰
    site.js            언어/테마 전환, 메뉴, 스크롤 리빌, 목차, GitHub 활동 그래프
    variants.js        ?c=코드 로 열었을 때 바뀌는 내용 (아래 참고)
    data/contributions.js   GitHub 기여 데이터 (자동 갱신)
    img/
scripts/update-contributions.py
.github/workflows/pages.yml
```

## 로컬에서 보기

```bash
python3 -m http.server 4173 --directory site
```

브라우저에서 http://localhost:4173 을 엽니다. `site/index.html`을 파일로 바로 열어도 됩니다.

## 내용 고치기

- 텍스트는 각 HTML 안에 있고, 모든 문장은 `data-l="ko"`와 `data-l="en"` 한 쌍으로 들어 있습니다. 한쪽만 고치면 다른 언어와 어긋나니 같이 고칩니다.
- 기본 언어는 한국어입니다. 주소 뒤에 `?lang=en`을 붙이면 영어로 열립니다.

## 상대에 따라 다르게 보이기 (`?c=코드`)

`site/assets/variants.js`에 코드별 설정을 적고, 주소 뒤에 `?c=코드`를 붙여 공유합니다.

```
https://jiwonlee42.github.io/portfolio_web/?c=infra
```

바꿀 수 있는 것: 히어로 두 줄, 프로젝트 카드 순서, 기술 스택 그룹 순서, 푸터 문장, 탭 제목.
이 방식으로 열린 페이지는 검색 결과에서 제외(noindex)되고, 다른 페이지로 이동해도 코드가 유지됩니다.
같은 탭에서 기본 화면으로 돌아가려면 `?c=none`처럼 없는 코드로 한 번 열면 됩니다.

주의:
- 이 파일과 코드는 **공개**됩니다. 회사 이름을 코드로 쓰지 말고 의미 없는 짧은 코드(예: `k7f3`)를 쓰세요. 코드와 회사의 대응표는 비공개 메모에 따로 둡니다.
- 사실인 내용만 적습니다.

## GitHub 활동 그래프

`site/assets/data/contributions.js`가 그래프 데이터입니다. 배포할 때마다, 그리고 매주 월요일에 Actions가 최신 값으로 새로 받아 배포합니다(저장소의 파일은 바뀌지 않습니다). 저장소의 값을 직접 갱신하려면:

```bash
python3 scripts/update-contributions.py
```

## 배포

`main`에 푸시하면 GitHub Actions(`.github/workflows/pages.yml`)가 `site/`를 Pages에 배포합니다.
