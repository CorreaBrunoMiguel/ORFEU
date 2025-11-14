import { invoke } from '@tauri-apps/api/core';

export async function getOrfeuCore() {
  const result = await invoke('read_orfeu_core');
  return result;
}

export async function getOrfeuFabrica() {
  const result = await invoke('read_orfeu_fabrica');
  return result;
}
