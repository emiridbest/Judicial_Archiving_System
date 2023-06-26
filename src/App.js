import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import "./App.css";
import { contractABI, contractAddress } from "./utils/const";
import {
  AddDocument,
  Archive,
  AssignRole,
  Navbar,
  Welcome,
} from "./components/Index";
import "./App.css";

function App() {
    // State variables to store account, contract, kit and data information.
  const [currentAccount, setCurrentAccount] = useState("");
  const [contract, setContractInstance] = useState(null);
  const [kit, setKit] = useState(null);
  const [formData, setFormData] = useState({ address: "", role: "" });
  const [role, setRole] = useState("");
  const [documents, setDocuments] = useState([]);
  // Function to initialize the contract.
  const initContract = useCallback(async () => {
    try {
      if (!window.ethereum) {
        console.error("Celo Wallet extension not detected");
        return;
      }

      const web3 = new Web3(window.ethereum);
      const kit = newKitFromWeb3(web3);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const contract = new kit.web3.eth.Contract(contractABI, contractAddress);

      setCurrentAccount((await kit.web3.eth.getAccounts())[0]);
      setKit(kit);
      setContractInstance(contract);
    } catch (error) {
      console.log(error);
    }
  }, [contractAddress]);

  useEffect(() => {
    if (currentAccount) {
      initContract();
    }
  }, [currentAccount, initContract]);

  //connect wallet
  async function connectToWallet() {
    try {
      if (!window.ethereum) throw new Error("Wallet extension not detected");

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
      throw new Error("Please install Celo Wallet extension");
    }
  }

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  //assign role
  async function assignRole(address, role) {
    try {
      await contract.methods
        .assignRole(address, role)
        .send({ from: currentAccount, gasLimit: 3000000 });
      setRole(role);

      alert(`Role assigned to ${address} successfully!`);
    } catch (error) {
      console.error(error);
    }
  }

  //add document
  async function addDocument(title, pinataCID) {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const tx = await contract.methods
        .addDocument(title, pinataCID, timestamp)
        .send({ from: currentAccount });
      console.log(tx);
    } catch (error) {
      console.error("Error details:", error);
    }
  }

  //get document count
  async function getDocumentCount() {
    try {
      const count = await contract.methods.getDocumentCount().call();
      console.log(count);
    } catch (error) {
      console.log(error);
    }
  }

  //get document
  async function getDocument(id) {
    try {
      const document = await contract.methods.getDocument(id).call();
      console.log(document);
      const url = "https://ipfs.io/ipfs/" + document.pinataCID;
      window.open(url, "_blank");
    } catch (error) {
      console.log(error);
    }
  }

  //get documents
  async function getAllDocuments() {
    try {
      const documents = await contract.methods.getAllDocuments().call();
      console.log(documents);
      setDocuments(documents); // Update the state here
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="">
        <Welcome
          connectToWallet={connectToWallet}
          currentAccount={currentAccount}
        />
      </div>
      <div className="components">
        <AssignRole
          formData={formData}
          assignRole={assignRole}
          handleChange={handleChange}
        />
        <AddDocument
          formData={formData}
          addDocument={addDocument}
          handleChange={handleChange}
        />
        <Archive
          documents={documents}
          getDocumentCount={getDocumentCount}
          getAllDocuments={getAllDocuments}
          getDocument={getDocument}
        />
      </div>
    </div>
  );
}

export default App;
