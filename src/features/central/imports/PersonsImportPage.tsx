import { type SubmitEvent, useEffect, useState } from 'react';
import { Badge } from '../../../components/badges/Badge';
import { HttpError } from '../../../shared/api/httpError';
import { Button } from '../../../components/buttons/Button';
import { Card } from '../../../components/cards/Card';
import { ErrorMessage } from '../../../components/feedback/ErrorMessage';
import { Loading } from '../../../components/feedback/Loading';
import { Input } from '../../../components/forms/Input';
import { PageHeader } from '../../../components/page/PageHeader';
import { DataTable } from '../../../components/table/DataTable';
import { formatDateTime } from '../../../shared/utils/formatDate';
import {
  getPersonImportErrors,
  getPersonImportHistory,
  type PersonImportError,
  type PersonImportHistoryItem,
  type PersonImportResult,
  uploadPersonsXlsx,
} from '../api/importsApi';

function statusTone(status?: string): 'success' | 'warning' | 'danger' | 'muted' {
  if (!status) {
    return 'muted';
  }

  const normalized = status.toLowerCase();

  if (['ok', 'success', 'completed', 'done'].includes(normalized)) {
    return 'success';
  }

  if (['processing', 'partial'].includes(normalized)) {
    return 'warning';
  }

  if (['error', 'failed'].includes(normalized)) {
    return 'danger';
  }

  return 'muted';
}

export function PersonsImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<PersonImportHistoryItem[]>([]);
  const [errors, setErrors] = useState<PersonImportError[]>([]);
  const [selectedImportId, setSelectedImportId] = useState('');
  const [result, setResult] = useState<PersonImportResult | null>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorsLoading, setErrorsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState('');

  async function loadHistory() {
    try {
      setLoading(true);
      setError(null);

      setHistory(await getPersonImportHistory());
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки истории импорта');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(event: SubmitEvent) {
    event.preventDefault();

    if (!file) {
      setError('Выбери XLSX-файл');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setResult(null);

      const response = await uploadPersonsXlsx(file);

      setResult(response);

      await loadHistory();

    } catch (ex) {
    if (ex instanceof HttpError) {
      setError(ex.message);
      setRawError(JSON.stringify(ex.payload, null, 2));
    } else {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки XLSX');
      setRawError('');
    }
    } finally {
      setUploading(false);
    }
  }

  async function handleLoadErrors(importId: string) {
    try {
      setSelectedImportId(importId);
      setErrors([]);
      setErrorsLoading(true);
      setError(null);

      setErrors(await getPersonImportErrors(importId));
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : 'Ошибка загрузки ошибок импорта');
    } finally {
      setErrorsLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="ds-page">
      <PageHeader
        title="Импорт XLSX"
        description="Импорт физических лиц из Excel-файла"
        actions={
          <Button variant="secondary" onClick={loadHistory}>
            Обновить историю
          </Button>
        }
      />

      {error && <ErrorMessage message={error} />}
      {rawError && (
      <Card title="Raw backend error">
        <pre
          style={{
          overflow: 'auto',
          maxHeight: 360,
          padding: 16,
          borderRadius: 12,
          border: '1px solid var(--ds-border)',
          background: 'rgba(2, 10, 20, 0.45)',
          color: 'var(--ds-text-soft)',
        }}
        >
        {rawError}
        </pre>
      </Card>
      )}

      <Card
        title="Загрузить XLSX"
        subtitle="Файл должен соответствовать шаблону импорта физических лиц"
      >
        <form className="ds-grid ds-grid-2" onSubmit={handleUpload}>
          <Input
            label="XLSX-файл"
            type="file"
            accept=".xlsx"
            onChange={(event) => setFile(event.target.files?.[0] || null)}
          />

          <div style={{ alignSelf: 'end' }}>
            <Button type="submit" disabled={uploading || !file}>
              {uploading ? 'Импорт...' : 'Загрузить'}
            </Button>
          </div>
        </form>
      </Card>

      {result && (
        <Card title="Результат импорта">
          <div className="ds-grid ds-grid-3">
            <Metric label="Всего строк" value={result.totalRows ?? 0} />
            <Metric label="Успешно" value={result.successRows ?? 0} />
            <Metric label="Пропущено" value={result.skippedRows ?? 0} />
          </div>

          <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
            <Badge tone={statusTone(result.status)}>{result.status || '—'}</Badge>
            <Badge tone="muted">{result.message || '—'}</Badge>
          </div>
        </Card>
      )}

      <Card title="История импортов">
        {loading ? (
          <Loading />
        ) : (
          <DataTable
            data={history}
            getRowKey={(item) => item.id}
            columns={[
              {
                key: 'time',
                title: 'Дата',
                render: (item) => formatDateTime(item.createdAt),
              },
              {
                key: 'file',
                title: 'Файл',
                render: (item) => item.fileName || '—',
              },
              {
                key: 'status',
                title: 'Статус',
                render: (item) => (
                  <Badge tone={statusTone(item.status)}>
                    {item.status || '—'}
                  </Badge>
                ),
              },
              {
                key: 'total',
                title: 'Всего',
                render: (item) => item.totalRows ?? 0,
              },
              {
                key: 'success',
                title: 'Успешно',
                render: (item) => item.successRows ?? 0,
              },
              {
                key: 'skipped',
                title: 'Пропущено',
                render: (item) => item.skippedRows ?? 0,
              },
              {
                key: 'errors',
                title: 'Ошибки',
                render: (item) => item.errorRows ?? 0,
              },
              {
                key: 'actions',
                title: 'Действия',
                render: (item) => (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleLoadErrors(item.id)}
                  >
                    Ошибки
                  </Button>
                ),
              },
            ]}
          />
        )}
      </Card>

      {selectedImportId && (
        <Card title={`Ошибки импорта ${selectedImportId}`}>
          {errorsLoading ? (
            <Loading />
          ) : (
            <DataTable
              data={errors}
              getRowKey={(item) =>
                item.id || `${item.rowNumber}-${item.fieldName}-${item.message}`
              }
              columns={[
                {
                  key: 'row',
                  title: 'Строка',
                  render: (item) => item.rowNumber ?? '—',
                },
                {
                  key: 'field',
                  title: 'Поле',
                  render: (item) => item.fieldName || item.columnName || '—',
                },
                {
                  key: 'value',
                  title: 'Значение',
                  render: (item) => item.rawValue || '—',
                },
                {
                  key: 'message',
                  title: 'Ошибка',
                  render: (item) => item.message || '—',
                },
              ]}
            />
          )}
        </Card>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div style={{ fontSize: 30, fontWeight: 900 }}>{value}</div>
      <div style={{ color: 'var(--ds-text-muted)' }}>{label}</div>
    </div>
  );
}