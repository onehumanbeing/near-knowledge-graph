use near_sdk::{env, Promise, AccountId};


pub fn transfer(account_id: &AccountId, amount: u128) -> Option<Promise> {
    if amount > 0 {
        return Some(Promise::new(account_id.clone()).transfer(amount));
    };
    None
}

pub fn current_time() -> u64 {
    let nano_to_sec = 1000000000 as u64;
    env::block_timestamp() as u64  / nano_to_sec
}

pub fn gen_relation(relation_type: &String, node_id: &String) -> String {
    relation_type.to_owned() + "@" + node_id
}