import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import {
  AiOutlineAppstore,
  AiOutlineCamera,
  AiOutlineFile,
  AiOutlineLineChart,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { PiBrowsersBold } from "react-icons/pi";
import { TbBrandBlogger } from "react-icons/tb";
import { MdOutlineEmail } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { BiLayer, BiLogOutCircle } from "react-icons/bi";

export default function Sidebar() {
  let [manu, setManu] = useState("");
  let [subManu, setSubManu] = useState("");
  let pathname = usePathname();

  useEffect(() => {
    setManu(pathname);
    setSubManu(pathname);
    window.scrollTo(0, 0);
  }, [setManu, setSubManu]);

  return (
    <nav className="sidebar-wrapper sidebar-dark">
      <div className=" sidebar-content">
        <div className="sidebar-brand">
          <Link href="/">
            <Image
              src="/images/logo-light.png"
              placeholder="blur"
              blurDataURL="/images/logo-light.png"
              width={138}
              height="24"
              alt=""
            />
          </Link>
        </div>
        <SimpleBarReact style={{ height: "calc(100% - 70px)" }}>
          <ul className="sidebar-menu border-t border-white/10">
            <li
              className={`sidebar-dropdown ${
                ["", "/", "/index-crypto", "/index-ecommerce"].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(
                    subManu === "dashboard-item" ? "" : "dashboard-item"
                  );
                }}
              >
                <AiOutlineLineChart className=" me-3 icon " />
                Dashboard
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/",
                    "/index-crypto",
                    "/dashboard-item",
                    "/index-ecommerce",
                    "",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/" || "" ? "active" : ""}>
                    <Link href="/">Analytics</Link>
                  </li>
                  <li className={manu === "/index-crypto" ? "active" : ""}>
                    <Link href="/index-crypto">Cryptocurrency </Link>
                  </li>
                  <li className={manu === "/index-ecommerce" ? "active" : ""}>
                    <Link href="/index-ecommerce">eCommerce</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "/index-dark",
                  "/index-rtl",
                  "/index-dark-rtl",
                  "/index-sidebar-light",
                  "/index-sidebar-colored",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(subManu === "/index-item" ? "" : "/index-item");
                }}
              >
                <PiBrowsersBold className=" me-3 icon " />
                Layouts
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/index-dark",
                    "/index-rtl",
                    "/index-dark-rtl",
                    "/index-sidebar-light",
                    "/index-sidebar-colored",
                    "/index-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/index-dark" ? "active" : ""}>
                    <Link href="/index-dark">Dark Dashboard</Link>
                  </li>
                  <li className={manu === "/index-rtl" ? "active" : ""}>
                    <Link href="/index-rtl">RTL Dashboard</Link>
                  </li>
                  <li className={manu === "/index-dark-rtl" ? "active" : ""}>
                    <Link href="/index-dark-rtl">Dark RTL Dashboard</Link>
                  </li>
                  <li
                    className={manu === "/index-sidebar-light" ? "active" : ""}
                  >
                    <Link href="/index-sidebar-light">Light Sidebar</Link>
                  </li>
                  <li
                    className={
                      manu === "/index-sidebar-colored" ? "active" : ""
                    }
                  >
                    <Link href="/index-sidebar-colored">Colored Sidebar</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["/chat", "/email", "/calendar"].includes(manu) ? "active" : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(subManu === "/app-item" ? "" : "/app-item");
                }}
              >
                <AiOutlineAppstore className=" me-3 icon " />
                Apps
              </Link>
              <div
                className={`sidebar-submenu ${
                  ["/chat", "/email", "/calendar", "/app-item"].includes(
                    subManu
                  )
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/chat" ? "active" : ""}>
                    <Link href="/chat">Chat</Link>
                  </li>
                  <li className={manu === "/email" ? "active" : ""}>
                    <Link href="/email">Email</Link>
                  </li>
                  <li className={manu === "/calendar" ? "active" : ""}>
                    <Link href="/calendar">Calendar</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "/profile",
                  "/profile-billing",
                  "/profile-payment",
                  "/profile-social",
                  "/profile-notification",
                  "/profile-setting",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(
                    subManu === "/profile-item" ? "" : "/profile-item"
                  );
                }}
              >
                <AiOutlineUser className=" me-3 icon " />
                User Profile
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/profile",
                    "/profile-billing",
                    "/profile-payment",
                    "/profile-social",
                    "/profile-notification",
                    "/profile-setting",
                    "/profile-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/profile" ? "active" : ""}>
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className={manu === "/profile-billing" ? "active" : ""}>
                    <Link href="/profile-billing">Billing Info</Link>
                  </li>
                  <li className={manu === "/profile-payment" ? "active" : ""}>
                    <Link href="/profile-payment">Payment</Link>
                  </li>
                  <li className={manu === "/profile-social" ? "active" : ""}>
                    <Link href="/profile-social">Social Profile</Link>
                  </li>
                  <li
                    className={manu === "/profile-notification" ? "active" : ""}
                  >
                    <Link href="/profile-notification">Notifications</Link>
                  </li>
                  <li className={manu === "/profile-setting" ? "active" : ""}>
                    <Link href="/profile-setting">Profile Settings</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["/blog", "/blog-detail"].includes(manu) ? "active" : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(subManu === "/blog-item" ? "" : "/blog-item");
                }}
              >
                <TbBrandBlogger className=" me-3 icon " />
                Blog
              </Link>
              <div
                className={`sidebar-submenu ${
                  ["/blog", "/blog-detail", "/blog-item"].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/blog" ? "active" : ""}>
                    <Link href="/blog">Blogs</Link>
                  </li>
                  <li className={manu === "/blog-detail" ? "active" : ""}>
                    <Link href="/blog-detail">Blog Detail</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "/shop",
                  "/shop-item-detail",
                  "/shop-cart",
                  "/checkout",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(subManu === "/shop-item" ? "" : "/shop-item");
                }}
              >
                <AiOutlineShoppingCart className="me-3 icon" />
                E-Commerce
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/shop",
                    "/shop-item-detail",
                    "/shop-cart",
                    "/checkout",
                    "/shop-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/shop" ? "active" : ""}>
                    <Link href="/shop">Shop</Link>
                  </li>
                  <li className={manu === "/shop-item-detail" ? "active" : ""}>
                    <Link href="/shop-item-detail">Shop Detail</Link>
                  </li>
                  <li className={manu === "/shop-cart" ? "active" : ""}>
                    <Link href="/shop-cart">Shopcart</Link>
                  </li>
                  <li className={manu === "/checkout" ? "active" : ""}>
                    <Link href="/checkout">Checkout</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["/gallery-one", "/gallery-two"].includes(manu) ? "active" : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(
                    subManu === "/gallery-item" ? "" : "/gallery-item"
                  );
                }}
              >
                <AiOutlineCamera className="me-3 icon" />
                Gallery
              </Link>
              <div
                className={`sidebar-submenu ${
                  ["/gallery-one", "/gallery-two", "/gallery-item"].includes(
                    subManu
                  )
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/gallery-one" ? "active" : ""}>
                    <Link href="/gallery-one">Gallary One</Link>
                  </li>
                  <li className={manu === "/gallery-two" ? "active" : ""}>
                    <Link href="/gallery-two">Gallery Two</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "/starter",
                  "/faqs",
                  "/pricing",
                  "/team",
                  "/privacy",
                  "/terms",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(subManu === "/page-item" ? "" : "/page-item");
                }}
              >
                <AiOutlineFile className="me-3 icon" />
                Pages
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/starter",
                    "/faqs",
                    "/pricing",
                    "/team",
                    "/privacy",
                    "/terms",
                    "/page-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/starter" ? "active" : ""}>
                    <Link href="/starter">Starter</Link>
                  </li>
                  <li className={manu === "/faqs" ? "active" : ""}>
                    <Link href="/faqs">FAQs</Link>
                  </li>
                  <li className={manu === "/pricing" ? "active" : ""}>
                    <Link href="/pricing">Pricing</Link>
                  </li>
                  <li className={manu === "/team" ? "active" : ""}>
                    <Link href="/team">Team</Link>
                  </li>
                  <li className={manu === "/privacy" ? "active" : ""}>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li className={manu === "/terms" ? "active" : ""}>
                    <Link href="/terms">Term & Condition</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className={manu === "/ui-components" ? "active" : ""}>
              <Link href="/ui-components">
                <AiOutlineLineChart className=" me-3 icon " />
                UI Components
              </Link>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "/email-confirmation",
                  "/email-password-reset",
                  "/email-alert",
                  "/email-invoices",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(subManu === "/mail-item" ? "" : "/mail-item");
                }}
              >
                <MdOutlineEmail className=" me-3 icon " />
                Email Template
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/email-confirmation",
                    "/email-password-reset",
                    "/email-alert",
                    "/email-invoices",
                    "/mail-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li
                    className={manu === "/email-confirmation" ? "active" : ""}
                  >
                    <Link href="/email-confirmation">Confirmation</Link>
                  </li>
                  <li
                    className={manu === "/email-password-reset" ? "active" : ""}
                  >
                    <Link href="/email-password-reset">Reset Password</Link>
                  </li>
                  <li className={manu === "/email-alert" ? "active" : ""}>
                    <Link href="/email-alert">Alert</Link>
                  </li>
                  <li className={manu === "/email-invoices" ? "active" : ""}>
                    <Link href="/email-invoices">Invoice</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["/invoice-list", "/invoice"].includes(manu) ? "active" : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(
                    subManu === "/invoice-item" ? "" : "/invoice-item"
                  );
                }}
              >
                <LiaFileInvoiceDollarSolid className=" me-3 icon " />
                Invoice
              </Link>
              <div
                className={`sidebar-submenu ${
                  ["/invoice-list", "/invoice", "/invoice-item"].includes(
                    subManu
                  )
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/invoice-list" ? "active" : ""}>
                    <Link href="/invoice-list">Invoice List</Link>
                  </li>
                  <li className={manu === "/invoice" ? "active" : ""}>
                    <Link href="/invoice">Invoice Preview</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                [
                  "/auth-login",
                  "/auth-signup",
                  "/auth-signup-success",
                  "/auth-re-password",
                  "/auth-lock-screen",
                ].includes(manu)
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(subManu === "/auth-item" ? "" : "/auth-item");
                }}
              >
                <BiLogOutCircle className="me-3 icon" />
                Authentication
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/auth-login",
                    "/auth-signup",
                    "/auth-signup-success",
                    "/auth-re-password",
                    "/auth-lock-screen",
                    "/auth-item",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/auth-login" ? "active" : ""}>
                    <Link href="/auth-login">Login</Link>
                  </li>
                  <li className={manu === "/auth-signup" ? "active" : ""}>
                    <Link href="/auth-signup">Signup</Link>
                  </li>
                  <li
                    className={manu === "/auth-signup-success" ? "active" : ""}
                  >
                    <Link href="/auth-signup-success">Signup Success</Link>
                  </li>
                  <li className={manu === "/auth-re-password" ? "active" : ""}>
                    <Link href="/auth-re-password">Reset Password</Link>
                  </li>
                  <li className={manu === "/auth-lock-screen" ? "active" : ""}>
                    <Link href="/auth-lock-screen">Lockscreen</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li
              className={`sidebar-dropdown ${
                ["/comingsoon", "/maintenance", "/error", "/thankyou"].includes(
                  manu
                )
                  ? "active"
                  : ""
              }`}
            >
              <Link
                href="#"
                onClick={(e) => {
                  setSubManu(
                    subManu === "/special-page" ? "" : "/special-page"
                  );
                }}
              >
                <BiLayer className="me-3 icon" />
                Miscellaneous
              </Link>
              <div
                className={`sidebar-submenu ${
                  [
                    "/comingsoon",
                    "/maintenance",
                    "/error",
                    "/thankyou",
                    "/special-page",
                  ].includes(subManu)
                    ? "block"
                    : ""
                }`}
              >
                <ul>
                  <li className={manu === "/comingsoon" ? "active" : ""}>
                    <Link href="/comingsoon">Comingsoon</Link>
                  </li>
                  <li className={manu === "/maintenance" ? "active" : ""}>
                    <Link href="/maintenance">Maintenance</Link>
                  </li>
                  <li className={manu === "/error" ? "active" : ""}>
                    <Link href="/error">Error</Link>
                  </li>
                  <li className={manu === "/thankyou" ? "active" : ""}>
                    <Link href="/thankyou">Thank You</Link>
                  </li>
                </ul>
              </div>
            </li>

            <li className="relative lg:m-8 m-6 px-8 py-10 rounded-lg bg-gradient-to-b to-transparent from-slate-800 text-center">
              <span className="relative z-10">
                <span className="text-xl font-bold h5 text-white">
                  Upgrade to Pro
                </span>

                <span className="text-slate-400 mt-3 mb-5 block">
                  Get one month free and subscribe to pro
                </span>

                <Link
                  href="https://1.envato.market/techwind-next"
                  target="_blank"
                  className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle transition duration-500 ease-in-out text-base text-center bg-gray-500/5 hover:bg-gray-500 border-gray-500/10 hover:border-gray-500 text-white rounded-md"
                >
                  Subscribe
                </Link>
              </span>

              <Image
                src="/images/shree-276.png"
                width={40}
                height={40}
                className=" absolute top-1/2 -translate-y-1/2 start-0 end-0 mx-auto text-center h-40 w-40 z-0 opacity-5"
                alt=""
              />
            </li>
          </ul>
        </SimpleBarReact>
      </div>
    </nav>
  );
}
