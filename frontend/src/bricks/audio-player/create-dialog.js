import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import { Add, Block, Error } from "@material-ui/icons";

function CreateDialog(props, ref) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [textError, setTextError] = useState("");
  const [nameError, setNameError] = useState("");

  useImperativeHandle(ref, () => ({
    show: (data) => {
      setText("");
      setName("");
      setShow(true);
    },
  }));

  const handleClose = () => setShow(false);
  const handleCreate = () => {
    let valid = true;
    if (name.length > 0) setNameError("");
    else {
      valid = false;
      setNameError("Toto pole je poviné.");
    }
    if (text.length > 0) {
      if (text.length <= 200) setTextError("");
      else {
        valid = false;
        setTextError(
          "Text je příliš dlouhý. Zadejte text kratší než 200 znaků"
        );
      }
    } else {
      valid = false;
      setTextError("Toto pole je poviné.");
    }
    if (valid) {
      props.onCreate({
        name: name,
        text: text,
      });
      setShow(false);
    }
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
          <Alert variant="danger" hidden={nameError === ""}>
            <Error />
            {nameError}
          </Alert>
          <Form.Label>Zpráva</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Alert variant="danger" hidden={textError === ""}>
            <Error />
            {textError}
          </Alert>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          <Block />
          Zrušit
        </Button>
        <Button variant="success" onClick={handleCreate}>
          <Add />
          Vytvořit
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

CreateDialog = forwardRef(CreateDialog);

export default CreateDialog;
