/*
Graph Menu components with graph loading functions
*/
import { toast } from "react-toastify";
import React, { useEffect, useState, useCallback } from "react";
import {
  getRoots as getRootList,
  getNode
} from "../../utils/api";
import {
  emptyGraph, parseLink, parseNode
} from "../../utils/graph";
import { IoReloadSharp, IoAddCircleOutline } from 'react-icons/io5';
import CreateRootModal from "./CreateRootModal.js"


export const Menu = ({graphData, setGraphData, rootId, setRootId, nodes, setNodes, address}) => {
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [roots, setRoots] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState([]);
  // const [nodes, setNodes] = useState({});
  const [links, setLinks] = useState({});
  const centerX = 750;
  const centerY = 250;
  const startAngle = Math.PI * 11 / 8;

  const getRoots = async () => {
    try {
      setRoots(await getRootList());
    } catch (error) {
      console.log({ error });
    } finally {
    }
  };

  const onClickMenu = (key) => {
    setSelectedMenu(key)
    setRootId(key);
  }

  const onClickCreateRoot = () => {
    if(!address) {
      toast(`Please connect your wallet first`);
      return
    }
    setShowCreateModel(true);
  }

  const getRootNode = useCallback(async (node_id, x, y, originAngle) => {
    // DFS loading graph
    try {
      if(x === centerX) {
        // means that this is a new graph, clean old data and reload everything
        setNodes({});
        setLinks({});
        graphData = emptyGraph();
      }
      // use get_node rpc
      let node = await getNode(node_id);
      // if node is loaded in recursion
      if(node.index in nodes) {
        // repeat loading
        return
      }
      graphData.nodes.push(parseNode(node, x, y));
      nodes[node.index] = node;
      setNodes(nodes);
      if(node.relations.length > 0) {
        // get all links from relation
        let relation_links = parseLink(node);
        for(let i=0;i<relation_links.length;i++) {
          // relation is repeat loading, continue
          if(relation_links[i].index in links) {
            continue;
          }
          if(relation_links[i].target in nodes) {
            graphData.links.push(relation_links[i]);
            links[relation_links[i].index] = relation_links[i];
          }
        }
        setLinks(links);
        // set a start angle for origin node to move
        let angle = Math.PI / node.relations.length;
        // var current_angle = Math.PI * 3 / 8;
        // distance r
        let r = 100;
        for(let i=0;i<node.relations.length;i++) {
          let related_node_id = node.relations[i][1];
          if(!(related_node_id in nodes)) {
            // calc a angle with direction and gen a new node, make it better to see
            let n = await getRootNode(related_node_id, x + r*Math.sin(originAngle), y + r*Math.cos(originAngle), originAngle + Math.PI / 4);
            originAngle += angle;
          }
        }        
      }
      console.log(graphData);
      // finally set the new graph data
      setGraphData(graphData);      
    } catch (error) {
      console.log({ error });
    } finally {
      //
    }
  });
  
  useEffect(() => {
    getRoots();
  });

  useEffect(() => {
    if(rootId === "" && roots.length !== 0) {
      setRootId(roots[0]?.index);
      return;
    }
  }, [roots]);

  useEffect(() => {
    if(rootId === "") {
      return;
    }
    // load root first
    getRootNode(rootId, centerX, centerY, startAngle);
  }, [rootId]);

  return (
    <div className="menu">
      <CreateRootModal rootId={rootId} setRootId={setRootId} show={showCreateModel} setShow={setShowCreateModel} >
      </CreateRootModal>
      <div style={{marginTop: "5px", width: "100%", minHeight: "24px"}}>
        <div style={{float: "right", marginRight: "10px"}} onClick={getRoots}>
          <IoReloadSharp />
        </div>
      </div>
      
      <div className="create_root_bar" onClick={() => { onClickCreateRoot() }}>
        <IoAddCircleOutline style={{marginTop: "4px"}} />
        <span className="black_border_bottom" style={{lineHeight: "24px", marginLeft: "5px"}}>Create new graph</span>
      </div>

      <div style={{marginTop: "15px"}}>
        {roots.map(item => (
          <div className={selectedMenu === item.index ? 'item_selected' : 'item'} key={item.index} onClick={() => { onClickMenu(item.index) }} style={{ padding: "5px" }}>
            { item.name }
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu;
