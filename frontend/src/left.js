import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Home, Info, Notifications } from "@material-ui/icons";

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
      <Link to="/about" className="nav-link">
        <Button className="btn-block" disabled>
          <Info />O aplikaci
        </Button>
      </Link>
    </>
  );
}

export default Left;
