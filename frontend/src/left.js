import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Home, Info, Notifications, Whatshot } from "@material-ui/icons";

function Left() {
  return (
    <>
      <Link to="/home" className="nav-link">
        <Button className="btn-block">
          <Home />
          Domů
        </Button>
      </Link>
      <Link to="/messagePlayer" className="nav-link">
        <Button className="btn-block">
          <Notifications />
          Rozhlas
        </Button>
      </Link>
      <Link to="/fireplace" className="nav-link">
        <Button className="btn-block" disabled>
          <Whatshot />
          Kotel
        </Button>
      </Link>
      <Link to="/about" className="nav-link">
        <Button className="btn-block btn-secondary">
          <Info />O aplikaci
        </Button>
      </Link>
    </>
  );
}

export default Left;
