const Token = artifacts.require("AionToken");

describe("AionToken contract", function() {
  let accounts;
  let token;

  before(async function() {
    accounts = await web3.eth.getAccounts();
    token = await Token.new(
      "Zora",
      "ZORA",
      0,
      accounts[0],
      20,
      50
    )
  });

  xit("mints tokens", async function() {
    // TODO
  })

  xit("burns tokens", async function() {
    // TODO
  })

  xit("cannot mint tokens over the supply cap", async function() {
    // TODO
  })
});
