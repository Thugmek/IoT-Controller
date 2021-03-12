import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { DeleteForever, Block } from "@material-ui/icons";

function DeleteDialog(props, ref) {
  const [show, setShow] = useState(false);
  const [data, setData] = useState({});

  useImperativeHandle(ref, () => ({
    show: (data) => {
      setData(data);
      setShow(true);
    },
  }));

  const handleClose = () => setShow(false);
  const handleDelete = () => {
    props.onDelete(data);
    setShow(false);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Smazat položku</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Opravdu chcete smazat položku <b>{data.name}</b>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleClose}>
          <Block />
          Zrušit
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          <DeleteForever />
          Smazat
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

DeleteDialog = forwardRef(DeleteDialog);

export default DeleteDialog;
