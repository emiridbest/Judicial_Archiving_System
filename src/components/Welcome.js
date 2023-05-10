import React from "react";

const Welcome = ({ connectToWallet, currentAccount }) => {
  return (
    <div>
      <div className="welcome">
        <h1 className="">
          Retrieve all the Documents <br />
          You Ever Wanted
        </h1>
        <p className="">Explore The World Of Decentralized Judicial Archives</p>
      </div>
      <div className="connect">
        {!currentAccount && (
          <button type="button" onClick={connectToWallet}>
            <p className="button"> Connect Wallet</p>
          </button>
        )}
      </div>
    </div>
  );
};

export default Welcome;
