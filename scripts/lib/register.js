const fs = require("fs");
const path = require("path");

function toVariableName(slug) {
  return (
    slug
      .split("-")
      .map((part, index) => {
        if (index === 0) return part;
        return part.charAt(0).toUpperCase() + part.slice(1);
      })
      .join("") + "Article"
  );
}

function registerArticle(article) {
  const indexPath = path.join(process.cwd(), "content", "blog", "index.js");
  const files = fs
    .readdirSync(path.join(process.cwd(), "content", "blog"))
    .filter((file) => file.endsWith(".js"))
    .filter((file) => file !== "index.js")
    .filter((file) => file !== "articles.js");

  const imports = files
    .map((file) => {
      const slug = file.replace(".js", "");
      const variableName = toVariableName(slug);
      return `import { article as ${variableName} } from "./${slug}";`;
    })
    .join("\n");

  const entries = files
    .map((file) => {
      const slug = file.replace(".js", "");
      const variableName = toVariableName(slug);
      return `  [${variableName}.slug]: ${variableName},`;
    })
    .join("\n");

  const content = `${imports}

export const articles = {
${entries}
};
`;

  fs.writeFileSync(indexPath, content, "utf8");

  return indexPath;
}

module.exports = { registerArticle };