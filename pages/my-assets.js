/* eslint-disable @next/next/no-img-element */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import Image from "next/image";
import LoadingLogo from "../public/assets/logo/circles.svg";
import Link from "next/link";
import Box from "../public/assets/logo/box.svg";
import { nftmarketaddress, nftaddress } from "../config";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer
    );
    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider);
    const data = await marketContract.fetchMyNFTs();

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
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <div className="flex flex-col justify-center items-center p-8 m-auto bg-white9 w-80 rounded-xl text-center">
        <h1 className="text-2xl font-bold text-black mb-4">No items owns</h1>
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
  return (
    <div className="flex justify-center">
      <div className="p-4 mb-32">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          {nfts.map((nft, i) => {
            <div key={i} className="shadow rounded-xl overflow-hidden">
              <div className="relative -mb-2 cursor-pointer">
                <Image
                  placeholder="blur"
                  blurDataURL={nft.image}
                  src={nft.image}
                  alt={nft.name}
                  height={800}
                  width={600}
                  quality={40}
                  objectFit="cover"
                />
              </div>
              <div className="p-4 bg-white">
                <p className="text-2xl font-bold">Price - {nft.price} Matic</p>
              </div>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}
