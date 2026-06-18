const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(command) {
  console.log(`\n▶ ${command}`);
  execSync(command, { stdio: "inherit" });
}

function checkBlogIndex() {
  const indexPath = path.join(process.cwd(), "content", "blog", "index.js");

  if (!fs.existsSync(indexPath)) {
    throw new Error("Не найден файл content/blog/index.js");
  }

  const indexContent = fs.readFileSync(indexPath, "utf8");

  if (!indexContent.includes("export const articles")) {
    throw new Error("В content/blog/index.js не найден export const articles");
  }

  console.log("✅ content/blog/index.js найден и выглядит нормально.");
}

try {
  console.log("Проверяем проект перед публикацией статьи...");

  checkBlogIndex();

  run("npm run build");
  run("git status");

  console.log("\n✅ Всё хорошо. Можно делать git add, commit и push.");
} catch (error) {
  console.error("\n❌ Ошибка. Публикацию делать нельзя.");
  console.error(error.message);
  process.exit(1);
}