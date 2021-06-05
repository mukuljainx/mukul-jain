import React from "react";
import { graphql } from "gatsby";
import Header from "../component/Header";
import Glitter from "../component/Glitter";
import Seo from "../component/SEO";

export default function Template({ data }) {
  const { markdownRemark } = data; // data.markdownRemark holds your post data
  const { frontmatter, html } = markdownRemark;
  return (
    <>
      <Seo
        title={frontmatter.title}
        description={frontmatter.preview}
        article
      />
      <main className="with-padding">
        <Header nav={["blog"]} />
        <div className="blog-post">
          <div className="blog-post-header">
            <h1 className="no-margin">{frontmatter.title}</h1>
            <p className="no-margin" style={{ fontSize: 16 }}>
              {frontmatter.date} • {frontmatter.readingTime} mins read
            </p>
          </div>
          <div className="blog-post-content">
            <div dangerouslySetInnerHTML={{ __html: html }} />
            {frontmatter.url && (
              <p>
                Sourced from{" "}
                <a rel="noreferrer" target="_blank" href={frontmatter.url}>
                  dev.to
                </a>{" "}
                🧑‍💻 👩‍💻
              </p>
            )}
          </div>
        </div>
      </main>
      <Glitter noCloud />
    </>
  );
}

export const pageQuery = graphql`
  query ($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        commentsCount
        reactionsCount
        readingTime
        url
      }
    }
  }
`;
