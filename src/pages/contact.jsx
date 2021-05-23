import * as React from "react";
import { graphql } from "gatsby";
import Header from "../component/Header";
import Glitter from "../component/Glitter";

const Projects = ({ data }) => {
  const { twitter, email, github } = data.site.siteMetadata;
  return (
    <>
      <main className="with-padding">
        <div className="flex column">
          <Header title="Get in touch" />
          <div style={{ marginTop: 80 }}>
            <p>
              Mail me at <span className="underline">{email}</span>
            </p>
            <div>
              <a
                className="underline"
                style={{ marginRight: 8 }}
                href={github}
                target="_blank"
                rel="noreferrer"
              >
                Github
              </a>
              <a
                rel="noreferrer"
                className="underline"
                href={twitter}
                target="_blank"
              >
                Twitter
              </a>
            </div>
          </div>
        </div>
      </main>
      <Glitter fixed />
    </>
  );
};

export default Projects;

export const query = graphql`
  {
    site {
      siteMetadata {
        title
        twitter
        email
        github
      }
    }
  }
`;
