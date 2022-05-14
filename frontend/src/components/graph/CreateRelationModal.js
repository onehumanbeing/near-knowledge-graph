/* 
Modal for create relation between two nodes
*/
import React, { useState } from "react";
import {
    createRelation
} from "../../utils/api";
import { Button, Modal, Form, Container, Row, Col } from "react-bootstrap";

export const CreateRelationModal = ({nodes, nodeId, setNodeId, relatedNodeId, setRelatedNodeId, show, setShow}) => {
    const handleClose = () => {
        setNodeId("");
        setRelatedNodeId("");
        setShow(false);
    };
    const [relation, setRelation] = useState("");

    const updateInputValue = (evt) => {
        setRelation(evt.target.value);
    }

    const sumbitMint = () => {
        setShow(false);
        createRelation(nodeId, relatedNodeId, relation);
    }

    return (
        <Modal size="lg" show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{nodeId !== "" && relatedNodeId !== "" ? (<>Create Relation: {nodes[nodeId].name} #{nodeId} to {nodes[relatedNodeId].name} #{relatedNodeId}</>):(<></>)}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {nodeId !== "" && relatedNodeId !== "" ? ( <Container>
                <Row>
                    <Col xs={12} md={4}>
                    <img src={nodes[nodeId].media} alt="Media" style={{ maxHeight: "250px", maxWidth: "440px" }}></img>
                    <p>Name: {nodes[nodeId].name}</p>
                    <p>ID: #{nodes[nodeId].index}</p>
                    <p>Data: <a href={nodes[nodeId].data} target="_blank" rel="noreferrer" >view</a> </p>
                    <p>Current owner: {nodes[nodeId].account_id}</p>
                    <p>Deposit: {nodes[nodeId].storage} yoctoⓃ</p>
                    </Col>
                    <Col xs={12} md={4}>
                    <img src={nodes[relatedNodeId].media} alt="Media" style={{ maxHeight: "250px", maxWidth: "440px" }}></img>
                    <p>Name: {nodes[relatedNodeId].name}</p>
                    <p>ID: #{nodes[relatedNodeId].index}</p>
                    <p>Data: <a href={nodes[relatedNodeId].data} target="_blank" rel="noreferrer" >view</a> </p>
                    <p>Current owner: {nodes[relatedNodeId].account_id}</p>
                    <p>Deposit: {nodes[relatedNodeId].storage} yoctoⓃ</p>
                    </Col>
                </Row>
            </Container>
            ):(<></>)}
            <Form>
                <Form.Group
                  className="mb-3"
                  controlId="relation"
                >
                  <Form.Label>Relation</Form.Label>
                  <Form.Control placeholder="Relation with related node, such as 'friends'" onChange={updateInputValue}/>
                </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
              <p>* You need to paid for the storage, the contract will refund the extra cost after minting.</p>
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
  
export default CreateRelationModal;
