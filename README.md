# Kobe Han Portfolio

반응형 사진 포트폴리오 프로토타입입니다. 사이트 콘텐츠는 Pages CMS에서 편집할 수 있도록
GitHub 저장소의 JSON 파일과 이미지로 분리되어 있습니다.

## 로컬 실행

Node.js `22.13.0` 이상이 필요합니다.

```bash
npm install
npm run dev
```

검증 명령:

```bash
npm run build
npm test
npm run lint
```

## 콘텐츠 구조

- `content/site.json`: 프로필, 소개, 연락처와 메타 정보
- `content/works.json`: 작품 목록, 표시 순서와 이미지 정보
- `public/images`: 웹용 작품 이미지
- `.pages.yml`: Pages CMS 관리자 화면 정의
- `index.html`, `site.js`: GitHub Pages용 정적 진입점
- `app`: Sites/Next 호환 앱 소스

Pages CMS 최초 연결과 사진가 초대 방법은 [PAGES_CMS.md](PAGES_CMS.md)를 참고하세요.
