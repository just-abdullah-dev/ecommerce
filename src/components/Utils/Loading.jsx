import React from "react";

export default function Loading() {
  return (
    <main className=" grid place-items-center">
      {/* <div
      className=" w-full h-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: "url(/signin/logoback.png)" }}
    > */}
      <img
        src="/signin/logo.png"
        alt="Sign In"
        className=" animate-pulse scale-[.65]"
      />
      {/* </div> */}
    </main>
  );
}
