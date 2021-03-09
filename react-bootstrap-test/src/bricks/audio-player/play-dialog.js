import { useState, useImperativeHandle, forwardRef } from "react";
import { Button, Modal } from "react-bootstrap";
import { Block, PlayArrow, TapAndPlay, Stop } from "@material-ui/icons";
var Sound = require("react-sound").default;

function PlayDialog(props, ref) {
  const [show, setShow] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [data, setData] = useState({});

  useImperativeHandle(ref, () => ({
    show: (data) => {
      setData(data);
      setShow(true);
    },
  }));

  function handlePlay() {
    props.onPlay(data);
    setShow(false);
  }

  const handleClose = () => setShow(false);
  const soundUrl = `http://localhost:2000/notifier/sound?file=${data.file}`;
  return (
    <Modal show={show} onHide={handleClose}>
      <Sound
        url={soundUrl}
        playStatus={playing ? Sound.status.PLAYING : Sound.status.STOPPED}
        onFinishedPlaying={() => setPlaying(false)}
      />
      <Modal.Header closeButton>
        <Modal.Title>Přehrát položku</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Opravdu chcete přehrát položku <b>{data.name}</b>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleClose}>
          <Block />
          Zrušit
        </Button>
        <Button variant="secondary" onClick={() => setPlaying(!playing)}>
          {playing ? (
            <>
              <Stop />
              Zastavit přehrávání
            </>
          ) : (
            <>
              <PlayArrow />
              Přehrát lokálně
            </>
          )}
        </Button>
        <Button variant="success" onClick={handlePlay}>
          <TapAndPlay />
          Přehrát
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

PlayDialog = forwardRef(PlayDialog);

export default PlayDialog;
