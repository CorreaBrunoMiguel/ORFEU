#![cfg_attr(mobile, tauri::mobile_entry_point)]

use std::fs;
use serde_json::Value;
use tauri::command;
use std::path::PathBuf;

fn alters_dir() -> PathBuf {
    // CWD e runtime: ORFEU/app/src-tauri
    // Queremos chegar em: ORFEU/personas/alters
    let dir = PathBuf::from("../../personas/alters");
    dir
}


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

#[command]
fn list_alters() -> Result<Vec<Value>, String> {
    let dir = alters_dir();

    // Garante que a pasta existe
    if !dir.exists() {
        fs::create_dir_all(&dir)
            .map_err(|e| format!("Erro criando diretório de alters: {}", e))?;
        return Ok(vec![]); // sem alters ainda
    }

    let mut alters = Vec::new();

    let entries = fs::read_dir(&dir)
        .map_err(|e| format!("Erro lendo diretório de alters: {}", e))?;

    for entry in entries {
        let entry = entry.map_err(|e| format!("Erro lendo entrada de arquivo: {}", e))?;
        let path = entry.path();

        if path.extension().and_then(|e| e.to_str()) == Some("json") {
            let content = fs::read_to_string(&path)
                .map_err(|e| format!("Erro lendo alter {:?}: {}", path, e))?;
            let json: Value = serde_json::from_str(&content)
                .map_err(|e| format!("Erro parseando JSON de alter {:?}: {}", path, e))?;
            alters.push(json);
        }
    }

    Ok(alters)
}

#[command]
fn get_alter(id: String) -> Result<Value, String> {
    let mut path = alters_dir();
    path.push(format!("{id}.json"));

    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Erro lendo alter {}: {}", id, e))?;

    let json: Value = serde_json::from_str(&content)
        .map_err(|e| format!("Erro parseando JSON do alter {}: {}", id, e))?;

    Ok(json)
}


#[command]
fn save_alter(alter: Value) -> Result<(), String> {
    // Pega o id dentro do JSON
    let id = alter.get("id")
        .and_then(|v| v.as_str())
        .ok_or_else(|| "Campo 'id' ausente ou não-string no alter".to_string())?;

    let mut path = alters_dir();
    path.push(format!("{id}.json"));

    // Garante pasta
    if let Some(parent) = path.parent() {
        if !parent.exists() {
            fs::create_dir_all(parent)
                .map_err(|e| format!("Erro criando diretório de alters: {}", e))?;
        }
    }

    let content = serde_json::to_string_pretty(&alter)
        .map_err(|e| format!("Erro serializando alter {}: {}", id, e))?;

    fs::write(&path, content)
        .map_err(|e| format!("Erro escrevendo alter {}: {}", id, e))?;

    Ok(())
}

#[command]
fn delete_alter(id: String) -> Result<(), String> {
    let mut path = alters_dir();
    path.push(format!("{id}.json"));

    if path.exists() {
        fs::remove_file(&path)
            .map_err(|e| format!("Erro removendo alter {}: {}", id, e))?;
    }

    Ok(())
}

pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_orfeu_core,
            read_orfeu_fabrica,
            list_alters,
            get_alter,
            save_alter,
            delete_alter
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

