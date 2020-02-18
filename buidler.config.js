usePlugin("@nomiclabs/buidler-truffle5");

// This is a sample Buidler task. To learn how to create your own go to
// https://buidler.dev/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await web3.eth.getAccounts();

  for (const account of accounts) {
    console.log(account);
  }
});

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    ropsten: {
      url: "https://ropsten.infura.io/v3/96efbe9ad6f94f918aad2c894302c94e",
      chainId: 3,
      accounts:
        process.env.PRIVATE_KEY
          ? [process.env.PRIVATE_KEY]
          : "remote"
    }
  }
};
