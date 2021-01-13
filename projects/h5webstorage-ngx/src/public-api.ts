/*
 * Public API Surface of h5webstorage-ngx
 */

// export * from './old/lib/h5webstorage-ngx.service';
// export * from './old/lib/h5webstorage-ngx.component';
// export * from './old/lib/h5webstorage-ngx.module';

export * from './h5webstorage-lib.module';
export * from './base-storage.service';
export { LocalStorageService as LocalStorage, LOCAL_STORAGE_OBJECT } from './local-storage.service';
export { SessionStorageService as SessionStorage, SESSION_STORAGE_OBJECT } from './session-storage.service';
export * from './storage-property';
