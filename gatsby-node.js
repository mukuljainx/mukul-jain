const axios = require("axios");
const fs = require("fs");
const path = require("path");

const getAllArticles = async (listing) => {
  return new Promise(async (resolve) => {
    const articles = await Promise.allSettled(
      listing.map((list) => {
        console.log(`FETCHING ${list.title}`);
        return axios.get(`https://dev.to/api/articles/mukuljainx/${list.slug}`);
      })
    );

    resolve(
      articles.map((x, i) => {
        if (!x.value) {
          console.log(`FETCHING FAILED: ${listing[i].title}`);
        }
        return x.value ? x.value.data : undefined;
      })
    );
  });
};

// Creates files from dev.to blogs
exports.onPreInit = async () => {
  try {
    return new Promise(async (resolve, reject) => {
      console.log("FETCHING THE LIST");
      const listingJSON = await axios.get(
        "https://dev.to/api/articles/latest?username=mukuljainx"
      );
      const listing = listingJSON.data;

      const articles = await getAllArticles(listing);

      articles.forEach((article) => {
        if (!article) {
          return;
        }
        const meta = {
          slug: `/blog/${article.slug}`,
          date: article.created_at,
          readableDate: article.readable_publish_date,
          title: article.title,
          preview: article.description,
          readingTime: article.reading_time_minutes,
          reactionsCount: article.public_reactions_count,
          commentsCount: article.comments_count,
          url: article.url,
        };
        fs.writeFileSync(
          path.resolve(
            `${__dirname}/src/pages/posts/dev-to-${article.slug}.md`
          ),

          "---\n" +
            Object.keys(meta)
              .map((k) => `${k}: "${meta[k]}"`)
              .join("\n") +
            "\n" +
            "---\n" +
            article.body_markdown,
          "utf8"
        );
      });
      resolve();
    });
  } catch (e) {
    console(`\n\n\n${e}\n\n\n`);
  }
};
