use near_sdk::near_bindgen;
use crate::*;
use crate::nodes::*;

#[near_bindgen]
impl Contract {
    // check if root name exists
    pub fn title_exists(&self, title: String) -> bool {
        self.data().roots.get(&title).is_some()
    }

    // get list of graphs
    pub fn get_root_list(
        &self, 
        from_index: Option<u64>,
        limit: Option<u64>
    ) -> Vec<JsonRoot> {
        let start_index: u128 = from_index.map(From::from).unwrap_or_default();
        require!(
            (self.data().roots.len() as u128) > start_index,
            "Out of bounds, please use a smaller from_index."
        );
        let limit = limit.map(|v| v as usize).unwrap_or(usize::MAX);
        require!(limit != 0, "Cannot provide limit of 0.");
        self.data().roots
            .iter()
            .skip(start_index as usize)
            .take(limit)
            .map(|(name, index)| JsonRoot {
                name: name,
                index: index
            })
            .collect()
    }

    // get node by id
    pub fn get_node(&self, node_id: String) -> Option<JsonMemberNode> {
        if let Some(node) = self.data().nodes.get(&node_id) {
            Some(node.to_json())
        } else {
            None
        }
    }

    // get nodes by ids
    pub fn get_nodes(&self, nodes: Vec<String>) -> Vec<JsonMemberNode> {
        nodes.iter().map(|node_id| self.data().nodes.get(&node_id).unwrap().to_json()).collect()
    }
    
    // search node by name
    pub fn search_name(&self, name: String, absolute: bool) -> Vec<(String, String)> {
        self.data().names.iter().filter(|(node_name, _index)| if absolute { *node_name == name } else { node_name.contains(&name) } ).collect()
    }

    // check the lastest index for developer use
    pub fn get_lastest_index(&self) -> u64 {
        self.data().index
    }
}