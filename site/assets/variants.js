// Versions of the site for different readers.
//
// Open the site with ?c=<key> and that entry changes what the home page leads with:
//   index.html?c=infra
// Everything else stays the same, and the ?c= part follows the reader to the other pages.
//
// What one entry can change (every field is optional):
//   hero      two lines of the headline, per language. [[double brackets]] mark the blue words.
//   projects  order of the project cards. Keys: meogeodoe, nook, linku
//   skills    order of the skill groups. Keys: backend, devops, data, frontend
//   footer    the sentence above the copyright line, per language
//   title     the browser tab title, per language
//
// This file is public, and so is every key in it. Do not use a company name as a key.
// Use a short code that means nothing (for example "k7f3") and keep the code-to-company
// list somewhere private. Only write things here that are true.

window.VARIANTS = {
  // Leads with deployment and operations work. The project order stays as it is: Meogeodoe first.
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
    projects: ["meogeodoe", "linku", "nook"],
    skills: ["backend", "data", "devops", "frontend"],
  },
};
