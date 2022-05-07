use near_sdk::{env, Promise, AccountId};

// transfer function
pub fn transfer(account_id: &AccountId, amount: u128) -> Option<Promise> {
    if amount > 0 {
        return Some(Promise::new(account_id.clone()).transfer(amount));
    };
    None
}

// get current time UTC timestamp
pub fn current_time() -> u64 {
    let nano_to_sec = 1000000000 as u64;
    env::block_timestamp() as u64  / nano_to_sec
}

// create a unique relation index in a node, relation_type maybe be same so need to add node_id
pub fn gen_relation(relation_type: &String, node_id: &String) -> String {
    relation_type.to_owned() + "@" + node_id
}