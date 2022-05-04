near call $CONTRACT_NAME create_root "$(<roots/grass.json)" --accountId prelaunch.testnet --amount 0.005
near call $CONTRACT_NAME create_node "$(<nodes/rabbit.json)" --accountId abaaba.testnet --amount 0.01
near call $CONTRACT_NAME create_node "$(<nodes/wolf.json)" --accountId abaaba.testnet --amount 0.01
near call $CONTRACT_NAME create_node "$(<nodes/decomposer.json)" --accountId abaaba.testnet --amount 0.01
near call $CONTRACT_NAME create_relation "$(<relations/decomposer_grass.json)" --accountId abaaba.testnet --amount 0.005
near call $CONTRACT_NAME create_node "$(<nodes/sheep.json)" --accountId abaaba.testnet --amount 0.01
near call $CONTRACT_NAME create_relation "$(<relations/sheep_wolf.json)" --accountId abaaba.testnet --amount 0.005