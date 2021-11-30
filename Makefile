include .env
export

# Make is verbose in Linux. Make it silent.
# MAKEFLAGS += --silent

node:
		npx hardhat node 

compile:
		npx hardhat compile

deploy:
		npx hardhat run scripts/deploy.js

deploy-rinkeby:
		npx hardhat run scripts/deploy.js --network rinkeby

clean:
		npx hardhat clean

