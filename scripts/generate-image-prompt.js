const title = process.argv.slice(2).join(" ");

if (!title) {
  console.error("Укажи тему статьи");
  process.exit(1);
}

const prompt = `
Create a realistic professional commercial image for a blog article.

Topic: ${title}

Image requirements:
- photorealistic construction or warehouse machinery scene
- modern Zoomlion-style green industrial equipment
- clean background, professional advertising look
- no text on image
- no watermark
- no people close-up
- 16:9 aspect ratio
- high detail
- suitable for a business blog hero image
- natural daylight
- realistic proportions
`;

console.log(prompt.trim());