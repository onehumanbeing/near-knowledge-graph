#!/bin/bash
set -e

RUSTFLAGS='-C link-arg=-s --cfg feature="testnet"' cargo build --target wasm32-unknown-unknown --release
cp target/wasm32-unknown-unknown/release/knowledge_graph.wasm out/main.wasm