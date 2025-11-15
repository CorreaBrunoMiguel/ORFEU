import { invoke } from '@tauri-apps/api/core';

export async function listAlters(): Promise<any[]> {
  const result = await invoke('list_alters');
  return result as any[];
}

export async function getAlter(id: string): Promise<any> {
  const result = await invoke('get_alter', { id });
  return result as any;
}

export async function saveAlter(alter: any): Promise<void> {
  await invoke('save_alter', { alter });
}

export async function deleteAlter(id: string): Promise<void> {
  await invoke('delete_alter', { id });
}
