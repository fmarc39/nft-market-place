import "../styles/globals.css";
import Link from "next/link";
import Logo from "../public/assets/logo/shutter.svg";
import Image from "next/image";
import HomeLogo from "../public/assets/logo/homepage.svg";
import Dashboard from "../public/assets/logo/dashboard.svg";
import Chest from "../public/assets/logo/open-book.svg";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useEffect, useState } from "react";
import Sell from "../public/assets/logo/dollar-symbol.svg";
import { ethers } from "ethers";

function MyApp({ Component, pageProps }) {
  // Initiale state of the app
  const [initialState, setInitialState] = useState({
    userAdress: "",
    loged: false,
    networkId: "",
    amount: "",
  });

  function networkName(networkId) {
    switch (networkId) {
      case "0x1":
        return "Etherum";
      case "0x89":
        return "Matic";
      default:
        return "unknow";
    }
  }

  const providerOptions = {
    walletconnect: {
      options: {
        infuraId: "0bde4451fec140b0b6908eb541d38ea9",
      },
    },
  };

  async function walletConnect() {
    const web3Modal = new Web3Modal({
      network: "mumbai",
      cacheProvider: true,
      providerOptions,
    });

    const web32 = new Web3(
      new Web3.providers.HttpProvider(
        "https://mainnet.infura.io/v3/0bde4451fec140b0b6908eb541d38ea9"
      )
    );

    const connection = await web3Modal.connect();
    let account = web3.currentProvider.selectedAddress;

    let networkId = await window.ethereum.request({ method: "eth_chainId" });
    const startAdress = account.slice(0, 5);
    const endAdress = account.slice(-5);
    const shortAccount = `${startAdress}...${endAdress}`;

    web32.eth.getBalance(account, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        console.log(web32.utils.fromWei(result, "ether") + " ETH");
      }
    });
    setInitialState({
      ...initialState,
      userAdress: shortAccount,
      loged: true,
      networkId,
    });
  }

  useEffect(() => {
    walletConnect();
  }, [initialState.loged]);

  return (
    <div className=" font-roboto min-h-screen bg-bg-img  bg-no-repea bg-cover t bg-fixed no-re relative">
      <nav className="p-10 text-w flex justify-center text-1xl text-white items-center mb-6">
        <div className="mr-10 absolute top-6 left-6">
          <Image src={Logo} alt="logo" height={80} width={80} />
        </div>
        {initialState.userAdress ? (
          <div className="absolute top-10 right-6 flex justify-center items-center bg-blue p-2 rounded-xl">
            <p className="text-white font-bold rounded-xl mr-4 bg-white1 p-1 hover:bg-white5">
              {initialState.userAdress}
            </p>
            <p className="mr-4">{networkName(initialState.networkId)}</p>
            <button
              className="rounded-xl p-2 bg-white text-black"
              onClick={() => logout()}
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => walletConnect()}
            className="text-white bg-blue text-bold p-2 rounded-xl absolute top-10 right-6"
          >
            Connexion
          </button>
        )}
        <Link href="/">
          <a className="mr-12 flex items-center duration-200 hover:text-green">
            <div className="mr-3">
              <Image src={HomeLogo} alt="homepageLogo" height={40} width={40} />
            </div>
            Home
          </a>
        </Link>
        <Link href="/create-item">
          <a className="mr-12 flex items-center duration-200 hover:text-green">
            <div className="mr-3">
              <Image src={Sell} alt="homepageLogo" height={40} width={40} />
            </div>
            Sell Digital Asset
          </a>
        </Link>
        <Link href="/my-assets">
          <a className="mr-12 flex items-center duration-200 hover:text-green">
            {" "}
            <div className="mr-3">
              <Image src={Chest} alt="homepageLogo" height={40} width={40} />
            </div>
            My digital assets
          </a>
        </Link>
        <Link href="/creator-dashboard">
          <a className="flex items-center duration-200 hover:text-green">
            {" "}
            <div className="mr-3">
              <Image
                src={Dashboard}
                alt="Dashboard-Logo"
                height={40}
                width={40}
              />
            </div>
            Creator Dashboard
          </a>
        </Link>
      </nav>
      <Component {...pageProps} />
      <footer className="absolute bottom-0 flex-col items-center flex  w-full p-3 bg-white9 rounded-t-xl">
        <p className="mb-2 text-darkBlue">Création F.marc</p>
        <div className="flex">
          <div className="mr-6">
            <Image
              src="/../public/assets/logo/github.png"
              alt="git-hub-logo"
              height={50}
              width={50}
            />
          </div>
          <div>
            <Image
              src="/../public/assets/logo/linkedin.png"
              alt="git-hub-logo"
              height={50}
              width={50}
            />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MyApp;
