const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const CassetteUtils = await hre.ethers.getContractFactory('CassetteUtils');
  const CassetteSection1 = await hre.ethers.getContractFactory(
    'CassetteSection1',
  );
  const CassetteSection2 = await hre.ethers.getContractFactory(
    'CassetteSection2',
  );
  const CassetteSection3 = await hre.ethers.getContractFactory(
    'CassetteSection3',
  );

  const cassetteUtils = await CassetteUtils.deploy();
  const cassetteSection1 = await CassetteSection1.deploy();
  const cassetteSection2 = await CassetteSection2.deploy();
  const cassetteSection3 = await CassetteSection3.deploy();

  await cassetteUtils.deployed();
  await cassetteSection1.deployed();
  await cassetteSection2.deployed();
  await cassetteSection3.deployed();

  console.log('Deployed CassetteUtils Libs to:', cassetteUtils.address);
  console.log('Deployed CassetteSection1 Libs to:', cassetteSection1.address);
  console.log('Deployed CassetteSection2 Libs to:', cassetteSection2.address);
  console.log('Deployed CassetteSection3 Libs to:', cassetteSection3.address);

  const CassetteContract = await hre.ethers.getContractFactory(
    'CassetteFactory',
    {
      libraries: {
        CassetteUtils: cassetteUtils.address,
        CassetteSection1: cassetteSection1.address,
        CassetteSection2: cassetteSection2.address,
        CassetteSection3: cassetteSection3.address,
      },
    },
  );
  const cassetteContract = await CassetteContract.deploy();
  await cassetteContract.deployed();
  console.log('Deployed Cassette NFT to:', cassetteContract.address);

  let config = `
  export const nftContract = "${cassetteContract.address}"
  `;

  let data = JSON.stringify(config);
  fs.writeFileSync('config.js', JSON.parse(data));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
