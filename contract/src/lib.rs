use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, TreeMap};
use near_sdk::json_types::U128;
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    env, near_bindgen, AccountId, PanicOnDefault, require, BorshStorageKey
};

mod nodes;
mod util;
mod view;
mod actions_of_nodes;


#[derive(BorshSerialize, BorshStorageKey)]
pub enum StorageKeys {
    MemberNodeRelations { hash: String },
    MemberNodeEmotion { hash: String },
    Nodes,
    Roots,
    Names
}


#[derive(BorshDeserialize, BorshSerialize)]
pub struct ContractData {
    owner_id: AccountId,
    roots: TreeMap<String, String>,
    nodes: LookupMap<String, nodes::MemberTreeNode>,
    node_count: u64,
    index: u64,
    names: TreeMap<String, String>
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum VersionedContractData {
    Current(ContractData),
}

impl VersionedContractData {}

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    data: VersionedContractData
}

// VersionedContractData design to migrate contrart state later if needed.
#[near_bindgen]
impl Contract {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            data: VersionedContractData::Current(ContractData {
                owner_id: owner_id,
                node_count: 0,
                nodes: LookupMap::new(StorageKeys::Nodes),
                roots: TreeMap::new(StorageKeys::Roots),
                names: TreeMap::new(StorageKeys::Names),
                index: 0
            }),
        }
    }
}

impl Contract {
    fn data(&self) -> &ContractData {
        match &self.data {
            VersionedContractData::Current(data) => data,
        }
    }

    fn data_mut(&mut self) -> &mut ContractData {
        match &mut self.data {
            VersionedContractData::Current(data) => data,
        }
    }

    // fn assert_owner(&self) {
    //     if env::signer_account_id() != self.data().owner_id {
    //         env::panic_str("Forbin");
    //     }
    // }

    fn gen_tree_index(&mut self) -> String {
        self.data_mut().index += 1;
        self.data().index.to_string()
    }
}

#[cfg(test)]
mod tests {
    use near_sdk::test_utils::{accounts, VMContextBuilder};
    use near_sdk::{testing_env};
    use crate::nodes::*;
    use super::*;

    fn setup_contract() -> (VMContextBuilder, Contract) {
        let mut context = VMContextBuilder::new();
        testing_env!(context.predecessor_account_id(accounts(0)).build());
        let contract = Contract::new(accounts(0));
        (context, contract)
    }

    fn create_simple_root(
        context: &mut VMContextBuilder,
        contract: &mut Contract,
        name: String
    ) -> JsonMemberNode {
        testing_env!(context
            .predecessor_account_id(accounts(0))
            .attached_deposit(env::storage_byte_cost() * 500)
            .build());
        contract.create_root(name.clone(), CreateNodeRequest {
            name: name, data: None, media: None
        })
    }

    fn create_simple_node(
        context: &mut VMContextBuilder,
        contract: &mut Contract,
        name: String,
        related_node_id: String
    ) -> JsonMemberNode {
        testing_env!(context
            .predecessor_account_id(accounts(0))
            .attached_deposit(env::storage_byte_cost() * 600)
            .build());
        contract.create_node(CreateNodeRequest {
            name: name, data: None, media: None
        }, related_node_id, String::from("1"), String::from("1"))
    }

    fn create_test_relation(
        context: &mut VMContextBuilder,
        contract: &mut Contract,
        node_id: String,
        related_node_id: String
    ) {
        testing_env!(context
            .predecessor_account_id(accounts(0))
            .attached_deposit(env::storage_byte_cost() * 600)
            .build());
        contract.create_relation(node_id, related_node_id, String::from("1"), String::from("1"));
    }

    // basics test, create a 3 nodes graph and connect them
    #[test]
    fn test_create_nodes() {
        let (mut context, mut contract) = setup_contract();
        let root = create_simple_root(&mut context, &mut contract, String::from("1"));
        assert_eq!(root.index, String::from("1"));
        let node_one = create_simple_node(&mut context, &mut contract, String::from("2"), String::from("1"));
        assert_eq!(node_one.index, String::from("2"));
        let root = contract.get_node(String::from("1"));
        // check relation len, 1-2
        assert_eq!(root.unwrap().relations.len(), 1);
        let node_two = create_simple_node(&mut context, &mut contract, String::from("3"), String::from("2"));
        assert_eq!(node_two.index, String::from("3"));
        create_test_relation(&mut context, &mut contract, String::from("1"), String::from("3"));
        let root = contract.get_node(String::from("1"));
        // check relation len, 1-2, 1-3
        assert_eq!(root.unwrap().relations.len(), 2);
    }

    // test search_name function
    #[test]
    fn test_search_name() {
        let (mut context, mut contract) = setup_contract();
        let root = create_simple_root(&mut context, &mut contract, String::from("Alice"));
        let node_one = create_simple_node(&mut context, &mut contract, String::from("Al"), String::from("1"));
        assert_eq!(contract.search_name(String::from("Ali"), true).len(), 0);
        assert_eq!(contract.search_name(String::from("Ali"), false).len(), 1);
        assert_eq!(contract.search_name(String::from("Al"), false).len(), 2);
        assert_eq!(contract.search_name(String::from("Al"), true).len(), 1);
        assert_eq!(contract.search_name(String::from("B"), true).len(), 0);
        assert_eq!(contract.search_name(String::from("a"), false).len(), 0);
    }
}