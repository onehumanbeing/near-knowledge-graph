use near_sdk::{env, near_bindgen};
use crate::*;
use crate::nodes::*;

#[near_bindgen]
impl Contract {
    #[payable]
    pub fn create_root(
        &mut self, 
        title: String,
        data: CreateNodeRequest
    ) -> JsonMemberNode {
        if self.data().roots.get(&title).is_some() { env::panic_str("Tree title already exists"); }
        let initial_storage_usage = env::storage_usage();
        let index = self.gen_tree_index();
        let name = data.name.clone();
        let mut node = MemberTreeNode::new(data, env::signer_account_id(), index.clone());
        self.data_mut().node_count += 1;
        self.data_mut().names.insert(&name, &index);
        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;
        let storage_cost = env::storage_byte_cost() * required_storage_in_bytes as u128;
        let amount = env::attached_deposit();
        node.storage = storage_cost;
        if amount < storage_cost { env::panic_str(&format!("Insufficient deposited amount, {} $yoctoNEAR needed", storage_cost)); }
        self.data_mut().roots.insert(&title, &index);
        self.data_mut().nodes.insert(&index, &node);
        // refund
        util::transfer(&env::signer_account_id(), amount - storage_cost);
        node.to_json()
    }

    #[payable]
    pub fn create_node(
        &mut self, 
        data: CreateNodeRequest,
        related_node_id: String,
        relation_from: String,
        relation_to: String
    ) -> JsonMemberNode {
        let mut related_node = self.data_mut().nodes.get(&related_node_id).unwrap_or_else(|| env::panic_str("Related node not exists"));
        let initial_storage_usage = env::storage_usage();
        let index = self.gen_tree_index();
        let name = data.name.clone();
        let mut node = MemberTreeNode::new(data, env::signer_account_id(), index.clone());
        self.data_mut().node_count += 1;
        node.add_relation(&util::gen_relation(&relation_to, &related_node_id), &related_node_id);
        related_node.add_relation(&util::gen_relation(&relation_from, &index), &index);
        self.data_mut().nodes.insert(&related_node_id, &related_node);
        self.data_mut().names.insert(&name, &index);
        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;
        let storage_cost = env::storage_byte_cost() * required_storage_in_bytes as u128;
        let amount = env::attached_deposit();
        node.storage = storage_cost;
        if amount < storage_cost { env::panic_str(&format!("Insufficient deposited amount, {} $yoctoNEAR needed", storage_cost)); }
        self.data_mut().nodes.insert(&index, &node);
        // refund
        util::transfer(&env::signer_account_id(), amount - storage_cost);
        node.to_json()
    }

    #[payable]
    pub fn create_relation(
        &mut self, 
        node_id: String,
        related_node_id: String,
        relation_from: String,
        relation_to: String
    ) {
        let mut node = self.data_mut().nodes.get(&node_id).unwrap_or_else(|| env::panic_str("node not exists"));
        let mut related_node = self.data_mut().nodes.get(&related_node_id).unwrap_or_else(|| env::panic_str("Related node not exists"));
        let initial_storage_usage = env::storage_usage();
        node.add_relation(&util::gen_relation(&relation_to, &related_node_id), &related_node_id);
        related_node.add_relation(&util::gen_relation(&relation_from, &node_id), &node_id);
        self.data_mut().nodes.insert(&node_id, &node);
        self.data_mut().nodes.insert(&related_node_id, &related_node);
        let required_storage_in_bytes = env::storage_usage() - initial_storage_usage;
        let storage_cost = env::storage_byte_cost() * required_storage_in_bytes as u128;
        let amount = env::attached_deposit();
        if amount < storage_cost { env::panic_str(&format!("Insufficient deposited amount, {} $yoctoNEAR needed", storage_cost)); }
        // refund
        util::transfer(&env::signer_account_id(), amount - storage_cost);
    }
}