/* eslint-disable @next/next/no-img-element */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import LoadingLogo from "../public/assets/logo/Blocks-1s-200px.svg";
import Image from "next/image";
import Box from "../public/assets/logo/box.svg";
import Link from "next/link";

import { nftaddress, nftmarketaddress } from "../config";

import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [loadPhoto, setLoadPhoto] = useState(false);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.infura.io/v3/c2098e08d3b441f2b7c3b280520d8471"
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
        };
        console.log(item);
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
    await transaction.wait();
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
        <Link href="/create-item">
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
        <Image src={LoadingLogo} alt="loading-logo" height={200} width={200} />
      </div>
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
            console.log(color);
            return (
              <div key={i} className="rounded-xl overflow-hidden mb-8 relative">
                {
                  <img
                    src={nft.image}
                    alt={nft.name}
                    async
                    lazy="true"
                    onLoad={() => {
                      setLoadPhoto(true);
                    }}
                    className={
                      loadPhoto
                        ? "transform transition duration-500 hover:scale-105 cursor-pointer"
                        : "hidden"
                    }
                  />
                }

                <div className="p-4 bg-white9">
                  <p
                    style={{ height: "64px" }}
                    className="text-2xl font-semibold text-center"
                  >
                    {nft.name}
                  </p>

                  <p
                    className={`absolute top-2 right-2 text-white text-sm inline-block bg-${color} p-2 shadow-lg rounded-2xl font-semibold`}
                  >
                    {nft.type}
                  </p>

                  <div style={{ height: "70px", overflow: "hidden" }}>
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
