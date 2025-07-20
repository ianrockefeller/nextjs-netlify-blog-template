import authors from "../meta/authors.json";


const authorMap = generateAuthorMap();

function generateAuthorMap() {
  let result= {};
  for (const author of authors.authors) {
    result[author.slug] = author;
  }
  return result;
}

export function getAuthor(slug) {
  return authorMap[slug];
}
