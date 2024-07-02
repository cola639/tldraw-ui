import { useEffect, useMemo, useState } from 'react';
import {
  computed,
  createPresenceStateDerivation,
  createTLStore,
  defaultShapeUtils,
  defaultUserPreferences,
  getUserPreferences,
  InstancePresenceRecordType,
  react,
  SerializedSchema,
  setUserPreferences,
  TLAnyShapeUtilConstructor,
  TLInstancePresence,
  TLRecord,
  TLStoreWithStatus
} from 'tldraw';
import { YKeyValue } from 'y-utility/y-keyvalue';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

export function useYjsStore({
  roomId = 'example',
  hostUrl = 'ws://localhost:1234',
  shapeUtils = []
}: Partial<{
  hostUrl: string;
  roomId: string;
  version: number;
  shapeUtils: TLAnyShapeUtilConstructor[];
}>) {
  // Init default data
  const initializeDefaultData = () => {
    const defaultSchema = store.schema.serialize();
    const defaultRecords = store.allRecords();

    yDoc.transact(() => {
      defaultRecords.forEach((record) => yStore.set(record.id, record));
      meta.set('schema', defaultSchema);
    });

    store.loadSnapshot({
      store: Object.fromEntries(defaultRecords.map((record) => [record.id, record])),
      schema: defaultSchema
    });
  };

  const [store] = useState(() => {
    // Shape utils
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils]
    });

    return store;
  });

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: 'loading'
  });

  const { yDoc, yStore, meta, room } = useMemo(() => {
    // 创建 Yjs 文档
    const yDoc = new Y.Doc({ gc: true });

    // 创建 Yjs 数组，使用 roomId 作为键名
    const yArr = yDoc.getArray<{ key: string; val: TLRecord }>(`tl_${roomId}`);

    // 创建 YKeyValue 对象，包装 yArr
    const yStore = new YKeyValue(yArr);

    // 创建 Meta 数据映射
    const meta = yDoc.getMap<SerializedSchema>('meta');

    // 创建 WebSocket 提供者，连接到服务器
    return {
      yDoc,
      yStore,
      meta,
      room: new WebsocketProvider(hostUrl, roomId, yDoc, { connect: true })
    };
  }, [hostUrl, roomId]);

  useEffect(() => {
    const unsubs: (() => void)[] = [];
    setStoreWithStatus({ status: 'loading' });

    function handleSync() {
      // 1 Connect store to yjs store and vice versa, for both the document and awareness
      /* -------------------- Document -------------------- */
      // Sync the yjs doc changes to the store
      const handleChange = (
        changes: Map<
          string,
          | { action: 'delete'; oldValue: TLRecord }
          | { action: 'update'; oldValue: TLRecord; newValue: TLRecord }
          | { action: 'add'; newValue: TLRecord }
        >,
        transaction: Y.Transaction
      ) => {
        if (transaction.local) return;

        const toRemove: TLRecord['id'][] = [];
        const toPut: TLRecord[] = [];

        changes.forEach((change, id) => {
          switch (change.action) {
            case 'add':
            case 'update': {
              const record = yStore.get(id)!;
              toPut.push(record);
              break;
            }
            case 'delete': {
              toRemove.push(id as TLRecord['id']);
              break;
            }
          }
        });

        // put / remove the records in the store
        store.mergeRemoteChanges(() => {
          if (toRemove.length) store.remove(toRemove);
          if (toPut.length) store.put(toPut);
        });
      };

      yStore.on('change', handleChange);
      unsubs.push(() => yStore.off('change', handleChange));

      // 处理客户端
      // Sync yjs awareness changes to the store
      const handleUpdate = (update: { added: number[]; updated: number[]; removed: number[] }) => {
        const states = room.awareness.getStates() as Map<number, { presence: TLInstancePresence }>;

        const toRemove: TLInstancePresence['id'][] = [];
        const toPut: TLInstancePresence[] = [];

        // 处理新加入的客户端
        // Connect records to put / remove
        for (const clientId of update.added) {
          const state = states.get(clientId);
          if (state?.presence && state.presence.id !== presenceId) {
            toPut.push(state.presence);
          }
        }
        // 处理更新的客户端
        for (const clientId of update.updated) {
          const state = states.get(clientId);
          if (state?.presence && state.presence.id !== presenceId) {
            toPut.push(state.presence);
          }
        }
        // 处理移除的客户端
        for (const clientId of update.removed) {
          toRemove.push(InstancePresenceRecordType.createId(clientId.toString()));
        }

        // 将更新应用到存储中
        // put / remove the records in the store
        store.mergeRemoteChanges(() => {
          if (toRemove.length) store.remove(toRemove);
          if (toPut.length) store.put(toPut);
        });
      };

      // 处理元数据（metadata）的更新
      const handleMetaUpdate = () => {
        const theirSchema = meta.get('schema');
        if (!theirSchema) {
          throw new Error('No schema found in the yjs doc');
        }
        // If the shared schema is newer than our schema, the user must refresh
        const newMigrations = store.schema.getMigrationsSince(theirSchema);

        if (!newMigrations.ok || newMigrations.value.length > 0) {
          window.alert('The schema has been updated. Please refresh the page.');
          yDoc.destroy();
        }
      };
      meta.observe(handleMetaUpdate);
      unsubs.push(() => meta.unobserve(handleMetaUpdate));

      room.awareness.on('update', handleUpdate);
      unsubs.push(() => room.awareness.off('update', handleUpdate));

      // 2.
      // Initialize the store with the yjs doc records—or,
      // if the yjs doc is empty, initialize the yjs doc with the default store records.
      if (yStore.yarray.length) {
        // Replace the store records with the yjs doc records
        const ourSchema = store.schema.serialize();
        const theirSchema = meta.get('schema');
        if (!theirSchema) {
          initializeDefaultData();
          // throw new Error('No schema found in the yjs doc')
        }

        const records = yStore.yarray.toJSON().map(({ val }) => val);

        const migrationResult = store.schema.migrateStoreSnapshot({
          schema: theirSchema as any,
          store: Object.fromEntries(records.map((record) => [record.id, record]))
        });
        if (migrationResult.type === 'error') {
          // if the schema is newer than ours, the user must refresh
          console.error(migrationResult.reason);
          window.alert('The schema has been updated. Please refresh the page.');
          return;
        }

        yDoc.transact(() => {
          // delete any deleted records from the yjs doc
          for (const r of records) {
            if (!migrationResult.value[r.id]) {
              yStore.delete(r.id);
            }
          }
          for (const r of Object.values(migrationResult.value) as TLRecord[]) {
            yStore.set(r.id, r);
          }
          meta.set('schema', ourSchema);
        });

        // console.log('store -->', migrationResult.value);
        // console.log('ourSchema -->', ourSchema);

        // 同步数据
        store.loadSnapshot({
          store: migrationResult.value,
          schema: ourSchema
        });
      } else {
        // Create the initial store records
        // Sync the store records to the yjs doc
        yDoc.transact(() => {
          for (const record of store.allRecords()) {
            yStore.set(record.id, record);
          }
          meta.set('schema', store.schema.serialize());
        });
      }

      setStoreWithStatus({
        store,
        status: 'synced-remote',
        connectionStatus: 'online'
      });
    }

    let hasConnectedBefore = false;
    function handleStatusChange({ status }: { status: 'disconnected' | 'connected' }) {
      // If we're disconnected, set the store status to 'synced-remote' and the connection status to 'offline'
      if (status === 'disconnected') {
        setStoreWithStatus({
          store,
          status: 'synced-remote',
          connectionStatus: 'offline'
        });
        return;
      }

      room.off('synced', handleSync);

      if (status === 'connected') {
        if (hasConnectedBefore) return;
        hasConnectedBefore = true;
        room.on('synced', handleSync);
        unsubs.push(() => room.off('synced', handleSync));
      }
    }
    room.on('status', handleStatusChange);

    /**
     * 这段代码是用来计算和管理用户首选项（如用户ID、颜色、姓名）并将其存储在 computed 状态中。具体来说，它创建了一个计算属性
     * （computed property），当相关数据发生变化时，这个计算属性会自动更新
     */
    const userPreferences = computed<{
      id: string;
      color: string;
      name: string;
    }>('userPreferences', () => {
      const user = getUserPreferences();
      return {
        id: user.id,
        color: user.color ?? defaultUserPreferences.color,
        name: user.name ?? defaultUserPreferences.name
      };
    });

    /* -------------------- Awareness ------------------- */
    const yClientId = room.awareness.clientID.toString();
    setUserPreferences({ id: yClientId });

    // Create the instance presence derivation
    const presenceId = InstancePresenceRecordType.createId(yClientId);
    const presenceDerivation = createPresenceStateDerivation(userPreferences, presenceId)(store);

    // Set our initial presence from the derivation's current value
    room.awareness.setLocalStateField('presence', presenceDerivation.get());

    // Sync store changes to the yjs doc
    unsubs.push(
      store.listen(
        async function syncStoreChangesToYjsDoc({ changes }) {
          yDoc.transact(() => {
            Object.values(changes.added).forEach((record) => {
              yStore.set(record.id, record);
            });

            Object.values(changes.updated).forEach(([_, record]) => {
              yStore.set(record.id, record);
            });

            Object.values(changes.removed).forEach((record) => {
              yStore.delete(record.id);
            });
          });
        },
        { source: 'user', scope: 'document' } // only sync user's document changes
      )
    );
    unsubs.push(() => room.off('status', handleStatusChange));

    // When the derivation change, sync presence to to yjs awareness
    unsubs.push(
      react('when presence changes', () => {
        const presence = presenceDerivation.get();
        requestAnimationFrame(() => {
          room.awareness.setLocalStateField('presence', presence);
        });
      })
    );

    return () => {
      unsubs.forEach((fn) => fn());
      unsubs.length = 0;
    };
  }, [room, yDoc, store, yStore, meta]);

  return storeWithStatus;
}
