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
import detectEthereumProvider from "@metamask/detect-provider";
import Sell from "../public/assets/logo/dollar-symbol.svg";
import { ethers } from "ethers";

function networkName(networkId) {
  switch (networkId) {
    case "0x1":
      return "Etherum";
    case "0x89":
      return "Matic";
    case "0x13881":
      return "Mumbai";
    default:
      return "Wrong Network";
  }
}

function MyApp({ Component, pageProps }) {
  // Initiale state of the app
  const [initialState, setInitialState] = useState({
    userAdress: "",
    loged: false,
    networkId: "",
    networkName: "",
    balance: "",
  });

  useEffect(() => {
    getUserInfos();
  }, []);

  async function walletConnect() {
    ethereum.request({ method: "eth_requestAccounts" });
  }

  async function getUserInfos() {
    const provider = await detectEthereumProvider();

    if (provider) {
      startApp(provider); // Initialize your app
    } else {
      console.log("Please install MetaMask!");
    }

    async function startApp(provider) {
      // If the provider returned by detectEthereumProvider is not the same as
      // window.ethereum, something is overwriting it, perhaps another wallet.
      if (provider !== window.ethereum) {
        console.error("Do you have multiple wallets installed?");
      }

      // ChainId
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const chainName = networkName(chainId);
      console.log(chainId, chainName);
      setInitialState({
        ...initialState,
        networkId: chainId,
        networkName: chainName,
      });
      // UserAddress
      ethereum
        .request({ method: "eth_accounts" })
        .then((response) => {
          const address = response[0];
          const startAddress = address.slice(0, 5);
          const endAddress = address.slice(-5);
          const fullAddress = `${startAddress}...${endAddress}`;
          setInitialState({
            ...initialState,
            userAdress: fullAddress,
            networkId: chainId,
            networkName: chainName,
          });
        })
        .catch((err) => {
          console.error(err);
        });

      // UserBalance
    }
  }

  return (
    <div className=" font-roboto min-h-screen bg-bg-img  bg-no-repea bg-cover t bg-fixed no-re relative">
      <nav className="p-6  shadow-xl bg-blue4 text-w flex justify-left text-lg text-white items-center mb-6">
        <div className="mr-10">
          <Image src={Logo} alt="logo" height={70} width={70} />
        </div>
        {initialState.userAdress ? (
          <div className="absolute  top-10 right-6 flex justify-center text-base items-center bg-white text-black p-2 rounded-xl">
            <p className="text-black font-bold rounded-xl mr-4 bg-white1 p-1 duration-200 hover:bg-blue  hover:text-white cursor-pointer">
              {initialState.userAdress}
            </p>
            <p className="mr-4">{initialState.balance}</p>
            <p className="mr-4">{networkName(initialState.networkId)}</p>
          </div>
        ) : (
          <button
            onClick={() => walletConnect()}
            className="text-white  bg-blue text-bold p-2 rounded-xl absolute top-10 right-6"
          >
            Connexion
          </button>
        )}
        <Link href="/">
          <a className="mr-10 flex items-center duration-200 hover:text-green">
            <div className="mr-3">
              <Image src={HomeLogo} alt="homepageLogo" height={35} width={35} />
            </div>
            Home
          </a>
        </Link>
        <Link href="/create-item">
          <a className="mr-10 flex items-center duration-200 hover:text-green">
            <div className="mr-3">
              <Image src={Sell} alt="homepageLogo" height={35} width={35} />
            </div>
            Sell Digital Asset
          </a>
        </Link>
        <Link href="/my-assets">
          <a className="mr-10 flex items-center duration-200 hover:text-green">
            {" "}
            <div className="mr-3">
              <Image src={Chest} alt="homepageLogo" height={35} width={35} />
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
                height={35}
                width={35}
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
