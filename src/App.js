import React, { useState, useEffect } from "react";
import "./App.css";
import Button from "@material-ui/core/Button";
import {
  NotificationContainer,
  NotificationManager
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ethers } from "ethers";
import { Biconomy } from "@biconomy/mexa";

import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import { Box } from "@material-ui/core";
let sigUtil = require("eth-sig-util");


let config = {
  contract: { //My contract which should be gasless
    address: "0xB6A0748efA322fE482F4Df9B8d2FA16774E39d67",
    abi: [{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"userAddress","type":"address"},{"indexed":false,"internalType":"addresspayable","name":"relayerAddress","type":"address"},{"indexed":false,"internalType":"bytes","name":"functionSignature","type":"bytes"}],"name":"MetaTransactionExecuted","type":"event"},{"inputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"bytes","name":"functionSignature","type":"bytes"},{"internalType":"bytes32","name":"sigR","type":"bytes32"},{"internalType":"bytes32","name":"sigS","type":"bytes32"},{"internalType":"uint8","name":"sigV","type":"uint8"}],"name":"executeMetaTransaction","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getNonce","outputs":[{"internalType":"uint256","name":"nonce","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getQuote","outputs":[{"internalType":"string","name":"currentQuote","type":"string"},{"internalType":"address","name":"currentOwner","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"quote","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"newQuote","type":"string"}],"name":"setQuote","outputs":[],"stateMutability":"nonpayable","type":"function"}]
  },
  proxyContract: {
    address: "0xf5173b8355f4744e2b19bfb2ef1e9b77b2f9c329",
    abi: [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"AddedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"approvedHash","type":"bytes32"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ApproveHash","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"handler","type":"address"}],"name":"ChangedFallbackHandler","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"guard","type":"address"}],"name":"ChangedGuard","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"}],"name":"ChangedThreshold","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"module","type":"address"}],"name":"DisabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"module","type":"address"}],"name":"EnabledModule","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleFailure","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"module","type":"address"}],"name":"ExecutionFromModuleSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"bytes32","name":"txHash","type":"bytes32"},{"indexed":false,"internalType":"uint256","name":"payment","type":"uint256"}],"name":"ExecutionSuccess","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"RemovedOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"SafeReceived","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"initiator","type":"address"},{"indexed":false,"internalType":"address[]","name":"owners","type":"address[]"},{"indexed":false,"internalType":"uint256","name":"threshold","type":"uint256"},{"indexed":false,"internalType":"address","name":"initializer","type":"address"},{"indexed":false,"internalType":"address","name":"fallbackHandler","type":"address"}],"name":"SafeSetup","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"bytes32","name":"msgHash","type":"bytes32"}],"name":"SignMsg","type":"event"},{"stateMutability":"nonpayable","type":"fallback"},{"inputs":[],"name":"VERSION","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"addOwnerWithThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"hashToApprove","type":"bytes32"}],"name":"approveHash","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"approvedHashes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"changeThreshold","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"signatures","type":"bytes"},{"internalType":"uint256","name":"requiredSignatures","type":"uint256"}],"name":"checkNSignatures","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"dataHash","type":"bytes32"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"checkSignatures","outputs":[],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"prevModule","type":"address"},{"internalType":"address","name":"module","type":"address"}],"name":"disableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"domainSeparator","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"enableModule","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"encodeTransactionData","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address payable","name":"refundReceiver","type":"address"},{"internalType":"bytes","name":"signatures","type":"bytes"}],"name":"execTransaction","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModule","outputs":[{"internalType":"bool","name":"success","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"execTransactionFromModuleReturnData","outputs":[{"internalType":"bool","name":"success","type":"bool"},{"internalType":"bytes","name":"returnData","type":"bytes"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getChainId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"start","type":"address"},{"internalType":"uint256","name":"pageSize","type":"uint256"}],"name":"getModulesPaginated","outputs":[{"internalType":"address[]","name":"array","type":"address[]"},{"internalType":"address","name":"next","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwners","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"offset","type":"uint256"},{"internalType":"uint256","name":"length","type":"uint256"}],"name":"getStorageAt","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getThreshold","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"},{"internalType":"uint256","name":"safeTxGas","type":"uint256"},{"internalType":"uint256","name":"baseGas","type":"uint256"},{"internalType":"uint256","name":"gasPrice","type":"uint256"},{"internalType":"address","name":"gasToken","type":"address"},{"internalType":"address","name":"refundReceiver","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"}],"name":"getTransactionHash","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"module","type":"address"}],"name":"isModuleEnabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"isOwner","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nonce","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"_threshold","type":"uint256"}],"name":"removeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"enum Enum.Operation","name":"operation","type":"uint8"}],"name":"requiredTxGas","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"handler","type":"address"}],"name":"setFallbackHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"guard","type":"address"}],"name":"setGuard","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_owners","type":"address[]"},{"internalType":"uint256","name":"_threshold","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"},{"internalType":"address","name":"fallbackHandler","type":"address"},{"internalType":"address","name":"paymentToken","type":"address"},{"internalType":"uint256","name":"payment","type":"uint256"},{"internalType":"address payable","name":"paymentReceiver","type":"address"}],"name":"setup","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signedMessages","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"targetContract","type":"address"},{"internalType":"bytes","name":"calldataPayload","type":"bytes"}],"name":"simulateAndRevert","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"prevOwner","type":"address"},{"internalType":"address","name":"oldOwner","type":"address"},{"internalType":"address","name":"newOwner","type":"address"}],"name":"swapOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
  },
  apiKey: {
    prod: "7W13hdrj0.5006d7ad-32a1-48bb-9cec-47b7e112050e"
  },
  api: {
    prod: "https://api.biconomy.io"
  }

}

const domainType = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "verifyingContract", type: "address" },
  { name: "salt", type: "bytes32" },
];

const metaTransactionType = [
  { name: "nonce", type: "uint256" },
  { name: "from", type: "address" },
  { name: "functionSignature", type: "bytes" }
];

let domainData = {
  name: "TestContract",
  version: "1",
  verifyingContract: config.contract.address,
  salt: ethers.utils.hexZeroPad((ethers.BigNumber.from(42)).toHexString(), 32)
};

let ethersProvider,walletProvider, walletSigner;
let contract, contractInterface;
let walletContract;

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
  link: {
    marginLeft: "5px"
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    opacity: '.85!important',
    background: '#000'
  },
}));

let biconomy;

function App() {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();
  const [backdropOpen, setBackdropOpen] = React.useState(true);
  const [loadingMessage, setLoadingMessage] = React.useState(" Loading Application ...");
  const [quote, setQuote] = useState("This is a default quote");
  const [owner, setOwner] = useState("Default Owner Address");
  const [newQuote, setNewQuote] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [metaTxEnabled, setMetaTxEnabled] = useState(true);
  const [transactionHash, setTransactionHash] = useState("");

  const handleClose = () => {
    setBackdropOpen(false);
  };

  const handleToggle = () => {
    setBackdropOpen(!backdropOpen);
  };


  useEffect(() => {
    async function init() {
      if (
          typeof window.ethereum !== "undefined" &&
          window.ethereum.isMetaMask
      ) {
        // Ethereum user detected. You can now use the provider.
        const provider = window["ethereum"];
        await provider.enable();
        setLoadingMessage("Initializing Biconomy ...");
        // We're creating biconomy provider linked to your network of choice where your contract is deployed
        biconomy = new Biconomy(new ethers.providers.WebSocketProvider("wss://polygon-mumbai.g.alchemy.com/v2/kuBXZrz3LHwQsjM9E_0KEhBSEjOHmkue"),
            { apiKey: config.apiKey.prod, debug: true });

        /*
          This provider is linked to your wallet.
          If needed, substitute your wallet solution in place of window.ethereum
        */
        ethersProvider = new ethers.providers.Web3Provider(biconomy);
        walletProvider = new ethers.providers.Web3Provider(window.ethereum);
        walletSigner = walletProvider.getSigner();

        let userAddress = await walletSigner.getAddress()
        setSelectedAddress(userAddress);

        biconomy.onEvent(biconomy.READY, async () => {

          // Initialize your dapp here like getting user accounts etc
          contract = new ethers.Contract(
              config.contract.address,
              config.contract.abi,
              biconomy.getSignerByAddress(userAddress)
          );

          walletContract = new ethers.Contract(
              config.proxyContract.address,
              config.proxyContract.abi,
              biconomy.getSignerByAddress(userAddress)
          );

          contractInterface = new ethers.utils.Interface(config.contract.abi);
          getQuoteFromNetwork();
        }).onEvent(biconomy.ERROR, (error, message) => {
          // Handle error while initializing mexa
          console.log(message);
          console.log(error);
        });
      } else {
        showErrorMessage("Metamask not installed");
      }
    }
    init();
  }, []);

  const onQuoteChange = event => {
    setNewQuote(event.target.value);
  };

  const onSubmitWithEIP712Sign = async event => {
    if (newQuote != "" && contract) {
      setTransactionHash("");
      if (metaTxEnabled) {
        showInfoMessage(`Getting user signature`);
        let userAddress = selectedAddress;
        let nonce = await contract.getNonce(userAddress);
        let functionSignature = contractInterface.encodeFunctionData("setQuote", [newQuote]);
        let message = {};
        message.nonce = parseInt(nonce);
        message.from = userAddress;
        message.functionSignature = functionSignature;

        const dataToSign = JSON.stringify({
          types: {
            EIP712Domain: domainType,
            MetaTransaction: metaTransactionType
          },
          domain: domainData,
          primaryType: "MetaTransaction",
          message: message
        });

        // Its important to use eth_signTypedData_v3 and not v4 to get EIP712 signature because we have used salt in domain data
        // instead of chainId
        let signature = await walletProvider.send("eth_signTypedData_v3", [userAddress, dataToSign])
        let { r, s, v } = getSignatureParameters(signature);
        sendTransaction(userAddress, functionSignature, r, s, v);
      } else {
        console.log("Sending normal transaction");
        let tx = await contract.setQuote(newQuote);
        console.log("Transaction hash : ", tx.hash);
        showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
        let confirmation = await tx.wait();
        console.log(confirmation);
        setTransactionHash(tx.hash);
        showSuccessMessage("Transaction confirmed on chain");
        getQuoteFromNetwork();
      }
    } else {
      showErrorMessage("Please enter the quote");
    }
  };

  const onSubmitWithPrivateKey = async (event) => {
    if (newQuote != "" && contract) {
      setTransactionHash("");

      try {
        if (metaTxEnabled) {
          showInfoMessage(`Getting user signature`);
          let privateKey =
              "2ef295b86aa9d40ff8835a9fe852942ccea0b7c757fad5602dfa429bcdaea910";
          let wallet = new ethers.Wallet(privateKey);
          let userAddress = "0xE1E763551A85F04B4687f0035885E7F710A46aA6";
          let nonce = await contract.getNonce(userAddress);
          let functionSignature = contractInterface.encodeFunctionData(
              "setQuote",
              [newQuote]
          );
          let message = {};
          message.nonce = parseInt(nonce);
          message.from = userAddress;
          message.functionSignature = functionSignature;

          // NOTE: DO NOT use JSON.stringify on dataToSign object
          const dataToSign = {
            types: {
              EIP712Domain: domainType,
              MetaTransaction: metaTransactionType,
            },
            domain: domainData,
            primaryType: "MetaTransaction",
            message: message,
          };

          // Its important to use eth_signTypedData_v3 and not v4 to get EIP712 signature because we have used salt in domain data
          // instead of chainId
          const signature = sigUtil.signTypedMessage(
              new Buffer.from(privateKey, "hex"),
              { data: dataToSign },
              "V3"
          );
          let { r, s, v } = getSignatureParameters(signature);
          sendTransaction(userAddress, functionSignature, r, s, v);
        } else {
          console.log("Sending normal transaction");
          let tx = await contract.setQuote(newQuote);
          console.log("Transaction hash : ", tx.hash);
          showInfoMessage(`Transaction sent by relayer with hash ${tx.hash}`);
          let confirmation = await tx.wait();
          console.log(confirmation);
          setTransactionHash(tx.hash);
          showSuccessMessage("Transaction confirmed on chain");
          getQuoteFromNetwork();
        }
      } catch (error) {
        console.log(error);
        handleClose();
      }
    } else {
      showErrorMessage("Please enter the quote");
    }
  };

  const getSignatureParameters = signature => {
    if (!ethers.utils.isHexString(signature)) {
      throw new Error(
          'Given value "'.concat(signature, '" is not a valid hex string.')
      );
    }
    var r = signature.slice(0, 66);
    var s = "0x".concat(signature.slice(66, 130));
    var v = "0x".concat(signature.slice(130, 132));
    v = ethers.BigNumber.from(v).toNumber();
    if (![27, 28].includes(v)) v += 27;
    return {
      r: r,
      s: s,
      v: v
    };
  };

  const getQuoteFromNetwork = async () => {
    setLoadingMessage("Getting Quote from contact ...");
    let result = await contract.getQuote();
    if (
        result &&
        result.currentQuote != undefined &&
        result.currentOwner != undefined
    ) {
      if (result.currentQuote == "") {
        showErrorMessage("No quotes set on blockchain yet");
      } else {
        setQuote(result.currentQuote);
        setOwner(result.currentOwner);
      }
    } else {
      showErrorMessage("Not able to get quote information from Network");
    }
    handleClose();
  };

  const showErrorMessage = message => {
    NotificationManager.error(message, "Error", 5000);
  };

  const showSuccessMessage = message => {
    NotificationManager.success(message, "Message", 3000);
  };

  const showInfoMessage = message => {
    NotificationManager.info(message, "Info", 3000);
  };

  const sendTransaction = async (userAddress, functionData, r, s, v) => {
    if (ethersProvider && contract) {
      try {
        fetch(`${config.api.prod}/api/v2/meta-tx/native`, {
          method: "POST",
          headers: {
            "x-api-key" : config.apiKey.prod,
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify({
            "to": config.contract.address,
            "apiId": "ab6a62bf-c58f-4040-9084-0fad85f3345a",
            //"apiId": "f93b5089-574e-47b7-92a1-2a9fff66215a",
            "params": [userAddress, functionData, r, s, v],
            "from": userAddress
          })
        })
            .then(response=>response.json())
            .then(async function(result) {
              console.log(result);
              showInfoMessage(`Transaction sent by relayer with hash ${result.txHash}`);
              let receipt = await ethersProvider.waitForTransaction(
                  result.txHash
              );
              console.log(receipt);
              setTransactionHash(receipt.transactionHash);
              showSuccessMessage("Transaction confirmed on chain");
              getQuoteFromNetwork();
            }).catch(function(error) {
          console.log(error)
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onSubmitSCWTx = async event => {
    if (newQuote != "" && contract) {
      setTransactionHash("");
      // debugger;
      const operation = 0; // CALL
      const gasPrice = 0; // If 0, then no refund to relayer
      const gasToken = '0x0000000000000000000000000000000000000000'; // ETH
      const executor = '0x0000000000000000000000000000000000000000';
      const to = config.contract.address;
      const valueWei = 0;
      const { data } = await contract.populateTransaction.setQuote(newQuote);
      let txGasEstimate = 0;
      let baseGasEstimate = 0;
      const nonce = await walletContract.nonce();
      console.log(`nonce`, nonce);
      const transactionHash = await walletContract.getTransactionHash(
          to, valueWei, data, operation, txGasEstimate, baseGasEstimate, gasPrice, gasToken, executor, nonce);
      console.log(transactionHash)
      console.log(selectedAddress);

      let privateKey = "cbe9aa79f62169c0e5f88c09251c44c9c690cf38ff8a39f4c18e72fffa03565f";
      let wallet = new ethers.Wallet(privateKey, ethersProvider);

      // const newHash = ethers.utils.hashMessage(transactionHash);
      // console.log("Hash with prefix (hashMessage): ", newHash);

      // const newHash2 = ethers.utils.keccak256(`\x19Ethereum Signed Message:\n${transactionHash.length}`.toString(16));
      // console.log("Hash with prefix 2 (hashMessage): ", newHash);
      //
      const signature = await wallet.signMessage(ethers.utils.arrayify(transactionHash));
      console.log("Sig w/private key: ", signature);

      // const signature2 = await walletProvider.send("eth_sign", [selectedAddress, newHash]);
      // console.log("Eth_sign with prefix: ", signature2);
      // console.log("Eth_sign with prefix2: ", ethers.utils.keccak256(signature2));
      //
      const signature3 = await walletProvider.send("personal_sign", [selectedAddress, transactionHash]);
      console.log("personal_sing w/o prefix: ", signature3);

      return;

      const { r, s, v } = getSignatureParameters(signature);
      const newSignature = `${r}${s.substring(2)}${Number(v + 4).toString(16)}`;
      // debugger;

      let trasnaction = await walletContract.execTransaction(to, valueWei, data, operation, txGasEstimate,
          baseGasEstimate, gasPrice, gasToken, executor, newSignature, {gasLimit: 1000000});

      console.log("here");
      console.log(trasnaction);

      /*let dataNew = await walletContract.populateTransaction.execTransaction(to, valueWei, data, operation, txGasEstimate,
        baseGasEstimate, gasPrice, gasToken, executor, newSignature);
      let provider = biconomy.getEthersProvider();
      let gasLimit = await provider.estimateGas({
              to: config.proxyContract.address,
              from: selectedAddress,
              data: dataNew.data
          });
      console.log("Gas limit : ", gasLimit);
      let txParams = {
              data: data,
              to: config.proxyContract.address,
              from: selectedAddress,
              gasLimit: gasLimit,
          };
          let tx;
          try {
              tx = await provider.send("eth_sendTransaction", [txParams])
          }
          catch (err) {
              console.log("handle errors like signature denied here");
              console.log(err);
          }*/
      //let receipt = await trasnaction.wait(1);


    } else {
      showErrorMessage("Please enter the quote");
    }
  };
  return (
      <div className="App">
        <section className="top-row">
          <div className="top-row-item">
            <span className="label">Library </span>
            <span className="label-value">ethers.js</span>
          </div>
          <div className="top-row-item">
            <span className="label">Meta Transaction</span>
            <span className="label-value">Custom Approach</span>
          </div>
          <div className="top-row-item">
            <span className="label">Signature Type</span>
            <span className="label-value">EIP712 Signature</span>
          </div>
        </section>
        <section className="main">
          <div className="mb-wrap mb-style-2">
            <blockquote cite="http://www.gutenberg.org/ebboks/11">
              <p>{quote}</p>
            </blockquote>
          </div>

          <div className="mb-attribution">
            <p className="mb-author">{owner}</p>
            {selectedAddress.toLowerCase() === owner.toLowerCase() && (
                <cite className="owner">You are the owner of the quote</cite>
            )}
            {selectedAddress.toLowerCase() !== owner.toLowerCase() && (
                <cite>You are not the owner of the quote</cite>
            )}
          </div>
        </section>
        <section>
          {transactionHash !== "" && <Box className={classes.root} mt={2} p={2}>
            <Typography>
              Check your transaction hash
              <Link href={`https://kovan.etherscan.io/tx/${transactionHash}`} target="_blank"
                    className={classes.link}>
                here
              </Link>
            </Typography>
          </Box>}
        </section>
        <section>
          <div className="submit-container">
            <div className="submit-row">
              <input
                  type="text"
                  placeholder="Enter your quote"
                  onChange={onQuoteChange}
                  value={newQuote}
              />
              <Button variant="contained" color="primary" onClick={onSubmitWithEIP712Sign} style={{ marginLeft: "10px" }}>
                Submit
              </Button>
              <Button variant="contained" color="primary" onClick={onSubmitSCWTx} style={{ marginLeft: "10px" }}>
                Submit SCW
              </Button>

              <Button variant="contained" color="secondary" onClick={onSubmitWithPrivateKey} style={{ marginLeft: "10px" }}>
                Submit (Private Key)
              </Button>
            </div>
          </div>
        </section>
        <Backdrop className={classes.backdrop} open={backdropOpen} onClick={handleClose}>
          <CircularProgress color="inherit" />
          <div style={{ paddingLeft: "10px" }}>{loadingMessage}</div>
        </Backdrop>
        <NotificationContainer />
      </div>
  );
}

export default App;