import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";
import Logo from "../public/assets/logo/shutter.svg";
import Image from "next/image";
import HomeLogo from "../public/assets/logo/homepage.svg";
import Dashboard from "../public/assets/logo/dashboard.svg";
import Chest from "../public/assets/logo/open-book.svg";
import LogoutLogo from "../public/assets/logo/swap.svg";
import Inline from "../public/assets/logo/rec.svg";
import Web3Modal from "web3modal";
import Web3 from "web3";
import { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Sell from "../public/assets/logo/dollar-symbol.svg";

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
  const router = useRouter();
  // Initiale state of the app
  const [initialState, setInitialState] = useState({
    userAdress: "",
    fullAddress: "",
    loged: false,
    networkId: "",
    networkName: "",
    balance: "",
  });

  useEffect(() => {
    getUserInfos();
  }, []);

  async function walletConnect() {
    await ethereum.request({ method: "eth_requestAccounts" });
    getUserInfos();
  }

  async function openModal() {
    const permissions = await ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
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

      // Auto switch network
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0x13881" }],
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (error.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x13881",
                  rpcUrl:
                    "https://polygon-mumbai.infura.io/v3/c2098e08d3b441f2b7c3b280520d8471",
                },
              ],
            });
          } catch (addError) {
            // handle "add" error
          }
        }
        // handle other "switch" errors
      }

      // Web3 GetBalance
      const web3 = new Web3(window.ethereum);
      let accounts = await web3.eth.getAccounts();
      let account = accounts[0];

      if (!account) {
        return null;
      }

      let balance = await web3.eth.getBalance(account);
      balance = web3.utils.fromWei(balance, "ether");
      balance = Number(balance);

      // On Chain Change
      ethereum.on("chainChanged", (chainId) => {
        window.location.reload();
      });

      // On chain Acount Change

      ethereum.on("accountsChanged", (accounts) => {
        window.location.reload();
      });

      // On connect
      ethereum.on("connect", (ConnectInfo) => {
        window.location.reload();
      });

      // ChainId
      const chainId = await ethereum.request({ method: "eth_chainId" });
      const chainName = networkName(chainId);
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
            fullAddress: address,
            balance: `${balance.toFixed(2)} Matic`,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  return (
    <div className=" font-roboto min-h-screen bg-bg-img  bg-no-repea bg-cover t bg-fixed no-re relative">
      <nav className="p-6  shadow-xl bg-blue4 text-w flex justify-left text-lg text-white items-center mb-6">
        <div className="mr-10">
          <Image src={Logo} alt="logo" height={70} width={70} />
        </div>
        {initialState.userAdress ? (
          <div className="absolute p-2  top-6 right-6 flex-col flex justify-center text-base items-center bg-white1 text-white rounded-xl shadow-lg">
            <div className="flex justify-center items-center">
              <p className="font-bold rounded-xl mr-4 p-1">
                {initialState.userAdress}
              </p>
              <div className="absolute top-2 right-2 cursor-pointe">
                <Image
                  src={LogoutLogo}
                  alt="logout-logo"
                  height={22}
                  width={22}
                  onClick={() => openModal()}
                />
              </div>
              <div className="absolute -top-1.5 -right-1.5">
                <Image src={Inline} alt="online-logo" height={15} width={15} />
              </div>
            </div>
            <div className="flex justify-center items-center">
              <p className="mr-4">{initialState.balance}</p>
              <p className="mr-4">{networkName(initialState.networkId)}</p>
            </div>
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
          <a
            className={
              router.pathname === "/"
                ? "mr-10 flex items-center duration-200 bg-white1 shadow-xl rounded-xl p-3"
                : "mr-10 flex items-center duration-200 hover:text-grey p-1"
            }
          >
            <div className="mr-3">
              <Image src={HomeLogo} alt="homepageLogo" height={35} width={35} />
            </div>
            Home
          </a>
        </Link>
        <Link href="/create-item">
          <a
            className={
              router.pathname === "/create-item"
                ? "mr-10 flex items-center duration-200 bg-white1 shadow-xl rounded-xl p-3"
                : "mr-10 flex items-center duration-200 hover:text-grey p-1"
            }
          >
            <div className="mr-3">
              <Image src={Sell} alt="homepageLogo" height={35} width={35} />
            </div>
            Sell Digital Asset
          </a>
        </Link>
        <Link href="/my-assets">
          <a
            className={
              router.pathname === "/my-assets"
                ? "mr-10 flex items-center duration-200 bg-white1 shadow-xl rounded-xl p-3"
                : "mr-10 flex items-center duration-200 hover:text-grey p-1"
            }
          >
            <div className="mr-3">
              <Image src={Chest} alt="homepageLogo" height={35} width={35} />
            </div>
            My digital assets
          </a>
        </Link>
        <Link href="/creator-dashboard">
          <a
            className={
              router.pathname === "/creator-dashboard"
                ? "mr-10 flex items-center duration-200 bg-white1 text-grey shadow-xl rounded-xl p-3"
                : "mr-10 flex items-center duration-200 hover:text-grey p-1"
            }
          >
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
