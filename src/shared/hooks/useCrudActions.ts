import { useState } from 'react';

export function useCrudActions<TItem extends { id: string }>() {
  const [editItem, setEditItem] = useState<TItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<TItem | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  function openEdit(item: TItem) {
    setEditItem(item);
    setActionMessage(null);
  }

  function closeEdit() {
    setEditItem(null);
  }

  function openDelete(item: TItem) {
    setDeleteItem(item);
    setActionMessage(null);
  }

  function closeDelete() {
    setDeleteItem(null);
  }

  return {
    editItem,
    deleteItem,
    actionLoading,
    actionMessage,

    setEditItem,
    setDeleteItem,
    setActionLoading,
    setActionMessage,

    openEdit,
    closeEdit,
    openDelete,
    closeDelete,
  };
}