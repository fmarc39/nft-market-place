/* eslint-disable @next/next/no-img-element */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import LoadingLogo from "../public/assets/logo/circles.svg";
import Complete from "../public/assets/logo/checked.svg";
import CreatorImg from "../public/assets/logo/photographer.svg";
import Image from "next/image";
import Box from "../public/assets/logo/box.svg";
import Link from "next/link";
import { nftaddress, nftmarketaddress } from "../config";
import { InView } from "react-intersection-observer";
import TxModal from "./tx-modal";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home() {
  // App original state
  const [nfts, setNfts] = useState([]);
  const [logo, setLogo] = useState(LoadingLogo);
  const [txDescription, setTxDescription] = useState("Purchase in progress");
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [modal, setModal] = useState(false);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    loadNFTs();
  }, []);

  // Seuil de déclanchement de l'intersection observer
  const threshold = 0.2;

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.infura.io/v3/03ada784b69c47db8a77959223e5e301"
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await tokenContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          type: meta.data.type,
          description: meta.data.description,
          creator: meta.data.creator,
          height: meta.data.height,
          width: meta.data.width,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(
      nftaddress,
      nft.tokenId,
      {
        value: price,
      }
    );
    setTxHash(transaction.hash);
    setModal(true);
    await transaction.wait();
    setLogo(Complete);
    setTxDescription("Success");
    setTimeout(() => {
      setModal(false);
      setLogo(LoadingLogo);
      setTxDescription("Purchase in progress");
    }, 3000);

    loadNFTs();
  }

  function tagColors(tagName) {
    switch (tagName) {
      case "Annimals":
        return "annimals";
      case "Abstract":
        return "abstract";
      case "Aerial":
        return "aerial";
      case "Architecture":
        return "architecture";
      case "Astrophotography":
        return "astrophotography";
      case "Culinary":
        return "culinary";
      case "Landscapes":
        return "landscapes";
      case "Street":
        return "street  ";
      default:
        return "blue";
    }
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <div className="flex flex-col justify-center items-center p-8 m-auto bg-white9 w-80 rounded-xl text-center">
        <h1 className="text-2xl font-bold text-black mb-4">
          No items in marketplace
        </h1>
        <Link passHref href="/create-item">
          <button className="font-bold mt-4 bg-blue text-white text-lg rounded p-4 shadow-lg duration-200 hover:bg-green mb-4">
            Create an Nft
          </button>
        </Link>
        <Image src={Box} alt="box-logo" height={150} width={150} />
      </div>
    );
  if (loadingState === "not-loaded")
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src={LoadingLogo} alt="loading-logo" height={150} width={150} />
      </div>
    );

  if (modal)
    return (
      <TxModal
        txHash={txHash}
        setModal={setModal}
        logo={logo}
        txDescription={txDescription}
      />
    );
  return (
    <div className="flex flex-col justify-center">
      <div
        className="px-4 mb- flex justify-evenly"
        style={{ maxWidth: "1600px" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4  gap-4 pt-4 mb-32">
          {nfts.map((nft, i) => {
            const color = tagColors(nft.type);
            console.log(nft);
            return (
              <InView key={i} triggerOnce={true} threshold={threshold}>
                {({ inView, ref }) => (
                  <div
                    key={i}
                    ref={ref}
                    className={
                      inView
                        ? "overflow-hidden mb-8 duration-500 relative rounded-t-xl translate-y-0 opacity-100"
                        : "transition transform duration-500 opacity-0 translate-y-12"
                    }
                  >
                    {
                      // eslint-disable-next-line @next/next/link-passhref
                      <Link
                        href={{
                          pathname: "/item-page",
                          query: { tokenId: nft.tokenId },
                        }}
                      >
                        <div className="relative -mb-2 cursor-pointer">
                          <Image
                            placeholder="blur"
                            blurDataURL={nft.image}
                            src={nft.image}
                            alt={nft.name}
                            height={1100}
                            width={1500}
                            quality={40}
                            objectFit="cover"
                          />
                          <div className="absolute bottom-4 left-2 shadow-xl bg-white9 text-black flex justify-center flex-col p-1 rounded-lg border border-white">
                            <Image
                              src={CreatorImg}
                              alt="creator-log"
                              height={20}
                              width={20}
                            />
                            <p className="text-xs">{nft.creator}</p>
                          </div>
                        </div>
                      </Link>
                    }

                    <div className="p-4 bg-white9">
                      <p
                        style={{ height: "64px" }}
                        className="text-2xl font-semibold text-center"
                      >
                        {nft.name}
                      </p>

                      <p
                        className={`absolute top-2 right-2 text-white text-sm inline-block bg-${color} p-2 shadow-2xl rounded-2xl font-semibold`}
                      >
                        {nft.type}
                      </p>

                      <div style={{ minHeight: "40px", overflow: "hidden" }}>
                        <p className="text-gray-400">{nft.description}</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <p className="text-2xl mb-4 font-bold text-black">
                        {nft.price} Matic
                      </p>
                      <button
                        className="w-full bg-blue text-white font-bold py-2 px-12 rounded duration-200 hover:bg-green"
                        onClick={() => buyNft(nft)}
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                )}
              </InView>
            );
          })}
        </div>
      </div>
    </div>
  );
}
