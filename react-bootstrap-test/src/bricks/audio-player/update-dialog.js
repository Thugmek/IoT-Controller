import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { Edit, Block } from "@material-ui/icons";

function UpdateDialog(props, ref) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  useImperativeHandle(ref, () => ({
    show: (data) => {
      setData(data);
      setName(data.name);
      setText(data.text);
      setShow(true);
    },
  }));

  const handleClose = () => setShow(false);
  const handleUpdate = () => {
    props.onUpdate({
      ...data,
      name: name,
      text: text,
    });
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Updavit položku</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label>Název</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Label>Zpráva</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          <Block />
          Zrušit
        </Button>
        <Button variant="success" onClick={handleUpdate}>
          <Edit />
          Upravit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

UpdateDialog = forwardRef(UpdateDialog);

export default UpdateDialog;
