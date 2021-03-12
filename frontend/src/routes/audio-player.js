import { Col, Container, Row, Button } from "react-bootstrap";
import MessageList from "../bricks/audio-player/mesage-list";
import { Add } from "@material-ui/icons";
import { useRef, useState, useEffect } from "react";
import CreateDialog from "../bricks/audio-player/create-dialog";
import Calls from "../calls";

const lst = [];

function MessagePlayer() {
  const createDialog = useRef();

  const [list, setList] = useState(lst);

  useEffect(() => {
    Calls.loadMessages.call().then((e) => setList(e));
  }, []);

  function handleCreate(data) {
    Calls.createMessages(data).then((e) => setList([...list, e]));
  }

  function handleUpdate(data) {
    console.log("Update", data);
    Calls.updateMessages(data).then((e) => {
      console.log("Update response", e);
      setList(
        list.map((a) => {
          if (a._id === e._id) return e;
          else return a;
        })
      );
    });
  }

  function handleDelete(data) {
    console.log("Delete", data);
    Calls.deleteMessages(data).then((e) =>
      setList(
        list.filter((a) => {
          if (a._id === data._id) return false;
          else return true;
        })
      )
    );
  }

  function handlePlay(data) {
    Calls.playMessages(data).then((e) => console.log(e));
  }

  return (
    <Container>
      <CreateDialog
        onCreate={handleCreate}
        ref={createDialog}
        onCreate={handleCreate}
      />
      <h1>Domovní rozhlas</h1>
      <Button onClick={() => createDialog.current.show()}>
        <Add />
        Nová zpráva
      </Button>
      <MessageList
        list={list}
        onUpdate={handleUpdate}
        onPlay={handlePlay}
        onDelete={handleDelete}
      />
    </Container>
  );
}

export default MessagePlayer;
