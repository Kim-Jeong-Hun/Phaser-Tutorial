# Phaser 3 Platformer Tutorial

이 프로젝트는 Phaser 3를 사용한 플랫폼 게임 튜토리얼 예제입니다. 
각 단계별로 HTML 파일(`part1.html` ~ `part10.html`)이 제공되어 있으며, 
최종 코드는 `index.html`, `index.js`, `index.css`에 분리되어 있습니다.

## 폴더 구조

```
index.html       # 메인 게임 페이지
index.js         # 게임 로직 (Phaser 코드)
index.css        # 스타일
package.json     # 의존성 관리
assets/          # 게임에 사용되는 이미지 리소스
    bomb.png
    dude.png
    platform.png
    sky.png
    star.png
part1~10/         # 단계별 튜토리얼 예제 폴더
    part1.html
    part2.html
    part3.html
    part4.html
    part5.html
    part6.html
    part7.html
    part8.html
    part9.html
    part10.html
```

## 실행 방법

1. `npm install`로 Phaser 라이브러리를 설치합니다.
2. `index.html`을 브라우저에서 열면 게임이 실행됩니다.

## 주요 파일 설명

- **index.html** : Phaser와 CSS, JS를 불러오는 메인 HTML 파일입니다.
- **index.js** : 게임의 중심 로직이 작성되는 파일입니다.
- **assets/** : 게임에 사용되는 이미지 리소스가 들어 있습니다.
- **part1~10/** : 튜토리얼 각 단계별 예제 코드입니다.

## 참고

- Phaser 공식 문서: [https://phaser.io/](https://phaser.io/)
- 각 단계별 HTML 파일을 참고하면 Phaser 3의 기본적인 사용법과 게임 개발 과정을 익힐 수 있습니다.
