import { parseNearAmount } from "near-api-js/lib/utils/format";

const GAS = 100000000000000;

export function getRootListPagnation(from_index, limit) {
  return window.contract.get_root_list(from_index, limit);
}

export function getRoots() {
    return window.contract.get_root_list();
}

export function getNodes(nodes) {
  return window.contract.get_nodes({nodes: nodes});
}

export function getNode(node_id) {
  return window.contract.get_node({node_id: node_id});
}

export function searchName(name) {
  return window.contract.search_name({name: name, absolute: false})
}

export async function createRoot(title, data) {
  await window.contract.create_root({ title: title, data: data }, GAS, parseNearAmount("0.005"));
}

export async function createNode(related_node_id, data, relation) {
  await window.contract.create_node({ related_node_id: related_node_id, data: data, relation_from: relation, relation_to: relation }, GAS, parseNearAmount("0.01"));
}

export async function createRelation(node_id, related_node_id, relation) {
  await window.contract.create_relation({ node_id: node_id, related_node_id: related_node_id, relation_from: relation, relation_to: relation }, GAS, parseNearAmount("0.01"));
}