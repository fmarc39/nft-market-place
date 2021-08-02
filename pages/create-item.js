import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { useState } from "react";
import Web3Modal from "web3modal";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { nftaddress, nftmarketaddress } from "../config";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const [uploadProg, setUploadProg] = useState(0);
  const router = useRouter();

  async function onChange(e) {
    const file = e.target.files[0];
    const fileSize = e.target.files[0].size;
    try {
      const added = await client.add(file, {
        progress: (prog) =>
          setUploadProg(Math.round(100 - ((fileSize - prog) / fileSize) * 100)),
      });

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  async function createMarket() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createSale(url) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
    let transaction = await contract.createToken(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();

    const price = ethers.utils.parseUnits(formInput.price, "ether");

    /* then list the item for sale on the marketplace */
    contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    });
    await transaction.wait();
    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex  flex-col pb-12 bg-white5 p-4 rounded-2xl">
        <input
          placeholder="Asset Name"
          className="mt-8 rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Matic"
          className="mt-2 rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input
          type="file"
          name="Asset"
          className="my-4 rounded"
          onChange={onChange}
        />

        {uploadProg !== 100 && (
          <div className="transition-all ease-out duration-1000">
            {uploadProg !== 0 && (
              <div className="h-5 w-full bg-white rounded-lg">
                <div
                  style={{ width: `${uploadProg}%` }}
                  className={`h-full ${
                    uploadProg < 70
                      ? "bg-red rounded-lg transition-all ease-out duration-1000"
                      : "bg-green rounded-lg transition-all ease-out duration-1000"
                  }`}
                >
                  {uploadProg > 5 && (
                    <p className="text-center">{uploadProg} %</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {fileUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded mt-4 align-middle m-auto"
            width="350"
            src={fileUrl}
            alt="img"
          />
        )}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-blue text-white text-lg rounded p-4 shadow-lg duration-200 hover:bg-green"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  );
}
