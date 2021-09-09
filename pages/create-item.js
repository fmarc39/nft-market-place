import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { useState } from "react";
import Web3Modal from "web3modal";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import LoadingLogo from "../public/assets/logo/circles.svg";
import { nftaddress, nftmarketaddress } from "../config";
import Complete from "../public/assets/logo/checked.svg";
import Loader from "../public/assets/logo/Double Ring-1s-200px (1).svg";
import Image from "next/image";
import TxModal from "./tx-modal";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [modal, setModal] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [txDescription, setTxDescription] = useState("");
  const [txHash, setTxHash] = useState("");
  const [logo, setLogo] = useState(LoadingLogo);
  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
    creator: "",
    type: "Abstract",
  });
  const [uploadProg, setUploadProg] = useState(0);
  const router = useRouter();

  async function onChange(e) {
    setUploadStatus(true);
    const file = e.target.files[0];
    const fileSize = e.target.files[0].size;
    try {
      const added = await client.add(file, {
        progress: (prog) =>
          setUploadProg(Math.round(100 - ((fileSize - prog) / fileSize) * 100)),
      });

      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
      setTimeout(() => {
        setUploadStatus(false);
        window.scrollTo(0, document.body.scrollHeight);
      }, 3000);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setUploadStatus(false);
    }
  }
  async function createMarket() {
    const { name, description, price, type, creator } = formInput;
    if (!name || !description || !price || !fileUrl || !type) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      type,
      creator,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
      setUploadStatus(false);
    }
  }

  async function createSale(url) {
    setUploadStatus(true);
    try {
      const web3Modal = new Web3Modal();
      const connection = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connection);
      const signer = provider.getSigner();

      /* next, create the item */
      let contract = new ethers.Contract(nftaddress, NFT.abi, signer);
      let transaction = await contract.createToken(url);
      setTxDescription("Photo in the process of creation");
      setModal(true);
      setTxHash(transaction.hash);
      let tx = await transaction.wait();
      let event = tx.events[0];
      let value = event.args[2];
      let tokenId = value.toNumber();
      const price = ethers.utils.parseUnits(formInput.price, "ether");
      /* then list the item for sale on the marketplace */
      contract = new ethers.Contract(nftmarketaddress, Market.abi, signer);
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      setLogo(Complete);
      setTxDescription("Success");
      setTimeout(() => {
        setModal(false);
        setTxDescription("");
        setLogo(LoadingLogo);
      }, 2000);

      transaction = await contract.createMarketItem(
        nftaddress,
        tokenId,
        price,
        {
          value: listingPrice,
        }
      );
      setTxHash(transaction.hash);
      setTxDescription("Photo in the process of listing on the market");
      setModal(true);

      await transaction.wait();
      setUploadStatus(false);
      setLogo(Complete);
      setTxDescription("Success");
      setTimeout(() => {
        setModal(false);
        setTxHash("");
        setLogo(LoadingLogo);
      }, 2500);
      router.push("/");
    } catch (error) {
      console.log(error);
      setUploadStatus(false);
      setModal(false);
      setTxDescription("");
      setLogo(LoadingLogo);
    }
  }

  if (modal)
    return (
      <TxModal
        txHash={txHash}
        setModal={setModal}
        txDescription={txDescription}
        logo={logo}
      />
    );

  return (
    <div className="flex justify-center duration-200">
      <div className="w-1/2 flex  flex-col pb-12 bg-white5 p-4 rounded-2xl mb-32">
        <input
          placeholder="Photo Name *"
          className="mt-8 rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Photo Description *"
          className="mt-2 rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Creator Name"
          className="mt-2 rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, creator: e.target.value })
          }
        />
        <input
          placeholder="Photo Price in Matic *"
          type="number"
          required="required"
          className="mt-2 rounded p-4 mb-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />

        <label
          className="mb-4 bg-blue text-white shadow-xl p-2 inline-block w-38 m-auto rounded-xl text-left"
          htmlFor="type"
        >
          Choose a type of photo
        </label>
        <div className="inline-block relative mb-4">
          <select
            onChange={(e) =>
              updateFormInput({ ...formInput, type: e.target.value })
            }
            id="type"
            className="block appearance-none w-full bg-white  hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
          >
            <option>Abstract</option>
            <option>Aerial</option>
            <option>Annimals</option>
            <option>Architecture</option>
            <option>Astrophotography</option>
            <option>Culinary</option>
            <option>Landscapes</option>
            <option>Street</option>
            <option>Other</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <div className="m-auto mb-4">
          <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-xl shadow-lg tracking-wide uppercase cursor-pointer duration-200 hover:bg-blue hover:text-white">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">Select a file</span>
            <input
              type="file"
              className="hidden"
              name="Asset"
              onChange={onChange}
            />
          </label>
        </div>

        {uploadProg !== 100 && (
          <div className="transition-all ease-out duration-1000">
            {uploadProg !== 0 && (
              <div className="h-3 w-full bg-white rounded-lg">
                <div
                  style={{ width: `${uploadProg}%` }}
                  className={`h-full ${
                    uploadProg < 70
                      ? "bg-red rounded-lg transition-all ease-out duration-1000"
                      : "bg-green rounded-lg transition-all ease-out duration-1000"
                  }`}
                ></div>
              </div>
            )}
          </div>
        )}
        {fileUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="rounded mt-4 align-middle m-auto duration-200"
            width="350"
            src={fileUrl}
            alt="img"
          />
        )}
        {uploadStatus ? (
          <button className="h-20 font-bold mt-4 bg-blue text-white text-lg rounded p-4 shadow-lg ">
            <Image src={Loader} alt="loader" height="50px" width="50px" />
          </button>
        ) : (
          <button
            onClick={createMarket}
            className="h-20 font-bold mt-4 bg-blue text-white text-lg rounded p-4 shadow-lg duration-200 hover:bg-green"
          >
            Create digital assest
          </button>
        )}
      </div>
    </div>
  );
}
