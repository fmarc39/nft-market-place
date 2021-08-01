import "../styles/globals.css";
import Link from "next/link";
import Logo from "../public/assets/logo/shutter.svg";
import Image from "next/image";
import HomeLogo from "../public/assets/logo/homepage.svg";
import Dashboard from "../public/assets/logo/dashboard.svg";
import Chest from "../public/assets/logo/open-book.svg";
import Sell from "../public/assets/logo/dollar-symbol.svg";

function MyApp({ Component, pageProps }) {
  return (
    <div className=" font-roboto min-h-screen bg-bg-img  bg-no-repea bg-cover t bg-fixed no-re relative">
      <nav className="p-10 text-w flex justify-center text-2xl text-white items-center">
        <div className="mr-10 absolute top-6 left-6">
          <Image src={Logo} alt="logo" height={80} width={80} />
          <h1 className="text-center">NFTof</h1>
        </div>
        <Link href="/">
          <a className="mr-12 flex items-center">
            <div className="mr-3">
              <Image src={HomeLogo} alt="homepageLogo" height={40} width={40} />
            </div>
            Home
          </a>
        </Link>
        <Link href="/create-item">
          <a className="mr-12 flex items-center ">
            <div className="mr-3">
              <Image src={Sell} alt="homepageLogo" height={40} width={40} />
            </div>
            Sell Digital Asset
          </a>
        </Link>
        <Link href="/my-assets">
          <a className="mr-12 flex items-center">
            {" "}
            <div className="mr-3">
              <Image src={Chest} alt="homepageLogo" height={40} width={40} />
            </div>
            My digital assets
          </a>
        </Link>
        <Link href="/creator-dashboard">
          <a className="flex items-center">
            {" "}
            <div className="mr-3">
              <Image
                src={Dashboard}
                alt="Dashboard-Logo"
                height={40}
                width={40}
              />
            </div>
            Creator Dashboard
          </a>
        </Link>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
