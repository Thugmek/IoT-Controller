import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Home from "./routes/home";
import Left from "./left";
import About from "./routes/about";
import MessagePlayer from "./routes/audio-player";

function App() {
  return (
    <div className="App">
      <Router>
        <Row>
          <Col
            className="border border-primary align-self-stretch vh-100"
            xs={3}
            lg={2}
          >
            <Left />
          </Col>
          <Col xs={9} lg={10}>
            <Switch>
              <Route exact path="/">
                <Redirect to="/home" />
              </Route>
              <Route path="/home" component={Home} />
              <Route path="/about" component={About} />
              <Route path="/messagePlayer" component={MessagePlayer} />
            </Switch>
          </Col>
        </Row>
      </Router>
    </div>
  );
}

export default App;
