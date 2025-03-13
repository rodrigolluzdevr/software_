"use client";
import React, { useState } from "react";
import Sidebar from "../.sidebar/Sidebar";
import Header from "../.header/Header";

export default function Wrapper(props: any) {
  let [toggle, setToggle] = useState(true);
  return (
    <div className={`page-wrapper  ${toggle ? "toggled" : ""}`}>
      <Sidebar />
      <main className="page-content bg-gray-50">
        <Header toggle={toggle} setToggle={setToggle} />
        {props.children}
      </main>
    </div>
  );
}
