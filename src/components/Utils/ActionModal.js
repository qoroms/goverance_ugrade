import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import "../../styles/actionModal.css";
import actionAddress from "../../utils/actionAddress";

export default function ActionModal({ open, toggle, handleSetAction }) {
  const [target, setTarget] = useState("");
  const [selected, setSelected] = useState(false);
  const [targetAddress, setTargetAddress] = useState("");
  const [functions, setFunctions] = useState([]);
  const [selectedFunction, setSelectedfunction] = useState("");
  useEffect(() => {
      setSelected(false);
      setFunctions([]);
      setSelectedfunction("");
      setTarget("");
      setTargetAddress("");
  }, [open])
  const handelChangeTarget = (e) => {
      setTarget(e.target.value);
      actionAddress.map((item) => {
          if(item.name === e.target.value) {
              setTargetAddress(item.address);
              setFunctions(item.functions);
          }
      })
      setSelected(true);
  }
  const handleChangeFunction = (e) => {
      setSelectedfunction(e.target.value);
  };
  const handleAction = () => {
      toggle();
      handleSetAction(target, targetAddress, selectedFunction);
  }
  return (
    <Modal
      show={open}
      onHide={toggle}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add action</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formBasicSelect">
          <Form.Label>Select Target</Form.Label>
          <Form.Control
            as="select"
            value={target}
            disabled = {selected}
            onChange={handelChangeTarget}
          >
              <option key={0} value={0}>{""}</option>
              {actionAddress?actionAddress.map((item, index) =>
                  <option style={{fontSize:16}} key={item.address} value={item.name}>{item.name}</option>
              ):<option></option>}
          </Form.Control>
          <p>{targetAddress.length > 0 ? "Target Address : " + targetAddress: "" }</p>
        </Form.Group>
        <Form.Group controlId="formBasicSelect">
          <Form.Label>Select Function</Form.Label>
          <Form.Control
            as="select"
            value={selectedFunction}
            onChange={handleChangeFunction}
          >
              <option key={0}>{""}</option>
              {functions?functions.map((item) =>
                  <option style={{fontSize:16}} key={item} value={item}>{item}</option>
              ):<option></option>}
          </Form.Control>
          <p>{selectedFunction.length > 0 ? "Signature : " + selectedFunction: "" }</p>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={toggle}>
          Cancel
        </Button>
        <Button variant="success" style={{background:"rgb(0, 200, 150)"}} onClick={handleAction}>
          Add Action
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
