import { useRef, useState } from "react";
import { Container } from "react-bootstrap";
import DeleteDialog from "./delete-dialog";
import Message from "./mesage";
import PlayDialog from "./play-dialog";
import UpdateDialog from "./update-dialog";

const lst = [
  {
    id: 1,
    name: "Oběd",
    text: "Podává se oběd",
  },
  {
    id: 2,
    name: "Oběd",
    text: "Podává se oběd",
  },
  {
    id: 3,
    name: "Oběd",
    text: "Podává se oběd",
  },
  {
    id: 4,
    name: "Oběd",
    text: "Podává se oběd",
  },
];

function MessageList(props) {
  const deleteDialog = useRef();
  const updateDialog = useRef();
  const playDialog = useRef();

  return (
    <>
      <DeleteDialog ref={deleteDialog} onDelete={props.onDelete} />
      <UpdateDialog ref={updateDialog} onUpdate={props.onUpdate} />
      <PlayDialog ref={playDialog} onPlay={props.onPlay} />
      {props.list.map((a) => (
        <Message
          key={a._id}
          data={a}
          onDelete={() => deleteDialog.current.show(a)}
          onUpdate={() => updateDialog.current.show(a)}
          onPlay={() => playDialog.current.show(a)}
        />
      ))}
    </>
  );
}

export default MessageList;
