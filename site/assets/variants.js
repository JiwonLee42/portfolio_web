// Versions of the site for different readers.
//
// Open the site with ?c=<key> and that entry changes what the home page leads with:
//   index.html?c=infra
// Everything else stays the same, and the ?c= part follows the reader to the other pages.
//
// What one entry can change (every field is optional):
//   hero      the headline lines, per language. The first two are the headline; any more are smaller
//             lines under it. [[double brackets]] mark the blue words.
//   projects  order of the project cards. Keys: meogeodoe, nook, linku, jeonhwawasseo
//   skills    order of the skill groups. Keys: backend, devops, data, frontend
//   footer    the sentence above the copyright line, per language
//   title     the browser tab title, per language
//
// This file is public, and so is every key in it. Do not use a company name as a key.
// Use a short code that means nothing (for example "k7f3") and keep the code-to-company
// list somewhere private. Only write things here that are true.

window.VARIANTS = {

  // For product engineer roles: software developer first, with the backend as the main strength.
  // Projects that users meet directly come first, and the frontend skills move up.
  k7f3: {
    title: { ko: "이지원 | 백엔드 개발자", en: "Jiwon Lee | Backend Engineer" },
    hero: {
      ko: [
        "언제나 안정적인 서비스를 제공하는 것을 목표로 하는 [[풀스택 개발자]] 이지원입니다.",
        "[[빠르고 안정적으로 동작하면서]] 계획한 기능을 정확하게 수행하는 서비스를 만들고자 합니다.",
        "먹어도돼?를 Spring Boot 기반으로 만들어 App Store와 Google Play에서 운영 중입니다.",
      ],
      en: [
        "I'm Jiwon Lee, a [[full-stack developer]] who always aims to provide stable services.",
        "I want to build services that [[run fast and reliably]] and do exactly what was planned.",
        "I built Can I eat this? on Spring Boot, and it is live and running on the App Store and Google Play.",
      ],
    },
    projects: ["meogeodoe", "jeonhwawasseo", "nook", "linku"],
    skills: ["backend", "frontend", "devops", "data"],
    footer: {
      ko: "Product Engineer로 함께할 곳을 찾고 있습니다.",
      en: "Open to product engineering roles.",
    },
  },
  // Leads with deployment and operations work. The project order stays as it is: Can I eat this? first.
  infra: {
    hero: {
      ko: [
        "지속적으로 성장하고 개선하고자 하는 [[백엔드 개발자]] 이지원입니다.",
        "인프라를 코드로 관리하고, [[배포부터 모니터링까지]] 직접 구축하는 걸 좋아합니다.",
      ],
      en: [
        "I'm Jiwon Lee, a [[backend developer]] who keeps growing and improving.",
        "I like managing infrastructure as code and building [[everything from deployment to monitoring]] myself.",
      ],
    },
    skills: ["devops", "backend", "data", "frontend"],
  },

  // Leads with how the services behave when something goes wrong.
  backend: {
    hero: {
      ko: [
        "지속적으로 성장하고 개선하고자 하는 [[백엔드 개발자]] 이지원입니다.",
        "실패해도 [[유실되지 않는 구조]]를 설계하고, 운영하며 개선하는 걸 좋아합니다.",
      ],
      en: [
        "I'm Jiwon Lee, a [[backend developer]] who keeps growing and improving.",
        "I like designing services that [[do not lose work when something fails]], then improving them as I run them.",
      ],
    },
    projects: ["meogeodoe", "linku", "nook", "jeonhwawasseo"],
    skills: ["backend", "data", "devops", "frontend"],
  },
};
