import type { CVData, TemplateId, TemplateLayoutState } from '../types/cv';

export interface ResumeModel {
  id: string;
  name: string;
  savedAt: number;
  data: CVData;
  templateLayouts: Partial<Record<TemplateId, TemplateLayoutState>>;
}
const databaseName = 'curriculums';
const databaseVersion = 1;
const modelsStore = 'models';

// New feature: save resume snapshots of resumees liek "different models" in browser IndexedDB.
function openModelsDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is unavailable in this browser.'));
      return;
    }
    const request = indexedDB.open(databaseName, databaseVersion);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(modelsStore)) {
        db.createObjectStore(modelsStore, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error('Could not open resume models.'));
  });
}

export async function getResumeModels(): Promise<ResumeModel[]> {
  const db = await openModelsDb();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(modelsStore, 'readonly');
    const request = transaction.objectStore(modelsStore).getAll();
    let listaModelos: ResumeModel[] = [];

    request.onsuccess = () => {
      listaModelos = (request.result as ResumeModel[]).sort((a, b) => b.savedAt - a.savedAt);
    };
    transaction.oncomplete = () => {
      db.close();
      resolve(listaModelos);
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? request.error ?? new Error('Could not read resume models.'));
    };
    transaction.onabort = () => {
      db.close();
      reject(transaction.error ?? new Error('Reading resume models was cancelled.'));
   };
 });
}

export async function saveResumeModel(model: ResumeModel): Promise<void> {
  const db = await openModelsDb();
      return new Promise((resolve, reject) => {
      const transaction = db.transaction(modelsStore, 'readwrite');
     transaction.objectStore(modelsStore).put(model);
     transaction.oncomplete = () => {
    db.close();
    resolve(); };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error('Could not save this resume model.'));
    };
    transaction.onabort = () => {
    db.close();
     reject(transaction.error ?? new Error('Saving this resume model was cancelled.'));
}; });
}
