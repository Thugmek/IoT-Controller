import { Row, Col, Button, ButtonGroup } from "react-bootstrap";
import { DeleteForever, Edit } from "@material-ui/icons";

function Message(props) {
  return (
    <Row className="border rounded mt-3 p-1">
      <Col
        xs={7}
        lg={9}
        className="align-middle"
        onClick={() => props.onPlay()}
      >
        <h3 className="align-middle">{props.data.name}</h3>
        {props.data.text}
      </Col>
      <Col xs={5} lg={3}>
        <ButtonGroup>
          <Button className="btn-secondary" onClick={() => props.onUpdate()}>
            <Edit />
            Upravit
          </Button>
          <Button className="btn-danger" onClick={() => props.onDelete()}>
            <DeleteForever />
            Smazat
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
}

export default Message;
