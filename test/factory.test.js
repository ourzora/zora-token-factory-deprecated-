const TokenFactory = artifacts.require("TokenFactory");

describe("TokenFactory contract", function() {
  let accounts;

  before(async function() {
    accounts = await web3.eth.getAccounts();
  });

  it("deploys", async function() {
    const tokenFactory = await TokenFactory.new();
    assert.isNotNull(tokenFactory.address);
  });

  // TODO: Add more tests
  // - Mint
  // - Burn
  // - Max supply
  // - Unique symbols

});
