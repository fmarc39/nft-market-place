import "../styles/globals.css";
import Link from "next/link";
import Logo from "../public/assets/logo/shutter.svg";
import Image from "next/image";

function MyApp({ Component, pageProps }) {
  return (
    <div className="font-roboto min-h-screen bg-bg-img bg-fixed relative">
      <div className="top-0 left-0 flex flex-col p-4">
        <Image src={Logo} alt="logo" height={100} />
        <h1 className="text-4xl text-center font-bold mt-4  text-white">
          NfTof
        </h1>
      </div>
      <nav className="p-6 text-w flex justify-around">
        <div className="flex justify-center mt-4 text-white">
          <Link href="/">
            <a className="mr-6 text-500 text-2xl">Home</a>
          </Link>
          <Link href="/create-item">
            <a className="mr-6 text-500 text-2xl">Sell Digital Asset</a>
          </Link>
          <Link href="/my-assets">
            <a className="mr-6 text-500 text-2xl">My digital assets</a>
          </Link>
          <Link href="/creator-dashboard">
            <a className="mr-6 text-500 text-2xl">Creator Dashboard</a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
