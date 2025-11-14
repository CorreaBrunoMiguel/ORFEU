#![cfg_attr(mobile, tauri::mobile_entry_point)]

use std::fs;
use serde_json::Value;
use tauri::command;

#[command]
fn read_orfeu_core() -> Result<Value, String> {
    let path = "../../config/orfeu/orfeu_core.yaml";
    let content = fs::read_to_string(path)
        .map_err(|e| format!("Erro lendo orfeu_core.yaml: {}", e))?;

    let yaml: Value = serde_yaml::from_str(&content)
        .map_err(|e| format!("Erro parseando YAML: {}", e))?;

    Ok(yaml)
}

#[command]
fn read_orfeu_fabrica() -> Result<Value, String> {
    let path = "../../config/orfeu/orfeu_fabrica_de_almas.yaml";
    let content = fs::read_to_string(path)
        .map_err(|e| format!("Erro lendo orfeu_fabrica_de_almas.yaml: {}", e))?;

    let yaml: Value = serde_yaml::from_str(&content)
        .map_err(|e| format!("Erro parseando YAML: {}", e))?;

    Ok(yaml)
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_orfeu_core,
            read_orfeu_fabrica
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
