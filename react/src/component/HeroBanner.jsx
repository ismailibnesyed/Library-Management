import React from "react";

const HeroBanner = () => {
  return (
    <div
      className="hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Your Library, Organized Smarter</h1>
          <p className="mb-5">
            Manage books, members, borrowing, and returns effortlessly—all from one simple, reliable platform.
          </p>
          <button className="btn btn-primary cursor-pointer">Get Started</button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
