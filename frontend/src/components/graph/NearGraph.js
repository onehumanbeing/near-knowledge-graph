import React, { useEffect, useState, useCallback } from "react";
import { Graph } from "react-d3-graph";
import { toast } from "react-toastify";
import { InputGroup, Button, FormControl } from "react-bootstrap";
import { IoSearchOutline } from 'react-icons/io5';
import {
  searchName
} from "../../utils/api";
import ViewNodeModal from "./ViewNodeModal.js"
import CreateRelationModal from "./CreateRelationModal.js"

export const NearGraph = ({
  graphData, setRootId, nodes, address
}) => {
    const [nodeId, setNodeId] = useState("");
    const [relatedNodeId, setRelatedNodeId] = useState("");

    const [loading, setLoading] = useState(false);
    const [names, setNames] = useState([]);
    const [node, setNode] = useState({
      index: '',
      name: '',
      media: '',
      account_id: '',
      data: '',
      relations: [],
      storage: '0'
    });
    const [showViewModel, setShowViewModel] = useState(false);
    const [showCreateModel, setShowCreateModel] = useState(false);

    const graphConfig = {
      height: 700,
      width: 1500,
      nodeHighlightBehavior: true,
      linkHighlightBehavior: true,
      staticGraphWithDragAndDrop: true,
      maxZoom: 4,
      minZoom: 1.6,
      zoom: 1.8,
      focusZoom: 2,
      node: {
          fontSize: 8,
          highlightFontSize: 12,
          highlightFontWeight: "bold",
          highlightStrokeColor: "blue",
          labelProperty: "name",
          size: 400,
          strokeWidth: 2,
          labelPosition: "bottom"
      },
      link: {
          highlightColor: "blue",
          renderLabel: true,
          highlightFontWeight: "bold",
          semanticStrokeWidth: true,
          fontSize: 8,
          labelPosition: "center"
      },
      d3: {
          gravity: -400,
          linkLength: 180,
          disableLinkForce: true,
      },
  };

    const onClickNode = function(nodeId) {
      console.log(`Clicked node ${nodeId}`);
      if(nodeId in nodes) {
        setNode(nodes[nodeId]);
        setShowViewModel(true);
      }
    };

    const onClickLink = function(source, target) {
      console.log(`Clicked link between ${source} and ${target}`);
    };

    const onRightClickNode = (event, id, node) => {
      event.preventDefault();
      // toast(`Right clicked node ${id} in position (${node.x}, ${node.y})`);
      if(!address) {
        toast(`Please connect your wallet first`);
        return
      }
      if(id in nodes) {
        if(nodeId === id) {
          toast(`cancel relate node ${nodes[id].name} #${id}`);
          setNodeId("");
          setRelatedNodeId("");
          return;
        }
        if(nodeId === "") {
          toast(`Selected relate node ${nodes[id].name} #${id}`);
          setNodeId(id);
          setRelatedNodeId("");
          return;
        }
        toast(`Selected relate node ${nodes[id].name} #${id}`);
        setRelatedNodeId(id);
        setShowCreateModel(true);
      }
    };

    const onZoomChange = (prevZoom, newZoom) => {
      console.log(prevZoom, newZoom);
    };

    const search = useCallback(async (name) => {
      try {
        setNames(await searchName(name));
      } catch (error) {
        console.log({ error });
      }
    });
  
    const searchWordChange = (event) => {
      if(event.target.value === '')
      {
        setNames([]);
      } else {
        search(event.target.value);
      }
    }

    const onClickSearchItem = (key) => {
      setNames([]);
      setRootId(key)
    }

    return (
      <div className="near_graph" style={{padding: "5px"}}>
        <ViewNodeModal nodes={nodes} setNode={setNode} node={node} setRootId={setRootId} show={showViewModel} setShow={setShowViewModel} address={address} ></ViewNodeModal>
        <CreateRelationModal show={showCreateModel} setShow={setShowCreateModel} nodes={nodes} nodeId={nodeId} setNodeId={setNodeId} 
              relatedNodeId={relatedNodeId} setRelatedNodeId={setRelatedNodeId}></CreateRelationModal>
        <div style={{padding: "15px 15px 0px 15px"}}>
          <p>Right click nodes to create relation between them.</p>
          <InputGroup className="mb-3">
            <InputGroup.Text> 
              <IoSearchOutline />
              Search
            </InputGroup.Text>
            <FormControl
              onChange={searchWordChange.bind(this)}
              placeholder="Enter keyword"
              aria-label="Enter keyword"
              aria-describedby="basic-addon2"
            />
            {names.length > 0 ? (
            <div className="search_result">
              {names.map(item => (
                <div className="result_item item" key={item[1]} onClick={() => { onClickSearchItem(item[1]) }}>
                  { item[0] }
                </div>
              ))}
          </div>
          ) : (<></>)}
          </InputGroup>
        </div>
        <Graph
          className="graph_svg"
          id="graph-id" // id is mandatory
          data={graphData}
          config={graphConfig}
          onClickNode={onClickNode}
          onClickLink={onClickLink}
          onZoomChange={onZoomChange}
          onRightClickNode={onRightClickNode}
        />
      </div>
    )
}

export default NearGraph;
