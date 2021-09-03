/* eslint-disable @next/next/no-img-element */
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import Web3Modal from "web3modal";
import LoadingLogo from "../public/assets/logo/circles.svg";
import Link from "next/link";
import Box from "../public/assets/logo/box.svg";

import { nftmarketaddress, nftaddress } from "../config";

import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([]);
  const [sold, setSold] = useState([]);
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
    const data = await marketContract.fetchItemsCreated();

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
          sold: i.sold,
          image: meta.data.image,
        };
        return item;
      })
    );
    /* create a filtered array of items that have been sold */
    const soldItems = items.filter((i) => i.sold);
    setSold(soldItems);
    setNfts(items);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <div className="flex flex-col justify-center items-center p-8 m-auto bg-white9 w-80 rounded-xl text-center">
        <h1 className="text-2xl font-bold text-black mb-4">No items created</h1>
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
    <div>
      <div className="p-4">
        <div className="flex justify-center">
          <h2 className="text-3xl mb-6 p-4 rounded-full align-middle bg-white inline-block  text-center text-blue border border-lightBlue">
            Items Created
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {nfts.map((nft, i) => (
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
                <p className="text-2xl font-bold">Price - {nft.price} Eth</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-4">
        {Boolean(sold.length) && (
          <div className="pb-36">
            <div className="flex justify-center">
              <h2 className="text-3xl mb-6 p-4 rounded-full align-middle bg-white inline-block  text-center text-blue border border-lightBlue">
                Items sold
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sold.map((nft, i) => (
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
                    <p className="text-2xl font-bold">
                      Price - {nft.price} Matic
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
