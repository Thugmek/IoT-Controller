import { Jumbotron } from "react-bootstrap";

function About() {
  return (
    <Jumbotron>
      <h1 className="display-3">O aplikaci</h1>
      <p class="lead">
        Autorem aplikace je Michal Tomek. Aplikace byla vytvořena v roce 2021 a
        využívá technologie Node.js, React a MongoDB.
      </p>
    </Jumbotron>
  );
}

export default About;
