import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import Image from "next/image";
import LoadingLogo from "../public/assets/logo/circles.svg";

import { nftmarketaddress, nftaddress } from "../config";

import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";

export default function ItemPage() {
  const [nft, setNft] = useState();
  const [imageSize, setImageSize] = useState({ height: 0, width: 0 });
  const router = useRouter();
  const [loadPhoto, setLoadPhoto] = useState(false);
  useEffect(() => {
    loadNFTs();
  }, []);

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
    const { tokenId } = router.query;

    let item = await Promise.all(
      data.map(async (i) => {
        if (Number(i.tokenId) === Number(tokenId)) {
          const tokenUri = await tokenContract.tokenURI(i.tokenId);
          const meta = await axios.get(tokenUri);
          let price = ethers.utils.formatUnits(i.price.toString(), "ether");
          item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.data.image,
            name: meta.data.name,
            type: meta.data.type,
            description: meta.data.description,
          };
          setNft(item);
          setLoadPhoto(true);
        }
      })
    );
  }

  if (loadPhoto == false)
    return (
      <div className="flex justify-center items-center h-screen">
        <Image src={LoadingLogo} alt="loading-logo" height={150} width={150} />
      </div>
    );

  return (
    <div
      className="pb-24 mr-auto ml-auto  flex justify-center"
      style={{ maxWidth: "80%" }}
    >
      {nft && (
        <div className="overflow-hidden mb-8 relative rounded-md shadow-xl">
          <Image
            src={nft.image}
            alt={nft.name}
            height={1000}
            width={1000}
            quality={100}
            onLoad={(img) => console.log(img.target)}
          />

          <div className="p-4 bg-white9 -mt-2">
            <p
              style={{ height: "64px" }}
              className="text-5xl font-semibold text-center"
            >
              {nft.name}
            </p>

            <div style={{ height: "70px", overflow: "hidden" }}>
              <p className="text-gray-400">{nft.description}</p>
            </div>
          </div>
          <div className="p-4 bg-white">
            <p className="text-3xl mb-4 font-bold text-black">
              {nft.price} Matic
            </p>
            <button
              className="w-full bg-blue text-white text-2xl font-bold py-2 px-12 rounded duration-200 hover:bg-green"
              onClick={() => buyNft(nft)}
            >
              Buy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
