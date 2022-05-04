use crate::*;
use near_sdk::AccountId;
use near_sdk::collections::UnorderedMap;

#[derive(BorshDeserialize, BorshSerialize)]
pub struct MemberTreeNode {
    pub index: String,
    pub name: String,
    pub media: Option<String>,
    pub created: u64,
    pub account_id: AccountId,
    pub data: Option<String>,
    pub relations: UnorderedMap<String, String>,
    pub storage: u128
}


#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonMemberNode {
    pub index: String,
    pub name: String,
    pub media: String,
    pub account_id: AccountId,
    pub data: String,
    pub relations: Vec<(String, String)>,
    pub storage: U128
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct CreateNodeRequest {
    pub name: String,
    pub media: Option<String>,
    pub data: Option<String>
}

#[derive(BorshDeserialize, BorshSerialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct JsonRoot {
    pub name: String,
    pub index: String
}



impl MemberTreeNode {
    pub fn new(
        data: CreateNodeRequest, account_id: AccountId,
        index: String
    ) -> Self {
        MemberTreeNode {
            index: index.clone(),
            name: data.name,
            media: data.media,
            data: data.data,
            account_id: account_id,
            relations: UnorderedMap::new(StorageKeys::MemberNodeRelations {
                hash: index.clone() + "@r",
            }),
            created: util::current_time(),
            storage: 0
        }
    }

    pub fn to_json(&self) -> JsonMemberNode {
        JsonMemberNode {
            index: self.index.clone(),
            name: self.name.clone(),
            media: self.media.clone().unwrap_or("".to_string()),
            data: self.data.clone().unwrap_or("".to_string()),
            account_id: self.account_id.clone(),
            relations: self.relations.to_vec(),
            storage: self.storage.into()
        }
    }

    pub fn add_relation(&mut self, relation_type: &String, node_id: &String) {
        if self.relations.len() >= 50 {
            env::panic_str("Can't add more relations now")
        }
        // protect exists relation not to rewrite
        if self.relations.get(relation_type).is_some() {
            env::panic_str(&format!("Relation type {} exists in node[{}]", relation_type, node_id));
        }
        self.relations.insert(relation_type, node_id);
    }
}