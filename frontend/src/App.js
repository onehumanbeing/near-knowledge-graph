import React, { useEffect, useCallback, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import { login, logout as destroy, accountBalance } from "./utils/near";
import Wallet from "./components/Wallet";
import { Notification } from "./components/utils/Notifications";
import Menu from "./components/graph/Menu";
import NearGraph from "./components/graph/NearGraph";
import Cover from "./components/utils/Cover";
import coverImg from "./assets/img/logo.png";
import {
  emptyGraph
} from "./utils/graph";
import "./App.css";

const App = function AppWrapper() {
  const account = window.walletConnection.account();

  const [balance, setBalance] = useState("0");
  const [graphData, setGraphData] = useState(emptyGraph());
  const [rootId, setRootId] = useState("");
  const [nodes, setNodes] = useState({});
  const getBalance = useCallback(async () => {
    if (account.accountId) {
      setBalance(await accountBalance());
    }
  });

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <>
      <Notification />
      {account.accountId ? (
        <>
          <Nav className="justify-content-between align-items-center pt-3 pb-3 mb-2" style={{ backgroundColor: "black", padding: "15px" }}>
            <Nav.Item>
              <a href="https://www.zsrtech.com"><img className="nav-icon" src={coverImg} alt="" /></a>
            </Nav.Item>
            <Nav.Item>
              <Wallet
                address={account.accountId}
                amount={balance}
                symbol="NEAR"
                destroy={destroy}
              />
            </Nav.Item>
          </Nav>
          <div className="main">
            <Menu graphData={graphData} setGraphData={setGraphData} rootId={rootId} setRootId={setRootId} nodes={nodes} setNodes={setNodes} />
            <NearGraph graphData={graphData} setRootId={setRootId} nodes={nodes} />
          </div>
        </>
      ) : (
        <Cover name="Near Knowledge Graph" description="Mint and build knowledge ecosystem worldwide" login={login} coverImg={coverImg} />
      )}
    </>
  );
};

export default App;
