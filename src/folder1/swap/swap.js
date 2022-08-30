import React, { Component, useState, useEffect } from "react";
import "./swap.css";
import bitcoinminnner from "./bitcoinminnner.gif";
import background from "./background.png";
import bitcointransparent from "./bitcointransparent.png";
import miner from "./miner.jpeg";
// import minner from './minner.png'
import digging1 from "./digging1.png";
import mine from "./mine.svg";
import btclogo from "./btclogo.png";
import {
  contractAddressBsw,
  abiBsw,
  tokenAddresBsw,
  tokenAbiBsw,
  refDefaultAddress,
  tokenAddres,
} from "../../utils/constant";
import Web3 from "web3";
// import ethereum from "ethereum"

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

  function formatThousands(num) {
    var numbr = parseFloat(num.toFixed(2));
    var values = numbr.toString().split(".");
    return (
      values[0].replace(/.(?=(?:.{3})+$)/g, "$&,") +
      (values.length == 2 ? "." + values[1] : "")
    );
  }

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
        window.ethereum.on("accountsChanged", function (accounts) {});
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
    }
  };

  const enterAmountCall = async (e) => {
    try {
      setEnterAmount(e.target.value);
      console.log("enterAmountCall", e.target.value);
      // const web3 = window.web3;
      // try {
      //   let accounts = await getAccounts();
      //   let contract = new web3.eth.Contract(abi, contractAddress);

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
          let contract = new web3.eth.Contract(abiBsw, contractAddressBsw);
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
      let contract = new web3.eth.Contract(abiBsw, contractAddressBsw);
      let tokenContract = new web3.eth.Contract(tokenAbiBsw, tokenAddresBsw);
      await tokenContract.methods
        .approve(contractAddressBsw, web3.utils.toWei("" + enterAmount))
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
      let contract = new web3.eth.Contract(abiBsw, contractAddressBsw);

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
      let contract = new web3.eth.Contract(abiBsw, contractAddressBsw);

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
        });
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };
  const balanceOf = async () => {
    const web3 = window.web3;
    try {
      let accounts = await getAccounts();
      let contract = new web3.eth.Contract(abiBsw, contractAddressBsw);
      let tokenContract = new web3.eth.Contract(tokenAbiBsw, tokenAddresBsw);
      let blance2 = await tokenContract.methods.balanceOf(accountAd).call();
      setuserbalance(formatThousands(parseFloat(web3.utils.fromWei(blance2))));
      console.log(balanceTwo);
      let getBalance = await contract.methods.getBalance().call();
      setcontractbalance(
        formatThousands(parseFloat(web3.utils.fromWei(getBalance)))
      );

      let getMyMiners = await contract.methods.hatcheryMiners(accountAd).call();
      setgetMyMiners(formatThousands(parseFloat(getMyMiners)));
      setdigging(formatThousands((getMyMiners / 2592000) * 60 * 60));
      let getMyEggs = await contract.methods.getMyEggs().call();
      setbtcbmined(formatThousands(parseFloat(web3.utils.fromWei(getMyEggs))));
    } catch (error) {
      console.log("Error while fetching acounts: ", error);
    }
  };

  const addtoMetaMask = async () => {
    // const tokenAddress = '0x6f0f83cb5487cc237a1f668f09e7a2f073afc8ca';
    const tokenSymbol = "BSW";
    const tokenDecimals = 9;

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddresBsw, // The address that the token is at.
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
                  <span className="icon-heading"> - BSW Miners </span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6">
            <div className="row offset-md-3">
              <div className="col-md-3">
                <img className="icon" src={digging1} />
              </div>
              <div className="col-md-6">
                <h3 className="icon-heading">Digging</h3>
                <span className="icon-span">{digging} feet per hour</span>
              </div>
            </div>
          </div>

          <div className="col-sm-6">
            <div className="row">
              <div className="col-md-3">
                <img className="icon" src={mine} />
              </div>
              <div className="col-md-6">
                <h3 className="icon-heading">BSW Mined</h3>
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
                  <h5>Deposit BTCB</h5>
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
              Pocket Your BSW
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
                  <span> Contract: {contractbalance} BSW</span>
                  <span> You: {userbalance} BSW</span>
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
              BUY BSW
              <a
                href="https://exchange.biswap.org/#/swap?outputCurrency=0x965f527d9159dce6288a2219db51fc6eef120dd1"
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
                Share your BISWAP Miner referral link, our contract pays you a
                7% referral fee when anyone uses your link to hire miners:
                https://biswapminer.co?ref=0xaf3537a993099778672c2BBf8A9ddfE478a378C7
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
                  {" "}
                  Sustainability{" "}
                </p>
                100% daily doesnt work, causing instant and massive inflation.
                BISWAP Miner pays a considerable 3% daily minimum, allowing
                users to rest easy knowing that their BISWAP has unlimited
                growth potential and a maximum, improbable risk of less than 3%.
                Simply Put, BISWAP in BISWAP Out
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
                The BISWAP Miner contract is public, verified and can be viewed
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
                BISWAP Miner pays 3% daily, according to the current mining
                efficiency rate. The mining efficiency rate rises and falls as
                you and other players hire miners, compound earnings and pocket
                BISWAP.
              </p>
              <p>
                The object of the game is hiring more miners, sooner and more
                often than other players. This in turn earns you more BISWAP
                faster. Hiring more miners using your daily BISWAP earnings will
                3x your miners within 30 days or less.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Swap;
