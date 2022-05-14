/* 
Modal for create a new root with a new node
*/
import { toast } from "react-toastify";
import React, { useState } from "react";
import {
    createNode
} from "../../utils/api";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";
import { IoChevronForwardSharp } from 'react-icons/io5';

export const ViewNodeModal = ({node, setNode, nodes, show, setShow, address}) => {
    const handleClose = () => setShow(false);
    const defaultMedia = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Pomegranate_Juice_%282019%29.jpg/440px-Pomegranate_Juice_%282019%29.jpg";
    const defaultDataUrl = "https://en.wikipedia.org/wiki/Pomegranate";
    const [data, setData] = useState({
        "data": {
            "name": "",
            "media": defaultMedia,
            "data": defaultDataUrl
        },
        "relation": ""
    });
    const [isCreate, setIsCreate] = useState(false);

    const onClickCreateView = () => {
      if(!address) {
        toast(`Please connect your wallet first`);
        return
      }
      setIsCreate(true);
    }

    const updateInputValue = (evt) => {
        // console.log(evt.target.id, evt.target.value);
        var changeData = {...data}
        if(evt.target.id === "relation") {
            changeData[evt.target.id] = evt.target.value;
        } else {
            changeData["data"][evt.target.id] = evt.target.value;
        }
        setData(changeData);
    }

    const sumbitMint = () => {
        setShow(false);
        createNode(node.index, data["data"], data["relation"]);
    }

    return (
        <>
        { isCreate ? (
            <Modal size="lg" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Create a new Node related on {node.name} [#{node.index}] </Modal.Title> 
              <div style={{ marginLeft: "25px" }} onClick={() => { setIsCreate(false) }} >
               <span className="black_border_bottom">Back to view</span> <IoChevronForwardSharp/>
              </div>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group
                  className="mb-3"
                  controlId="relation"
                >
                  <Form.Label>Relation</Form.Label>
                  <Form.Control placeholder="Relation with related node, such as 'friends'" onChange={updateInputValue}/>
                </Form.Group>
                <h3>Node infomation</h3>
                <Form.Group
                  className="mb-3"
                  controlId="name"
                >
                  <Form.Label>Name</Form.Label>
                  <Form.Control placeholder="Name of the node" onChange={updateInputValue}/>
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
        ) : (
            <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Node {node.name} [#{node.index}]</Modal.Title>
            <Button variant="primary" onClick={() => { onClickCreateView() }} style={{ marginLeft: "25px" }}>
              Create Node
            </Button>
          </Modal.Header>
          <Modal.Body>
          <img src={node.media} alt="Media" style={{ maxHeight: "250px", maxWidth: "440px" }}></img>
          <p>Name: {node.name}</p>
          <p>ID: #{node.index}</p>
          <p>Data: <a href={node.data} target="_blank" rel="noreferrer">view</a> </p>
          <p>Current owner: <a href={"https://explorer.testnet.near.org/accounts/" + node.account_id} target="_blank" rel="noreferrer">{node.account_id}</a></p>
          <p>Deposit: {node.storage} yoctoⓃ</p>
          <h3>Relations</h3>
          <p>click ID to view node</p>
          <Container>
                <Row>
                    <Col xs={4} md={2}>ID</Col>
                    <Col xs={4} md={2}>relation</Col>
                    <Col xs={4} md={2}>name</Col>
                    <Col xs={4} md={2}>Media</Col>
                    <Col xs={4} md={2}>Data</Col>
                </Row>
          {node.relations.map(item => (
              <>
              { item[1] in nodes ? (
                <Row key={item[1]}>
                    <Col xs={4} md={2} onClick={() => { setNode(nodes[item[1]]) }} style={{color: "blue"}}>
                        <b>#{nodes[item[1]].index}</b>
                    </Col>
                    <Col xs={4} md={2}>
                        {item[0].split("@")[0]}
                    </Col>
                    <Col xs={4} md={2}>
                        {nodes[item[1]].name}
                    </Col>
                    <Col xs={4} md={2}>
                        <img src={nodes[item[1]].media} alt="Media" style={{ maxHeight: "75px", maxWidth: "75px" }}></img>
                    </Col>
                    <Col xs={4} md={2}>
                        <a href={nodes[item[1]].data} target="_blank" rel="noreferrer">view</a>
                    </Col>
                </Row>
              ) : (
                <></>
              ) }
              </>
           ))}
            </Container>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        ) }
        </>
    );
  }
  
export default ViewNodeModal;
