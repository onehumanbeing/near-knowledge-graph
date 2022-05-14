/* 
Modal for create a new node related with one current node
*/
import React, { useState } from "react";
import {
    createRoot
} from "../../utils/api";
import { Button, Modal, Form } from "react-bootstrap";

export const CreateRootModal = ({rootId, setRootId, show, setShow}) => {
    const handleClose = () => setShow(false);
    const defaultMedia = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pomegranate_Juice_%282019%29.jpg/440px-Pomegranate_Juice_%282019%29.jpg";
    const defaultDataUrl = "https://en.wikipedia.org/wiki/Pomegranate";
    const [data, setData] = useState({"title": "",
    "data": {
        "name": "",
        "media": defaultMedia,
        "data": defaultDataUrl
    }});

    const updateInputValue = (evt) => {
        // console.log(evt.target.id, evt.target.value);
        var changeData = {...data}
        if(evt.target.id === "title") {
            changeData[evt.target.id] = evt.target.value;
        } else {
            changeData["data"][evt.target.id] = evt.target.value;
        }
        setData(changeData);
    }

    const sumbitMint = () => {
        setShow(false);
        createRoot(data["title"], data["data"]);
    }

    return (
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create a new graph on Near now!</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="title">
                <Form.Label>Title (Unique)</Form.Label>
                <Form.Control
                  placeholder="Title of your graph"
                  onChange={updateInputValue}
                  autoFocus
                />
              </Form.Group>
              <h3>Root Node infomation</h3>
              <Form.Group
                className="mb-3"
                controlId="name"
              >
                <Form.Label>Name</Form.Label>
                <Form.Control placeholder="Name of the root node" onChange={updateInputValue}/>
              </Form.Group>
              
              <Form.Group
              className="mb-3"
              controlId="media"
            >
              <Form.Label>Media Url (Optional, support ipfs upload later)</Form.Label>
              <Form.Control as="textarea" rows={3} defaultValue={defaultMedia}  onChange={updateInputValue} />
              <img src={data["data"]["media"]} alt="Media" style={{ maxHeight: "250px", maxWidth: "440px" }}></img>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="data"
            >
            <Form.Label>Data Url (Optional)</Form.Label>
              <Form.Control as="textarea" rows={3} defaultValue={defaultDataUrl}  onChange={updateInputValue} />
            </Form.Group>

            </Form>
          </Modal.Body>
          <Modal.Footer>
              <p>* You need to paid for the storage, the contract will refund the extra cost after minting. Storage usage will record and will refund when burn in future. </p>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={sumbitMint}>
              I get it, mint now!
            </Button>
          </Modal.Footer>
        </Modal>
    );
  }
  
export default CreateRootModal;
