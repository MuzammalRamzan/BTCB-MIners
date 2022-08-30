import React, { Component, useState, useEffect } from "react";
import "./swap.css";
import bitcoinminnner from "./bitcoinminnner.gif";
import background from "./background.png";
import bitcointransparent from "./bitcointransparent.png";
import miner from "./miner.png";
import minner from "./minner.png";
import digging3 from "./digging3.png";
import mine from "./mine.svg";
import btclogo from "./btclogo.png";
import {
  contractAddressAda,
  abiAda,
  tokenAddresAda,
  tokenAbiAda,
  refDefaultAddress,
} from "../../utils/constant";
import Web3 from "web3";

function Swap() {
  let accountAd;
  const [account, setAccount] = useState("Connect Wallet");
  const [balance, setBalance] = useState(0);
  const [balanceTwo, setBalanceTwo] = useState(0);

  const [userbalance, setuserbalance] = useState(0);
  const [contractbalance, setcontractbalance] = useState(0);
  const [totalReturn, setTotalReturn] = useState(200);
  const [withdrawn, setwithdrawn] = useState(0);
  const [withdrawAble, setwithdrawAble] = useState(0);
  const [enterAmount, setEnterAmount] = useState(null);
  const [tokenAmount, setTokenAmount] = useState();
  const [days, setdays] = useState(0);
  const [digging, setdigging] = useState(0);
  const [btcbmined, setbtcbmined] = useState(0);
  const [actualAccount, setActualAccount] = useState(null);
  const [upline, setUpline] = useState(refDefaultAddress);
  const [getMyMiners, setgetMyMiners] = useState(0);
  let accounts;

  const getAccounts = async () => {
    const web3 = window.web3;
    try {
      accounts = await web3.eth.getAccounts();
      console.log(accounts);
      return accounts;
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
      return null;
    }
  };

  const loadWeb3 = async () => {
    let isConnected = false;
    try {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        isConnected = true;
      } else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
        isConnected = true;
      } else {
        isConnected = false;
        console.log(
          "Metamask is not installed, please install it on your browser to connect."
        );
      }
      if (isConnected === true) {
        let accounts = await getAccounts();
        let accountDetails = null;
        accountAd = accounts[0];
        console.log(accounts[0]);
        let blance1 = await window.web3.eth.getBalance(accounts[0]);
        let convertedBalanc = await window.web3.utils.fromWei(blance1);
        let fourPoint = parseFloat(convertedBalanc).toFixed(4);
        setBalance(fourPoint);
        window.ethereum.on("accountsChanged", function (accounts) {
          accountAd = accounts[0];
          setActualAccount(accountAd);
        });
        accountAd = accounts[0];
        setActualAccount(accountAd);
        let acc =
          accountAd.substring(0, 4) +
          "..." +
          accountAd.substring(accountAd.length - 4);
        setAccount(acc);
        console.log(accounts);
        await balanceOf();
      }
    } catch (error) {
      console.log("Error while connecting metamask", error);
      // alert("Error while connecting metamask");
    }
  };

  // const enterAmountCall = async (e) => {
  //   try {
  //     setEnterAmount(e.target.value);
  //     console.log(e.target.value);
  //     const web3 = window.web3;
  //     try {
  //       let accounts = await getAccounts();
  //       let contract = new web3.eth.Contract(abi, contractAddressAda);
  //       let amount = await contract.methods.getTokens(await web3.utils.toWei(e.target.value))
  //         .call();
  //         console.log(amount)
  //       if (e.target.value) {
  //         let convertedBalanc = await window.web3.utils.fromWei(amount)
  //         setTokenAmount(convertedBalanc)
  //       } else {
  //         setTokenAmount(null)
  //       }
  //       console.log(e.target.value)
  //     } catch (error) {
  //       console.log("Error while fetching acounts: ", error);

  //     }
  //   } catch (error) {
  //     console.log("Error while checking locked account", error);
  //   }
  // };

  const enterAmountCall = async (e) => {
    try {
      setEnterAmount(e.target.value);
      console.log("enterAmountCall", e.target.value);
      // const web3 = window.web3;
      // try {
      //   let accounts = await getAccounts();
      //   let contract = new web3.eth.Contract(abi, contractAddressAda);

      //   if (e.target.value) {
      //     let amount = await contract.methods.getTokens(await web3.utils.toWei(e.target.value))
      //       .call();
      //     console.log("bdmfkbmkdlmbkf" + amount)
      //     let convertedBalanc = amount / 10 ** 9;
      //     setTokenAmount(convertedBalanc)
      //   } else {
      //     console.log(e.target.value)
      //     setTokenAmount(0);
      //   }
      //   console.log(e.target.value)
      // } catch (error) {
      //   console.log("Error while fetching acounts: ", error);

      // }
    } catch (error) {
      console.log("Error while checking locked account", error);
    }
  };

  const maxClc = async (e) => {
    try {
      if (balance >= 3) {
        setEnterAmount(3);
      } else if (balance > 0.01) {
        setEnterAmount(balance);
        const web3 = window.web3;
        try {
          let accounts = await getAccounts();
          let contract = new web3.eth.Contract(abiAda, contractAddressAda);
          let amount = await contract.methods
            .getTokens(await web3.utils.toWei(balance))
            .call();
          let convertedBalanc = await window.web3.utils.fromWei(amount);
          setTokenAmount(convertedBalanc);
        } catch (error) {
          console.log("Error while fetching acounts: ", error);
        }
      } else {
        alert("Balance is not sufficient");
      }
    } catch (error) {
      console.log("Error while checking locked account", error);
    }
  };

  const swapTokens = async () => {
    const web3 = window.web3;
    try {
      console.log(actualAccount);
      let contract = new web3.eth.Contract(abiAda, contractAddressAda);
      let tokenContract = new web3.eth.Contract(tokenAbiAda, tokenAddresAda);
      await tokenContract.methods
        .approve(contractAddressAda, web3.utils.toWei("" + enterAmount))
        .send({
          from: actualAccount,
        })
        .then(async (output) => {
          await contract.methods
            .buyEggs(upline, web3.utils.toWei("" + enterAmount))
            .send({
              from: actualAccount,
            })
            .then(async (output) => {
              console.log("Transaction Completed");
            })
            .catch((e) => {
              console.log("response", e);
            });
        })
        .catch((e) => {
          console.log("response", e);
        });
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  const hatchEggs = async () => {
    const web3 = window.web3;
    try {
      console.log(actualAccount);
      let contract = new web3.eth.Contract(abiAda, contractAddressAda);

      await contract.methods
        .hatchEggs(upline)
        .send({
          from: actualAccount,
        })
        .then(async (output) => {
          console.log("Transaction Completed");
        })
        .catch((e) => {
          console.log("response", e);
        });
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  const sell = async () => {
    const web3 = window.web3;
    try {
      console.log(actualAccount);
      let contract = new web3.eth.Contract(abiAda, contractAddressAda);

      await contract.methods
        .sellEggs()
        .send({
          from: actualAccount,
        })
        .then(async (output) => {
          console.log("Transaction Completed");
        })
        .catch((e) => {
          console.log("response", e);
          // toast.error(e.message);
        });
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  // const balanceOf = async () => {
  //   const web3 = window.web3;
  //   try {
  //     let accounts = await getAccounts();
  //     let contract = new web3.eth.Contract(abiAda, contractAddressAda);
  //     let tokenContract = new web3.eth.Contract(tokenAbiAda, tokenAddresAda);
  //     let blance2 = await tokenContract.methods.balanceOf(accountAd)
  //       .call();
  //     // let convertedBalanc = blance2 / 10 ** 9;
  //     setuserbalance(web3.utils.fromWei(blance2))
  //     console.log(balanceTwo)
  //     let getBalance = await contract.methods.getBalance().call();
  //     setcontractbalance(web3.utils.fromWei(getBalance));

  //     let getMyMiners = await contract.methods.hatcheryMiners(accountAd).call();
  //     setgetMyMiners(getMyMiners)
  //     setdigging((getMyMiners / 2592000) * 60 * 60);
  //     let getMyEggs = await contract.methods.getMyEggs().call();
  //     setbtcbmined(web3.utils.fromWei(getMyEggs))
  //     // let getBalance = await tokenContract.methods.balanceOf(accounts[0])
  //     // setcontractbalance(getBalance);

  //   } catch (error) {
  //     console.log("Error while fetching acounts: ", error);

  //   }
  // };

  function formatThousands(num) {
    var numbr = parseFloat(num.toFixed(2));
    var values = numbr.toString().split(".");
    return (
      values[0].replace(/.(?=(?:.{3})+$)/g, "$&,") +
      (values.length == 2 ? "." + values[1] : "")
    );
  }

  const balanceOf = async () => {
    const web3 = window.web3;
    try {
      let accounts = await getAccounts();
      let contract = new web3.eth.Contract(abiAda, contractAddressAda);
      let tokenContract = new web3.eth.Contract(tokenAbiAda, tokenAddresAda);
      let blance2 = await tokenContract.methods.balanceOf(accountAd).call();
      // let convertedBalanc = blance2 / 10 ** 9;
      setuserbalance(formatThousands(parseFloat(web3.utils.fromWei(blance2))));
      console.log(balanceTwo);
      let getBalance = await contract.methods.getBalance().call();
      setcontractbalance(
        formatThousands(parseFloat(web3.utils.fromWei(getBalance)))
      );

      let getMyMiners = await contract.methods.hatcheryMiners(accountAd).call();
      setgetMyMiners(formatThousands(parseFloat(getMyMiners)));
      setdigging(
        formatThousands(parseFloat((getMyMiners / 2592000) * 60 * 60))
      );
      let getMyEggs = await contract.methods.getMyEggs().call();
      setbtcbmined(formatThousands(parseFloat(web3.utils.fromWei(getMyEggs))));
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  const addtoMetaMask = async () => {
    const tokenAddress = "0x6f0f83cb5487cc237a1f668f09e7a2f073afc8ca";
    const tokenSymbol = "ADA";
    const tokenDecimals = 9;
    // const tokenImage = 'http://placekitten.com/200/300';

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddresAda, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            // image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      loadWeb3();
    }, 1000);
  }, []);

  return (
    <div className="container-fluid">
      <div className="Header">
        <div className="container">
          <div className="row pt-3">
            <div className="col-md  headerimg">
              <div className="col-md-8 col-sm-4 headerimg1">
                <img src={bitcointransparent} width="270px" />
              </div>
              <div>
                <button className="btn btn-warning fw-bold" onClick={loadWeb3}>
                  {account}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-sm-7">
            <div className="row offset-md-3">
              <div className="col-md-2">
                <img className="icon" src={miner} />
              </div>
              <div
                className="col-md-10"
                style={{
                  marginTop: "40px",
                }}
              >
                <h3>
                  <span className="icon-span"> {getMyMiners} </span>
                  <span className="icon-heading"> - ADA Miners </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="row offset-md-3">
              <div className="col-md-3">
                <img className="icon" src={digging3} />
              </div>
              <div className="col-md-6">
                <h3 className="icon-heading">Digging</h3>
                <span className="icon-span"> {digging} feet per hour</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="row">
              <div className="col-md-3">
                <img className="icon" src={mine} />
              </div>
              <div className="col-md-6">
                <h3 className="icon-heading">ADA Mined</h3>
                <span className="icon-span"> {btcbmined} </span>
                <span className="icon-span">feet per hour</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="headerbar">
        <div className="container1">
          <div className="headerbar2">
            <div>
              <img src={background} className="img-responsive" />
            </div>
            <div>
              <div className="card p-3 rounded-3">
                <div className="title">
                  <h5>Exchange Tokens</h5>
                </div>
                <div className="input-field">
                  <div className="flex navbar">
                    <small>From</small>
                    <div>
                      <small>Balance: </small>
                      <small>{userbalance}</small>
                    </div>
                  </div>
                  <div className="nputdv">
                    <input
                      min="0"
                      id="floatingInput"
                      placeholder="Enter amount"
                      onChange={enterAmountCall}
                      value={enterAmount}
                    />
                  </div>
                </div>
                <button
                  href="#"
                  className="btn btn-warning my-3 py-3 text-dark fw-bold"
                  onClick={swapTokens}
                >
                  Hire Miners
                </button>
                <button
                  href="#"
                  className="btn btn-warning my-3 py-3 text-dark fw-bold"
                  onClick={addtoMetaMask}
                >
                  Add to Metamask
                </button>
              </div>
            </div>
            <img src={bitcoinminnner} className="img-header" />
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col">
            <button
              href="#"
              className="btn btn-secondary m-1 my-3 py-3 text-light fw-bold"
              onClick={hatchEggs}
            >
              Hire More Miners
            </button>

            <button
              href="#"
              className="btn btn-secondary m-1 my-3 py-3 text-light fw-bold"
              onClick={sell}
            >
              Pocket Your ADA
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row offset-md-4">
          <div className="row">
            <div className="col">
              <div className="cardbtc">
                <div className="col-md-3">
                  <img
                    src={btclogo}
                    style={{
                      height: "8vh",
                      width: "auto",
                    }}
                  />
                </div>
                <div className="col-md-8">
                  <span> Contract: {contractbalance} ADA</span>
                  <span> You: {userbalance} ADA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col">
            <h1
              style={{
                color: "white",
              }}
            >
              BUY ADA
              <a
                href="https://pancakeswap.finance/swap?inputCurrency=0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47"
                target="_blank"
                style={{
                  color: "white",
                  padding: "5px",
                }}
              >
                HERE
              </a>
            </h1>
          </div>
          <div className="row">
            <div className="col-md-4 offset-md-4" id="msgcol">
              <p>
                Share your ADA Miner referral link, our contract pays you a 7%
                referral fee when anyone uses your link to hire miners:
              </p>
              <p>
                <p
                  style={{
                    fontWeight: "500",
                    padding: "0",
                    margin: "0",
                    color: "rgb(223, 130, 8)",
                  }}
                >
                  Sustainability
                </p>
                100% daily doesnt work, causing instant and massive inflation.
                ADA Miner pays a considerable 3% daily minimum, allowing users
                to rest easy knowing that their ADA has unlimited growth
                potential and a maximum, improbable risk of less than 3%. Simply
                Put, ADA in ADA Out
              </p>
              <p>
                <p
                  style={{
                    fontWeight: "500",
                    padding: "0",
                    margin: "0",
                    color: "rgb(223, 130, 8)",
                  }}
                >
                  Verified Public Contract
                </p>
                The ADA Miner contract is public, verified and can be viewed
                here on BSCScan.
              </p>
              <p>
                <p
                  style={{
                    fontWeight: "500",
                    padding: "0",
                    margin: "0",
                    color: "rgb(223, 130, 8)",
                  }}
                >
                  Miner Info
                </p>
                ADA Miner pays 3% daily, according to the current mining
                efficiency rate. The mining efficiency rate rises and falls as
                you and other players hire miners, compound earnings and pocket
                ADA.
              </p>
              <p>
                The object of the game is hiring more miners, sooner and more
                often than other players. This in turn earns you more ADA
                faster. Hiring more miners using your daily ADA earnings will 3x
                your miners within 30 days or less.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Swap;
